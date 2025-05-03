
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get document ID and question from request
    const { documentId, question } = await req.json();

    if (!documentId || !question) {
      return new Response(
        JSON.stringify({ error: 'Document ID and question are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get document from database
    const { data: document, error: docError } = await supabase
      .from('documentos_tecnicos')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return new Response(
        JSON.stringify({ error: 'Document not found', details: docError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!document.conteudo_extraido) {
      return new Response(
        JSON.stringify({ error: 'Document has no extracted content' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user ID from JWT token
    const authHeader = req.headers.get('Authorization');
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      
      if (!userError && userData?.user) {
        userId = userData.user.id;
      }
    }

    // Use OpenAI to answer the question based on the document content
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are a helpful assistant that answers questions based on document content. 
                     You should only answer with information that is present in the document.
                     If the answer is not in the document, say so clearly.
                     Document content: ${document.conteudo_extraido}`
          },
          {
            role: 'user',
            content: question
          }
        ],
      }),
    });

    if (!gptResponse.ok) {
      const errorData = await gptResponse.json();
      return new Response(
        JSON.stringify({ error: 'Failed to generate answer', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const gptData = await gptResponse.json();
    const answer = gptData.choices[0].message.content;

    // Log question in document access history
    if (userId) {
      await supabase
        .from('document_access_history')
        .insert({
          document_id: documentId,
          user_id: userId,
          action_type: 'question',
          details: { question, answer }
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        answer,
        sourceDcoument: document.titulo
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error answering question:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
