
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Vozes por mentor
const MENTOR_VOICES = {
  'criativo': 'alloy',
  'vendedor': 'echo', 
  'educativo': 'fable',
  'disney': 'nova', // Voz encantadora para modo Disney
  'default': 'alloy'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, mentor, isDisneyMode } = await req.json();

    if (!text) {
      throw new Error('Texto é obrigatório');
    }

    // Selecionar voz baseada no mentor
    const voice = isDisneyMode ? MENTOR_VOICES.disney : 
                  MENTOR_VOICES[mentor?.toLowerCase()] || MENTOR_VOICES.default;

    console.log(`🎙️ Gerando áudio com voz: ${voice} para mentor: ${mentor}`);

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Falha ao gerar áudio');
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        voice: voice,
        mentor: mentor 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erro na geração de áudio:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
