
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
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    let userId = null;

    // Get User ID from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        // Note: Using service_role_key for supabase.auth.getUser.
        // This is generally okay for server-to-server, but if this token is a user's JWT,
        // ensure your RLS policies are correctly set up or consider using anon key for user-specific actions.
        // For just getting user ID from a valid JWT, service_role_key should work.
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser(token);
            if (userError) {
                console.warn('Error getting user from token:', userError.message);
            } else if (user) {
                userId = user.id;
                console.log(`User ID from token: ${userId}`);
            } else {
                console.log('No user found for the provided token.');
            }
        } catch (e) {
            console.warn('Exception during token processing for user ID:', e.message);
        }
    } else {
        console.log('No Authorization header found, user ID will be null.');
    }

    const { documentId, question } = await req.json();
    
    if (!documentId || !question) {
      return new Response(
        JSON.stringify({ error: 'Document ID and question are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
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

    if (userId && documentId && answer) {
      try {
        const { error: historyError } = await supabase
          .from('document_access_history')
          .insert({
            document_id: documentId,
            user_id: userId,
            action_type: 'question', // tipo de ação
            details: { question: question, answer: answer } // detalhes em JSONB
          });
        if (historyError) {
          console.warn('Failed to log question to access history:', historyError.message);
          // Não tratar como erro fatal para a resposta da pergunta
        } else {
          console.log(`Question logged for document ${documentId} by user ${userId}`);
        }
      } catch (logCatchError) {
        console.warn('Exception during history logging:', logCatchError.message);
      }
    }

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
    console.error('Error answering question:', error.message ? error.message : error);
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
