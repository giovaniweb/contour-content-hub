
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
    console.log('🤖 [AskDocument] Iniciando processamento de pergunta...');
    const { documentId, question } = await req.json();
    
    if (!documentId || !question) {
      console.error('❌ [AskDocument] Parâmetros obrigatórios não fornecidos');
      return new Response(
        JSON.stringify({ error: 'Document ID e pergunta são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📄 [AskDocument] Pergunta sobre documento: ${documentId}`);
    console.log(`❓ [AskDocument] Pergunta: ${question}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Buscar documento na unified_documents
    console.log('🔍 [AskDocument] Buscando documento...');
    const { data: document, error: docError } = await supabase
      .from('unified_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      console.error('❌ [AskDocument] Documento não encontrado:', docError);
      return new Response(
        JSON.stringify({ error: 'Documento não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ [AskDocument] Documento encontrado:', document.titulo_extraido);

    // 2. Verificar se o documento tem conteúdo para análise
    const documentContent = document.texto_completo || document.raw_text;
    
    if (!documentContent) {
      console.warn('⚠️ [AskDocument] Documento sem conteúdo processado');
      return new Response(
        JSON.stringify({ 
          error: 'Este documento ainda não foi processado ou não possui conteúdo extraído.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Processar pergunta com IA
    let answer;

    if (OPENAI_API_KEY) {
      console.log('🤖 [AskDocument] Processando com OpenAI...');
      try {
        answer = await processWithOpenAI(question, documentContent, document);
      } catch (openaiError) {
        console.warn('⚠️ [AskDocument] Erro OpenAI, usando resposta padrão:', openaiError);
        answer = generateFallbackAnswer(question, document);
      }
    } else {
      console.log('📝 [AskDocument] Sem OpenAI, usando resposta padrão...');
      answer = generateFallbackAnswer(question, document);
    }

    console.log('✅ [AskDocument] Resposta gerada com sucesso');

    return new Response(
      JSON.stringify({ 
        success: true,
        answer,
        documentTitle: document.titulo_extraido || 'Documento',
        documentType: document.tipo_documento
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 [AskDocument] Erro crítico:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function processWithOpenAI(question: string, documentContent: string, document: any): Promise<string> {
  const systemPrompt = `Você é um assistente especializado em análise de documentos científicos e técnicos. 
Responda à pergunta do usuário baseando-se exclusivamente no conteúdo do documento fornecido.

INFORMAÇÕES DO DOCUMENTO:
- Título: ${document.titulo_extraido || 'Não especificado'}
- Tipo: ${document.tipo_documento || 'Não especificado'}
- Autores: ${document.autores?.join(', ') || 'Não especificados'}
- Palavras-chave: ${document.palavras_chave?.join(', ') || 'Não especificadas'}

DIRETRIZES:
1. Responda apenas com base no conteúdo fornecido
2. Se a pergunta não puder ser respondida com as informações disponíveis, diga isso claramente
3. Seja preciso e objetivo
4. Use português brasileiro
5. Cite trechos específicos quando relevante`;

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: `CONTEÚDO DO DOCUMENTO:\n${documentContent.substring(0, 3000)}\n\nPERGUNTA: ${question}`
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [AskDocument] Erro OpenAI:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const answer = result.choices[0]?.message?.content;
    
    if (!answer) {
      throw new Error('Resposta vazia da OpenAI');
    }

    return answer;
  } catch (error) {
    console.error('❌ [AskDocument] Erro ao processar com OpenAI:', error);
    throw error;
  }
}

function generateFallbackAnswer(question: string, document: any): string {
  const questionLower = question.toLowerCase();
  
  // Respostas baseadas em palavras-chave da pergunta
  if (questionLower.includes('título') || questionLower.includes('nome')) {
    return `O título deste documento é: "${document.titulo_extraido || 'Título não especificado'}"`;
  }
  
  if (questionLower.includes('autor') || questionLower.includes('quem escreveu')) {
    const autores = document.autores || [];
    if (autores.length > 0) {
      return `O(s) autor(es) deste documento são: ${autores.join(', ')}`;
    }
    return 'Informações sobre autores não estão disponíveis neste documento.';
  }
  
  if (questionLower.includes('resumo') || questionLower.includes('sobre o que')) {
    const resumo = document.texto_completo;
    if (resumo && resumo.length > 50) {
      return `Com base no conteúdo disponível: ${resumo.substring(0, 300)}${resumo.length > 300 ? '...' : ''}`;
    }
    return 'Resumo não disponível para este documento.';
  }
  
  if (questionLower.includes('palavra') && questionLower.includes('chave')) {
    const palavrasChave = document.palavras_chave || [];
    if (palavrasChave.length > 0) {
      return `As palavras-chave deste documento são: ${palavrasChave.join(', ')}`;
    }
    return 'Palavras-chave não foram identificadas neste documento.';
  }
  
  if (questionLower.includes('tipo') || questionLower.includes('categoria')) {
    const tipo = document.tipo_documento || 'não especificado';
    return `Este documento é classificado como: ${tipo.replace('_', ' ')}`;
  }
  
  // Resposta padrão
  return `Desculpe, não consigo responder especificamente à sua pergunta com as informações disponíveis deste documento. 

**Informações disponíveis:**
- **Título:** ${document.titulo_extraido || 'Não especificado'}
- **Tipo:** ${document.tipo_documento?.replace('_', ' ') || 'Não especificado'}
- **Autores:** ${document.autores?.join(', ') || 'Não especificados'}
- **Palavras-chave:** ${document.palavras_chave?.join(', ') || 'Não especificadas'}

Tente fazer uma pergunta mais específica sobre o título, autores, ou conteúdo geral do documento.`;
}
