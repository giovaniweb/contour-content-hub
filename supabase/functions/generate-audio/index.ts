
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voz específica do Fluida criada no ElevenLabs
const FLUIDA_VOICE_ID = '9BWtsMINqrJLrRacOk9x'; // TODO: Substituir pelo voice ID específico do Fluida
const DISNEY_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice (encantadora) para modo Disney

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

// Ajuste de pronúncia específico para TTS pt-BR (não altera o texto original exibido)
function applyPronunciationFixes(input: string, mentor?: string): string {
  let out = String(input || '');

  // Regras pontuais solicitadas: "Cryo" -> "Crio", "HImFu" -> "Raimifu"
  const rules: Array<{ pattern: RegExp; replace: string }> = [
    { pattern: /\bCryo RF Max\b/gi, replace: 'Crio RF Max' },
    { pattern: /\bCryo\b/gi, replace: 'Crio' },
    { pattern: /\bHImFu\b/gi, replace: 'Raimifu' },
  ];

  for (const r of rules) {
    out = out.replace(r.pattern, r.replace);
  }
  return out;
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

    // Selecionar voz: Fluida específica ou Disney
    const voiceId = isDisneyMode ? DISNEY_VOICE_ID : FLUIDA_VOICE_ID;

    // Limpar, limitar e ajustar pronúncia para ~40s de locução publicitária
    const MAX_SECONDS = 40;
    const WORDS_PER_SECOND = 2.5;
    const preppedText = limitToDuration(cleanOffText(String(text || '')), MAX_SECONDS, WORDS_PER_SECOND);
    const adjustedText = applyPronunciationFixes(preppedText, mentor);
    const pronFixApplied = preppedText !== adjustedText;

    if (!adjustedText) {
      throw new Error('Nenhum texto válido encontrado após a limpeza. Forneça apenas o roteiro.');
    }

    // Modelo preferido: Alpha (v3), com suporte a fallback para v2 quando sem acesso
    const preferAlpha = useAlpha !== false;
    const preferredModel = preferAlpha ? 'eleven_v3' : 'eleven_multilingual_v2';
    let modelUsed = preferredModel;
    let fallbackUsed = false;

    console.log(`🎙️ [generate-audio] ElevenLabs request: voiceId=${voiceId} preferredModel=${preferredModel} mentor=${mentor} disney=${!!isDisneyMode} len=${adjustedText.length} pronFix=${pronFixApplied}`);

    async function requestTTS(model_id: string) {
      return await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: adjustedText,
          model_id,
          voice_settings: {
            stability: 0.5, // Corrigido: valor válido (0.0, 0.5 ou 1.0)
            similarity_boost: 0.92,
            style: 0.95,
            use_speaker_boost: true,
          },
        }),
      });
    }

    // 1) Tenta com o modelo preferido
    let response = await requestTTS(preferredModel);

    // 2) Se falhar por falta de acesso ao Alpha, faz fallback automático para Multilingual v2
    if (!response.ok) {
      const errText = await response.text();
      let accessDenied = false;
      try {
        const parsed = JSON.parse(errText);
        const status = parsed?.detail?.status || parsed?.error?.type || parsed?.error?.code;
        accessDenied = String(status || '').includes('model_access_denied');
      } catch (_) {
        accessDenied = errText.includes('model_access_denied') || errText.includes('access denied');
      }

      if (preferAlpha && accessDenied) {
        console.warn(`⚠️ [generate-audio] Alpha (v3) sem acesso. Aplicando fallback para eleven_multilingual_v2.`);
        response = await requestTTS('eleven_multilingual_v2');
        if (response.ok) {
          modelUsed = 'eleven_multilingual_v2';
          fallbackUsed = true;
        } else {
          throw new Error(`Falha ao gerar áudio mesmo após fallback. Detalhes: ${errText}`);
        }
      } else {
        throw new Error(`Falha ao gerar áudio (${preferredModel}). Detalhes: ${errText}`);
      }
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
        fallbackUsed,
        pronFixApplied,
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
