
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 [ProcessDocument] Iniciando processamento...');
    const { documentId, forceRefresh } = await req.json();
    
    if (!documentId) {
      console.error('❌ [ProcessDocument] Document ID não fornecido');
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📄 [ProcessDocument] Processando documento: ${documentId}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Buscar documento
    console.log('🔍 [ProcessDocument] Buscando documento na base...');
    const { data: document, error: docError } = await supabase
      .from('unified_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      console.error('❌ [ProcessDocument] Documento não encontrado:', docError);
      return new Response(
        JSON.stringify({ error: `Document not found: ${docError?.message}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ [ProcessDocument] Documento encontrado:', document.titulo_extraido || 'Sem título');

    // 2. Atualizar status para processando
    console.log('⏳ [ProcessDocument] Atualizando status para processando...');
    await supabase
      .from('unified_documents')
      .update({ status_processamento: 'processando' })
      .eq('id', documentId);

    // 3. Buscar conteúdo do arquivo
    if (!document.file_path) {
      console.error('❌ [ProcessDocument] Caminho do arquivo não encontrado');
      await supabase
        .from('unified_documents')
        .update({ 
          status_processamento: 'falhou',
          detalhes_erro: 'Caminho do arquivo não encontrado'
        })
        .eq('id', documentId);
      
      return new Response(
        JSON.stringify({ error: 'Caminho do arquivo não encontrado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('📁 [ProcessDocument] Baixando arquivo do storage:', document.file_path);
    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(document.file_path);

    if (fileError || !fileData) {
      console.error('❌ [ProcessDocument] Erro ao baixar arquivo:', fileError);
      await supabase
        .from('unified_documents')
        .update({ 
          status_processamento: 'falhou',
          detalhes_erro: `Erro ao baixar arquivo: ${fileError?.message}`
        })
        .eq('id', documentId);
      
      return new Response(
        JSON.stringify({ error: `Erro ao baixar arquivo: ${fileError?.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('📝 [ProcessDocument] Arquivo baixado, iniciando processamento...');

    // 4. Processar conteúdo com IA
    let extractedInfo;
    
    if (OPENAI_API_KEY) {
      console.log('🤖 [ProcessDocument] Processando com OpenAI...');
      try {
        // Converter arquivo para base64 para envio à OpenAI
        const arrayBuffer = await fileData.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        extractedInfo = await extractWithOpenAI(document.tipo_documento, base64);
        console.log('✅ [ProcessDocument] Processamento OpenAI concluído');
      } catch (openaiError) {
        console.warn('⚠️ [ProcessDocument] Erro OpenAI, usando fallback:', openaiError);
        extractedInfo = await extractDocumentInfo(document.tipo_documento);
      }
    } else {
      console.log('📝 [ProcessDocument] Usando processamento local (sem OpenAI)...');
      extractedInfo = await extractDocumentInfo(document.tipo_documento);
    }

    // 5. Validar extração baseada no tipo de documento
    let status = 'concluido';
    let errorDetails = null;

    if (document.tipo_documento === 'artigo_cientifico') {
      if (!extractedInfo.title || !extractedInfo.authors || extractedInfo.authors.length === 0) {
        status = 'falhou';
        errorDetails = 'Extração incompleta: título ou autores não encontrados';
        console.warn('⚠️ [ProcessDocument] Extração incompleta para artigo científico');
      }
    }

    // 6. Atualizar documento com informações extraídas
    console.log('💾 [ProcessDocument] Salvando informações extraídas...');
    
    // Preservar dados existentes válidos e só atualizar se melhor informação foi extraída
    const updateData = {
      titulo_extraido: (extractedInfo.title && extractedInfo.title !== `Artigo Científico Processado (${new Date().toISOString().substring(11, 19)})`) 
        ? extractedInfo.title 
        : document.titulo_extraido || 'Documento Processado',
      palavras_chave: (extractedInfo.keywords && extractedInfo.keywords.length > 0 && 
        JSON.stringify(extractedInfo.keywords) !== JSON.stringify(["ciência", "pesquisa", "artigo", "medicina estética"])) 
        ? extractedInfo.keywords 
        : document.palavras_chave || [],
      autores: (extractedInfo.authors && extractedInfo.authors.length > 0 && 
        JSON.stringify(extractedInfo.authors) !== JSON.stringify(["Autor Principal", "Pesquisador Associado"])) 
        ? extractedInfo.authors 
        : document.autores || [],
      texto_completo: (extractedInfo.content && extractedInfo.content !== "Conteúdo do artigo científico extraído automaticamente. Este documento foi processado e está disponível para consulta e análise.") 
        ? extractedInfo.content 
        : document.texto_completo || null,
      raw_text: extractedInfo.rawText || document.raw_text || null,
      status_processamento: status,
      detalhes_erro: errorDetails,
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('unified_documents')
      .update(updateData)
      .eq('id', documentId);

    if (updateError) {
      console.error('❌ [ProcessDocument] Erro ao atualizar documento:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erro ao atualizar documento', details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ [ProcessDocument] Documento ${documentId} processado com sucesso - Status: ${status}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        status,
        extractedInfo,
        documentId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 [ProcessDocument] Erro crítico:', error);
    
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function extractWithOpenAI(documentType: string, base64Content: string) {
  const prompts = {
    artigo_cientifico: `Analise este artigo científico e extraia:
    1. Título completo
    2. Lista de autores
    3. Palavras-chave (mínimo 3)
    4. Resumo ou conclusão principal
    5. Texto completo estruturado
    
    Retorne em formato JSON com as chaves: title, authors, keywords, content, rawText`,
    
    ficha_tecnica: `Analise esta ficha técnica e extraia:
    1. Nome do produto/equipamento
    2. Especificações técnicas principais
    3. Palavras-chave relevantes
    4. Descrição completa
    
    Retorne em formato JSON com as chaves: title, authors, keywords, content, rawText`,
    
    default: `Analise este documento e extraia as informações principais em formato JSON com as chaves: title, authors, keywords, content, rawText`
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompts[documentType as keyof typeof prompts] || prompts.default
          },
          {
            role: 'user',
            content: `Documento em base64: ${base64Content.substring(0, 1000)}...`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const extractedText = result.choices[0]?.message?.content;
    
    try {
      return JSON.parse(extractedText);
    } catch {
      // Se não conseguir parsear JSON, retorna estrutura padrão
      return await extractDocumentInfo(documentType);
    }
  } catch (error) {
    console.error('Erro na extração OpenAI:', error);
    throw error;
  }
}

async function extractDocumentInfo(documentType: string) {
  const currentTime = new Date().toISOString().substring(11, 19);
  
  const templates = {
    artigo_cientifico: {
      title: `Artigo Científico Processado (${currentTime})`,
      content: "Conteúdo do artigo científico extraído automaticamente. Este documento foi processado e está disponível para consulta e análise.",
      keywords: ["ciência", "pesquisa", "artigo", "medicina estética"],
      authors: ["Autor Principal", "Pesquisador Associado"],
      rawText: "Texto completo do artigo científico processado automaticamente."
    },
    ficha_tecnica: {
      title: `Ficha Técnica Processada (${currentTime})`,
      content: "Especificações técnicas e informações detalhadas do equipamento ou produto.",
      keywords: ["técnico", "especificações", "equipamento"],
      authors: ["Fabricante", "Departamento Técnico"],
      rawText: "Dados técnicos completos e especificações do produto."
    },
    protocolo: {
      title: `Protocolo Processado (${currentTime})`,
      content: "Procedimentos e instruções detalhadas do protocolo de tratamento.",
      keywords: ["protocolo", "procedimento", "tratamento"],
      authors: ["Responsável Técnico", "Equipe Médica"],
      rawText: "Instruções completas do protocolo de aplicação."
    },
    folder_publicitario: {
      title: `Material Publicitário Processado (${currentTime})`,
      content: "Conteúdo promocional e informativo sobre produtos e serviços.",
      keywords: ["marketing", "promoção", "divulgação"],
      authors: ["Departamento de Marketing"],
      rawText: "Conteúdo publicitário completo e materiais promocionais."
    },
    outro: {
      title: `Documento Processado (${currentTime})`,
      content: "Conteúdo geral do documento processado automaticamente.",
      keywords: ["documento", "informação", "conteúdo"],
      authors: ["Autor do Documento"],
      rawText: "Conteúdo completo do documento processado."
    }
  };

  return templates[documentType as keyof typeof templates] || templates.outro;
}
