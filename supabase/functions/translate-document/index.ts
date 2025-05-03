
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
    // Get document ID and target language from request
    const { documentId, targetLanguage } = await req.json();

    if (!documentId || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Document ID and target language are required' }),
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
        JSON.stringify({ error: 'Document has no extracted content to translate' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already translated to this language
    if (document.idiomas_traduzidos?.includes(targetLanguage)) {
      return new Response(
        JSON.stringify({ error: 'Document is already translated to this language' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get language names for prompt
    const getLanguageName = (code: string) => {
      switch (code) {
        case 'pt': return 'Portuguese';
        case 'en': return 'English';
        case 'es': return 'Spanish';
        default: return code;
      }
    };

    const sourceLanguageName = getLanguageName(document.idioma_original);
    const targetLanguageName = getLanguageName(targetLanguage);

    // Use OpenAI to translate the document content
    const translationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are a professional translator. Translate the following text from ${sourceLanguageName} to ${targetLanguageName}.
                     Maintain the original formatting, including paragraphs, bullet points, and any special markers.
                     Preserve all technical terms and proper names.
                     Your translation should sound natural and professional in ${targetLanguageName}.`
          },
          {
            role: 'user',
            content: document.conteudo_extraido
          }
        ],
      }),
    });

    if (!translationResponse.ok) {
      const errorData = await translationResponse.json();
      return new Response(
        JSON.stringify({ error: 'Failed to translate document', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const translationData = await translationResponse.json();
    const translatedContent = translationData.choices[0].message.content;

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

    // Create a new translation document
    const translationDocumentData = {
      titulo: `[${targetLanguage.toUpperCase()}] ${document.titulo}`,
      descricao: document.descricao,
      tipo: document.tipo,
      equipamento_id: document.equipamento_id,
      link_dropbox: document.link_dropbox,
      idioma_original: targetLanguage,
      conteudo_extraido: translatedContent,
      status: 'ativo',
      criado_por: userId || document.criado_por,
      documento_original_id: document.id
    };

    // Store translation in database
    const { data: translationDoc, error: translationInsertError } = await supabase
      .from('documentos_tecnicos')
      .insert(translationDocumentData)
      .select()
      .single();

    if (translationInsertError) {
      return new Response(
        JSON.stringify({ error: 'Failed to store translation', details: translationInsertError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update original document with new translation language
    const updatedLanguages = [...(document.idiomas_traduzidos || []), targetLanguage];
    
    const { error: updateError } = await supabase
      .from('documentos_tecnicos')
      .update({
        idiomas_traduzidos: updatedLanguages
      })
      .eq('id', documentId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update document languages', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log translation in document access history
    if (userId) {
      await supabase
        .from('document_access_history')
        .insert({
          document_id: documentId,
          user_id: userId,
          action_type: 'translate',
          details: { targetLanguage, translationDocId: translationDoc.id }
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Document translated to ${targetLanguageName}`,
        translationId: translationDoc.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error translating document:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
