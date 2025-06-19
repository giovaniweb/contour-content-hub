
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
    const { documentId, question } = await req.json();
    
    if (!documentId || !question) {
      return new Response(
        JSON.stringify({ error: 'Document ID and question are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get document content
    const { data: document, error } = await supabase
      .from('documentos_tecnicos')
      .select('titulo, conteudo_extraido, keywords, researchers')
      .eq('id', documentId)
      .single();

    if (error || !document) {
      return new Response(
        JSON.stringify({ error: 'Document not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const answer = await generateAnswer(question, document);

    return new Response(
      JSON.stringify({ 
        success: true,
        answer,
        question,
        documentTitle: document.titulo
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error answering question:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to answer question', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateAnswer(question: string, document: any) {
  if (!OPENAI_API_KEY) {
    return `Baseado no documento "${document.titulo}", esta é uma resposta simulada para a pergunta: "${question}". Para respostas mais precisas, configure a chave da API OpenAI.`;
  }

  try {
    const context = `
      Documento: ${document.titulo}
      Conteúdo: ${document.conteudo_extraido || 'Conteúdo não disponível'}
      Pesquisadores: ${document.researchers?.join(', ') || 'Não informado'}
      Palavras-chave: ${document.keywords?.join(', ') || 'Não informado'}
    `;

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
            content: 'Você é um assistente especializado em analisar documentos científicos. Responda perguntas baseadas exclusivamente no conteúdo fornecido. Se a informação não estiver disponível no documento, diga isso claramente.' 
          },
          { 
            role: 'user', 
            content: `Contexto do documento:\n${context}\n\nPergunta: ${question}\n\nPor favor, responda baseado apenas nas informações do documento fornecido.` 
          }
        ]
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0].message.content;
    } else {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error generating answer:', error);
    return `Baseado no documento "${document.titulo}", não foi possível gerar uma resposta precisa para: "${question}". Erro: ${error.message}`;
  }
}
