
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

    // Get document from unified_documents table
    const { data: document, error: docError } = await supabase
      .from('unified_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return new Response(
        JSON.stringify({ error: 'Document not found', details: docError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!document.texto_completo && !document.raw_text) {
      return new Response(
        JSON.stringify({ error: 'Document has no content to translate' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the content to translate (prefer texto_completo, fallback to raw_text)
    const contentToTranslate = document.texto_completo || document.raw_text;

    // Get language names for prompt
    const getLanguageName = (code: string) => {
      switch (code) {
        case 'pt': return 'Portuguese';
        case 'en': return 'English';
        case 'es': return 'Spanish';
        case 'fr': return 'French';
        case 'it': return 'Italian';
        case 'de': return 'German';
        default: return code;
      }
    };

    const targetLanguageName = getLanguageName(targetLanguage);

    console.log(`🌐 Translating document to ${targetLanguageName}...`);

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
            content: `You are a professional translator specializing in scientific articles. 
                     Translate the following academic content to ${targetLanguageName}.
                     
                     Guidelines:
                     - Maintain the academic tone and technical terminology
                     - Preserve the structure and formatting
                     - Keep proper names and citations intact
                     - Make the translation natural and professional in ${targetLanguageName}
                     - Preserve any references, equations, or technical notation
                     
                     Return only the translated text without any additional comments.`
          },
          {
            role: 'user',
            content: contentToTranslate
          }
        ],
        temperature: 0.2,
      }),
    });

    if (!translationResponse.ok) {
      const errorData = await translationResponse.json();
      console.error('❌ OpenAI translation error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to translate document', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const translationData = await translationResponse.json();
    const translatedContent = translationData.choices[0].message.content;

    console.log('✅ Translation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        translatedContent,
        targetLanguage,
        targetLanguageName,
        originalTitle: document.titulo_extraido,
        message: `Document translated to ${targetLanguageName}`
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
