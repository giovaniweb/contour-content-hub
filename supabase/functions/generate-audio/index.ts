
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

// Text cleaners and duration limiter for OFF narration
function cleanOffText(input: string): string {
  const src = String(input || '');
  // Remove timestamps like [00:12] or (00:12)
  let out = src
    .replace(/\[(?:\d{1,2}:)?\d{1,2}:\d{2}\]/g, ' ')
    .replace(/\((?:\d{1,2}:)?\d{1,2}:\d{2}\)/g, ' ')
    // Remove bracketed directions [ ... ]
    .replace(/\[[^\]]+\]/g, ' ')
    // Remove stage directions in parentheses
    .replace(/\([^)]{3,}\)/g, ' ')
    // Remove markdown headings and bullets
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[>*\-•–—]\s+/gm, '')
    // Remove leading labels (OFF:, NARRAÇÃO:, CTA:, etc.)
    .replace(/^\s*(?:OFF|NARRA(?:Ç|C)ÃO|NARRADOR|APRESENTADOR|CTA|CENA|INTRODU(?:Ç|C)ÃO|FECHAMENTO|CONCLUS(?:Ã|A)O|STORY\s*\d+|SLIDE\s*\d+)\s*[:\-–—]?\s*/gmi, '')
    // Remove lines that are all caps (likely headings)
    .replace(/^(?=.{3,}$)([A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\s%\-–—,:;!?"']+)$\n?/gm, '');

  const lines = out
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  return lines.join(' ').replace(/\s{2,}/g, ' ').trim();
}

function limitToDuration(input: string, maxSeconds = 40, wordsPerSecond = 2.5): string {
  const words = String(input || '').split(/\s+/).filter(Boolean);
  const maxWords = Math.max(1, Math.floor(maxSeconds * wordsPerSecond));
  return words.slice(0, maxWords).join(' ');
}

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
      : (ELEVEN_VOICES[mentor?.toLowerCase?.()] || ELEVEN_VOICES.default);

    // Limpar e limitar o texto para ~40s de locução publicitária
    const MAX_SECONDS = 40;
    const WORDS_PER_SECOND = 2.5;
    const cleanedText = limitToDuration(cleanOffText(String(text || '')), MAX_SECONDS, WORDS_PER_SECOND);

    if (!cleanedText) {
      throw new Error('Nenhum texto válido encontrado após a limpeza. Forneça apenas o roteiro.');
    }

    // Forçar uso do Alpha (v3)
    const modelUsed = 'eleven_v3';
    console.log(`🎙️ [generate-audio] ElevenLabs: voiceId=${voiceId} model=${modelUsed} mentor=${mentor} disney=${!!isDisneyMode} len=${cleanedText.length}`);

    async function requestTTS(model_id: string) {
      return await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: cleanedText,
          model_id,
          voice_settings: {
            stability: 0.3, // dinâmico para locução publicitária
            similarity_boost: 0.92, // aproxima o timbre
            style: 0.95, // mais expressividade
            use_speaker_boost: true,
          },
        }),
      });
    }

    const response = await requestTTS(modelUsed);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Falha ao gerar áudio com Alpha (v3). Verifique se o Alpha está habilitado na sua conta ElevenLabs e se a chave possui acesso. Detalhes: ${errText}`);
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
