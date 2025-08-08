
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapear vozes da ElevenLabs por mentor
const ELEVEN_VOICES: Record<string, string> = {
  // IDs oficiais de voz da ElevenLabs
  criativo: 'XB0fDUnXU5powFXDhCwa', // Charlotte (energética)
  vendedor: 'CwhRBWXzGAHq8TQ4Fs17', // Roger (convincente)
  educativo: 'EXAVITQu4vr4xnSDYk0k2', // Sarah (clara/didática)
  disney: 'Xb7hH8MSUJpSbSDYk0k2', // Alice (encantadora)
  default: '9BWtsMINqrJLrRacOk9x', // Aria (padrão)
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, mentor, isDisneyMode, useAlpha } = await req.json();

    if (!text) {
      throw new Error('Texto é obrigatório');
    }

    const apiKey = Deno.env.get('XI_API_KEY');
    if (!apiKey) {
      throw new Error('XI_API_KEY não configurada');
    }

    // Selecionar voz baseada no mentor
    const voiceId = isDisneyMode
      ? ELEVEN_VOICES.disney
      : (ELEVEN_VOICES[mentor?.toLowerCase()] || ELEVEN_VOICES.default);

    // Selecionar modelo (Alpha v3 quando solicitado)
    const modelIdPreferred = useAlpha ? 'eleven_v3' : 'eleven_multilingual_v2';
    let modelUsed = modelIdPreferred;

    console.log(`🎙️ [generate-audio] ElevenLabs: voiceId=${voiceId} model=${modelIdPreferred} mentor=${mentor} alpha=${!!useAlpha}`);

    async function requestTTS(model_id: string) {
      return await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: String(text || '').trim(),
          model_id,
          voice_settings: {
            stability: 0.35, // mais dinâmico para locução publicitária
            similarity_boost: 0.9, // aproxima mais do timbre da voz escolhida
            style: 0.7, // mais expressividade
            use_speaker_boost: true,
          },
        }),
      });
    }

    let response = await requestTTS(modelIdPreferred);

    // Fallback automático caso o Alpha não esteja disponível via API na sua conta
    if (!response.ok && useAlpha) {
      const errText = await response.text();
      console.warn(`⚠️ Alpha (v3) falhou, fazendo fallback para v2. Motivo: ${errText}`);
      response = await requestTTS('eleven_multilingual_v2');
      modelUsed = 'eleven_multilingual_v2';
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Falha ao gerar áudio (ElevenLabs)');
    }

    const arrayBuffer = await response.arrayBuffer();
    // Convert to base64 in chunks to avoid "Maximum call stack size exceeded"
    const bytes = new Uint8Array(arrayBuffer);
    const chunkSize = 8192;
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64Audio = btoa(binary);

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        voiceId,
        mentor,
        modelUsed,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Erro na geração de áudio (ElevenLabs):', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
