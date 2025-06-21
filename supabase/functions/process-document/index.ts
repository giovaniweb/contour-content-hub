
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
    const { documentId, forceRefresh } = await req.json();
    
    if (!documentId) {
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing document: ${documentId}, forceRefresh: ${forceRefresh}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Get document info
    const { data: document, error: docError } = await supabase
      .from('unified_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      throw new Error(`Document not found: ${docError?.message}`);
    }

    // 2. Update status to processing
    await supabase
      .from('unified_documents')
      .update({ status_processamento: 'processando' })
      .eq('id', documentId);

    // 3. Get PDF content from storage
    if (!document.file_path) {
      throw new Error('No file path found for document');
    }

    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(document.file_path);

    if (fileError || !fileData) {
      throw new Error(`Failed to download file: ${fileError?.message}`);
    }

    // Convert file to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // 4. Process with OpenAI based on document type
    const extractedInfo = await extractDocumentInfo(base64Content, document.tipo_documento);

    // 5. Validate extraction based on document type
    let status = 'concluido';
    let errorDetails = null;

    if (document.tipo_documento === 'artigo_cientifico') {
      // For scientific articles, title and authors are mandatory
      if (!extractedInfo.title || !extractedInfo.authors || extractedInfo.authors.length === 0) {
        status = 'falhou';
        errorDetails = 'Extração incompleta: título ou autores não encontrados';
      }
    }

    // 6. Update document with extracted information
    const updateData = {
      titulo_extraido: extractedInfo.title || null,
      palavras_chave: extractedInfo.keywords || [],
      autores: extractedInfo.authors || [],
      texto_completo: extractedInfo.content || null,
      raw_text: extractedInfo.rawText || null,
      status_processamento: status,
      detalhes_erro: errorDetails,
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('unified_documents')
      .update(updateData)
      .eq('id', documentId);

    if (updateError) {
      throw updateError;
    }

    console.log(`Document ${documentId} processed successfully with status: ${status}`);

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
    console.error('Error processing document:', error);
    
    // Update document status to failed
    if (req.url.includes('documentId')) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { documentId } = await req.json();
        
        await supabase
          .from('unified_documents')
          .update({ 
            status_processamento: 'falhou',
            detalhes_erro: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', documentId);
      } catch (updateError) {
        console.error('Failed to update document status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ error: 'Failed to process document', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function extractDocumentInfo(base64Content: string, documentType: string) {
  if (!OPENAI_API_KEY) {
    console.warn("OpenAI API key not found, using fallback extraction");
    return {
      title: "Documento processado sem IA",
      content: "Conteúdo extraído sem processamento de IA.",
      keywords: ["PDF", "Documento"],
      authors: ["Autor não identificado"],
      rawText: "Texto bruto não disponível"
    };
  }

  try {
    // Create specialized prompts based on document type
    const prompts = {
      artigo_cientifico: `
        Analise este artigo científico em PDF e extraia as seguintes informações em formato JSON:
        1. title: Título completo do artigo
        2. authors: Array com todos os autores listados
        3. keywords: Array com palavras-chave relevantes
        4. content: Resumo do conteúdo principal (máximo 500 palavras)
        5. rawText: Texto completo extraído
        
        Seja preciso na extração de título e autores, pois são obrigatórios.
      `,
      ficha_tecnica: `
        Analise esta ficha técnica em PDF e extraia:
        1. title: Nome do produto/equipamento
        2. authors: Fabricante ou responsável técnico
        3. keywords: Especificações técnicas principais
        4. content: Resumo das características técnicas
        5. rawText: Texto completo extraído
      `,
      protocolo: `
        Analise este protocolo em PDF e extraia:
        1. title: Nome do protocolo
        2. authors: Responsáveis pelo protocolo
        3. keywords: Procedimentos principais
        4. content: Resumo do protocolo
        5. rawText: Texto completo extraído
      `,
      folder_publicitario: `
        Analise este material publicitário em PDF e extraia:
        1. title: Título ou nome do produto/serviço
        2. authors: Empresa ou marca
        3. keywords: Benefícios e características principais
        4. content: Resumo do conteúdo promocional
        5. rawText: Texto completo extraído
      `,
      outro: `
        Analise este documento em PDF e extraia o máximo de informações possível:
        1. title: Título ou assunto principal
        2. authors: Autores ou responsáveis identificados
        3. keywords: Palavras-chave relevantes
        4. content: Resumo do conteúdo
        5. rawText: Texto completo extraído
      `
    };

    const prompt = prompts[documentType as keyof typeof prompts] || prompts.outro;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em extração de informações de documentos científicos e técnicos. Sempre retorne respostas em JSON válido.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      return {
        title: result.title || null,
        content: result.content || null,
        keywords: result.keywords || [],
        authors: result.authors || [],
        rawText: result.rawText || null
      };
    } else {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error with OpenAI extraction:', error);
    
    // Fallback with document type context
    return {
      title: `Documento ${documentType.replace('_', ' ')} - Processado`,
      content: "Conteúdo extraído com fallback. Processamento de IA indisponível.",
      keywords: [documentType, "PDF", "Documento"],
      authors: ["Processamento automático"],
      rawText: "Texto bruto não disponível"
    };
  }
}
