
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voz específica do Fluida criada no ElevenLabs
const FLUIDA_VOICE_ID = 'dLN8IFpwIveHCuhgX4ee'; // Voz personalizada do Fluida

// Limpeza mínima preservando estrutura narrativa já otimizada pelo frontend
function cleanTextForTTS(input: string): string {
  const src = String(input || '');
  
  // Remove apenas elementos técnicos sem destruir a estrutura narrativa
  let out = src
    // Remove timestamps específicos
    .replace(/\[(?:\d{1,2}:)?\d{1,2}:\d{2}\]/g, '')
    .replace(/\((?:\d{1,2}:)?\d{1,2}:\d{2}\)/g, '')
    // Remove markdown headers mas preserva conteúdo e estrutura
    .replace(/^#{1,6}\s+/gm, '')
    // Normaliza espaços múltiplos mas preserva quebras de linha estruturais
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n');

  return out.trim();
}

// Corte inteligente preservando estrutura narrativa e parágrafos
function limitToDurationSmart(input: string, maxSeconds = 38): string {
  const text = String(input || '').trim();
  if (!text) return '';

  // Configuração mais precisa para PT-BR narração dinâmica
  const avgCharsPerSecond = 14; // 12-15 chars/segundo para TTS PT-BR energético
  const maxChars = Math.floor(maxSeconds * avgCharsPerSecond);
  
  // Se já está dentro do limite, retorna direto
  if (text.length <= maxChars) return text;

  console.log(`⏱️ [limitToDurationSmart] Texto ${text.length} chars > limite ${maxChars} chars. Aplicando corte inteligente.`);

  // Primeiro: tenta cortar por parágrafos (estrutura narrativa GPSC)
  const paragraphs = text.split(/\n\s*\n/);
  let result = '';
  let currentLength = 0;

  for (const paragraph of paragraphs) {
    if (currentLength + paragraph.length + 2 <= maxChars) { // +2 para quebras de linha
      result += (result ? '\n\n' : '') + paragraph;
      currentLength += paragraph.length + 2;
    } else {
      break;
    }
  }

  // Se conseguiu preservar parágrafos completos, retorna
  if (result.trim() && result.length >= maxChars * 0.7) { // Pelo menos 70% do limite
    console.log(`✂️ [limitToDurationSmart] Cortado por parágrafos: ${result.length} chars`);
    return result.trim();
  }

  // Fallback: corte por frases dentro do primeiro parágrafo
  const sentences = text.split(/([.!?]+\s*)/);
  result = '';
  currentLength = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if (currentLength + sentence.length <= maxChars) {
      result += sentence;
      currentLength += sentence.length;
    } else {
      break;
    }
  }

  console.log(`✂️ [limitToDurationSmart] Cortado por frases: ${result.length} chars`);
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

    // Processamento mínimo preservando estrutura narrativa do frontend
    const MAX_SECONDS = 38;
    const originalText = String(text || '');
    const cleanedText = cleanTextForTTS(originalText);
    const limitedText = limitToDurationSmart(cleanedText, MAX_SECONDS);
    const finalText = applyPronunciationFixes(limitedText, mentor);
    
    const pronFixApplied = limitedText !== finalText;
    const textWasLimited = cleanedText.length > limitedText.length;

    if (!finalText || finalText.length < 10) {
      throw new Error('Texto muito curto ou inválido após processamento. Forneça um roteiro com mais conteúdo.');
    }

    // Cálculo de tempo estimado mais preciso (14 chars/segundo)
    const estimatedSeconds = Math.round(finalText.length / 14);
    
    // Modelo preferido: Alpha (v3), com suporte a fallback para v2
    const preferAlpha = useAlpha !== false;
    const preferredModel = preferAlpha ? 'eleven_v3' : 'eleven_multilingual_v2';
    let modelUsed = preferredModel;
    let fallbackUsed = false;

    console.log(`🎙️ [generate-audio] Fluida Voice (Energética):`);
    console.log(`   📝 Original: ${originalText.length} chars`);
    console.log(`   🧹 Limpo: ${cleanedText.length} chars`);
    console.log(`   ✂️ Limitado: ${limitedText.length} chars`);
    console.log(`   ⏱️ Final: ${finalText.length} chars (~${estimatedSeconds}s @ 14chars/s)`);
    console.log(`   🔧 Ajustes: pronúncia=${pronFixApplied}, limitado=${textWasLimited}`);
    console.log(`   🎯 Modelo: ${preferredModel}, Mentor: ${mentor || 'N/A'}`);
    
    // Log do texto final para debug
    console.log(`   📄 Texto final para TTS:`);
    console.log(`"${finalText.substring(0, 200)}${finalText.length > 200 ? '...' : ''}"`);

    if (textWasLimited) {
      console.warn(`⚠️ [generate-audio] Texto foi cortado de ${cleanedText.length} para ${limitedText.length} chars para caber em ${MAX_SECONDS}s`);
    }

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
            stability: 0.5,        // Ajustado para valor aceito pela API (0.0, 0.5, 1.0)
            similarity_boost: 0.75, // Natural mas controlado
            style: 0.85,           // Expressivo mas não exagerado
            use_speaker_boost: true, // Mantém clareza
          },
        }),
      });
    }

    // 1) Tenta com o modelo preferido
    let response = await requestTTS(preferredModel);

    // 2) Se falhar, verifica tipo de erro e aplica fallback apropriado
    if (!response.ok) {
      const errText = await response.text();
      let accessDenied = false;
      let invalidTTDStability = false;
      
      try {
        const parsed = JSON.parse(errText);
        const status = parsed?.detail?.status || parsed?.error?.type || parsed?.error?.code;
        accessDenied = String(status || '').includes('model_access_denied');
        invalidTTDStability = String(status || '').includes('invalid_ttd_stability');
      } catch (_) {
        accessDenied = errText.includes('model_access_denied') || errText.includes('access denied');
        invalidTTDStability = errText.includes('invalid_ttd_stability') || errText.includes('Invalid TTD stability');
      }

      // Fallback para erro de stability inválido
      if (invalidTTDStability) {
        console.warn(`⚠️ [generate-audio] Erro de stability detectado. Aplicando fallback para eleven_multilingual_v2.`);
        response = await requestTTS('eleven_multilingual_v2');
        if (response.ok) {
          modelUsed = 'eleven_multilingual_v2';
          fallbackUsed = true;
        } else {
          throw new Error(`Falha ao gerar áudio mesmo após fallback para stability. Detalhes: ${errText}`);
        }
      }
      // Fallback para erro de acesso ao modelo
      else if (preferAlpha && accessDenied) {
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
