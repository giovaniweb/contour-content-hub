
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voz específica do Fluida criada no ElevenLabs
const FLUIDA_VOICE_ID = 'dLN8IFpwIveHCuhgX4ee'; // Voz personalizada do Fluida

// Preparação inteligente de texto para narração energética
function prepareForEnergeticNarration(input: string): string {
  const src = String(input || '');
  
  // Limpeza mínima preservando conteúdo narrativo
  let out = src
    // Remove apenas timestamps específicos
    .replace(/\[(?:\d{1,2}:)?\d{1,2}:\d{2}\]/g, '')
    .replace(/\((?:\d{1,2}:)?\d{1,2}:\d{2}\)/g, '')
    // Remove apenas rótulos técnicos mas preserva conteúdo
    .replace(/^\s*(?:OFF|NARRA(?:Ç|C)ÃO|NARRADOR|APRESENTADOR|CTA|CENA|INTRODU(?:Ç|C)ÃO|FECHAMENTO|CONCLUS(?:Ã|A)O|STORY\s*\d+|SLIDE\s*\d+)\s*[:\-–—]?\s*/gmi, '')
    // Remove markdown headers mas preserva conteúdo
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bullets mas preserva texto
    .replace(/^\s*[>*\-•–—]\s+/gm, '');

  // Divide em linhas e processa
  const lines = out
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 2); // Mantém linhas com conteúdo mínimo

  // Junta com conectores naturais para fluidez
  let result = lines.join('. ').replace(/\s{2,}/g, ' ').trim();
  
  // Adiciona pausas estratégicas para cadência dinâmica
  result = result
    .replace(/([.!?])\s+/g, '$1 ') // Normaliza pontuação
    .replace(/([,;:])\s*/g, '$1 ') // Adiciona espaço após vírgulas
    .replace(/\b(mas|porém|contudo|entretanto|então|agora|vamos|imagine|olha)\b/gi, ', $1') // Conectores com pausa
    .replace(/\s+/g, ' ') // Remove espaços duplos
    .trim();

  return result;
}

// Corte inteligente por tempo com preservação de frases completas
function limitToDurationSmart(input: string, maxSeconds = 38, wordsPerSecond = 3.5): string {
  const text = String(input || '').trim();
  if (!text) return '';

  // Calcula limite baseado em caracteres (mais preciso que palavras)
  const avgCharsPerSecond = wordsPerSecond * 5.5; // Média de caracteres por palavra em PT-BR
  const maxChars = Math.floor(maxSeconds * avgCharsPerSecond);
  
  // Se já está dentro do limite, retorna direto
  if (text.length <= maxChars) return text;

  // Encontra ponto de corte ideal (fim de frase)
  const sentences = text.split(/([.!?]+\s*)/);
  let result = '';
  let currentLength = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if (currentLength + sentence.length <= maxChars) {
      result += sentence;
      currentLength += sentence.length;
    } else {
      break;
    }
  }

  // Se não conseguiu formar frases completas, corta por palavras mas mantém coerência
  if (!result.trim()) {
    const words = text.split(/\s+/);
    const maxWords = Math.floor(maxSeconds * wordsPerSecond);
    result = words.slice(0, maxWords).join(' ');
    
    // Garante que não corta no meio de uma palavra composta
    if (result.endsWith('-')) {
      const lastSpace = result.lastIndexOf(' ');
      result = result.substring(0, lastSpace);
    }
  }

  return result.trim();
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
    const { text, mentor, useAlpha } = await req.json(); // Removido isDisneyMode

    if (!text) {
      throw new Error('Texto é obrigatório');
    }

    const apiKey = Deno.env.get('XI_API_KEY');
    if (!apiKey) {
      throw new Error('XI_API_KEY não configurada');
    }

    // Usar apenas a voz específica do Fluida
    const voiceId = FLUIDA_VOICE_ID;

    // Processamento inteligente do texto para narração energética (30-38s)
    const MAX_SECONDS = 38;
    const processedText = prepareForEnergeticNarration(String(text || ''));
    const limitedText = limitToDurationSmart(processedText, MAX_SECONDS, 3.5);
    const finalText = applyPronunciationFixes(limitedText, mentor);
    
    const pronFixApplied = limitedText !== finalText;
    const textWasLimited = processedText.length > limitedText.length;

    if (!finalText || finalText.length < 10) {
      throw new Error('Texto muito curto ou inválido após processamento. Forneça um roteiro com mais conteúdo.');
    }

    // Cálculo de tempo estimado mais preciso
    const estimatedSeconds = Math.round(finalText.length / (3.5 * 5.5)); // chars / (words/sec * chars/word)
    
    // Modelo preferido: Alpha (v3), com suporte a fallback para v2
    const preferAlpha = useAlpha !== false;
    const preferredModel = preferAlpha ? 'eleven_v3' : 'eleven_multilingual_v2';
    let modelUsed = preferredModel;
    let fallbackUsed = false;

    console.log(`🎙️ [generate-audio] Fluida Voice (Energética):`);
    console.log(`   📝 Original: ${String(text || '').length} chars`);
    console.log(`   ✂️ Processado: ${processedText.length} chars`);
    console.log(`   ⏱️ Final: ${finalText.length} chars (~${estimatedSeconds}s)`);
    console.log(`   🔧 Ajustes: pronúncia=${pronFixApplied}, limitado=${textWasLimited}`);
    console.log(`   🎯 Modelo: ${preferredModel}, Mentor: ${mentor || 'N/A'}`);

    async function requestTTS(model_id: string) {
      return await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: finalText,
          model_id,
          voice_settings: {
            stability: 0.4,        // Mais expressivo para narração energética
            similarity_boost: 0.75, // Natural mas controlado
            style: 0.85,           // Expressivo mas não exagerado
            use_speaker_boost: true, // Mantém clareza
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
