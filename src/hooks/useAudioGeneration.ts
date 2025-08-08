
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AudioGenerationOptions {
  text: string;
  mentor?: string;
  isDisneyMode?: boolean;
}

// Limpa o texto para narração (remove timestamps, marcadores e rótulos padrão)
const cleanOffText = (input: string): string => {
  if (!input) return '';
  let out = String(input);

  // 1) Remover preâmbulos típicos ("Claro! Segue o roteiro...", "Aqui está o roteiro...", etc.) no início
  out = out.replace(/^(?:\s*)?(?:claro!?|segue(?:\s+abaixo)?\s*o?\s*roteiro|aqui\s+(?:está|esta|vai)\s+o\s*roteiro)[^\n]*\n+/i, '');

  // 2) Remover blocos em colchetes (ex.: [ABERTURA...], créditos, rótulos)
  out = out.replace(/\[[^\]]+\]/g, ' ');

  // 3) Remover direções de palco entre parênteses
  out = out.replace(/\((?:[^)]+)\)/g, ' ');

  // 4) Remover timestamps e durações (ex.: [0-5s] e "- 13s")
  out = out.replace(/\[\d+(?:-\d+)?s\]\s*/gi, '');
  out = out.replace(/-\s*\d+\s*s\b/gi, '');

  // 5) Remover marcadores e markdown básico, incluindo ** **
  out = out.replace(/^#+\s*/gm, '') // títulos markdown
           .replace(/\*\*/g, '') // negrito markdown
           .replace(/^[\s>*\-•]+/gm, ''); // marcadores no início da linha

  // 6) Remover rótulos no início da linha (Narrador:, OFF:, CTA:, Story 1:, etc.)
  out = out.replace(/^\s*(?:gancho|a(?:ç|c)ão|cena(?: \d+)?|cta|narrador|off|introdu(?:ç|c)ão|conclus(?:ã|a)o|fechamento|chamada|transi(?:ç|c)ão|story\s*\d+|slide\s*\d+)\s*:\s*/gmi, '');

  // 7) Remover emojis/decorações
  out = out.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200d]+/gu, '');

  // 8) Remover linhas que parecem cabeçalhos/seções
  const headingKeywords = /(headline|problema|agit[aã]?[cç][aã]o|solu[cç][aã]o|prova\s*social|autoridade|cta|introdu[cç][aã]o|conclus[aã]o|fechamento|chamada|transi[cç][aã]o)/i;
  out = out
    .split('\n')
    .filter(line => {
      const t = line.trim();
      if (!t) return false; // remove linhas vazias múltiplas
      const letters = t.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');
      const upperRatio = letters ? (letters.replace(/[^A-ZÀ-Ö]/g, '').length / letters.length) : 0;
      if (upperRatio > 0.75 && t.length <= 80 && !/[.!?…]$/.test(t)) return false;
      if (headingKeywords.test(t)) return false;
      if (/\b\d+\s*s\b$/i.test(t)) return false;
      return true;
    })
    .join('\n');

  // 9) Normalizações finais
  out = out.replace(/[ \t]+/g, ' ')
           .replace(/\s*\n\s*/g, '\n')
           .replace(/\n{3,}/g, '\n\n')
           .replace(/[–—]+/g, ' - ')
           .replace(/\s{2,}/g, ' ')
           .trim();

  return out;
};

// Limita o texto a ~maxSeconds segundos de locução
const limitToDuration = (input: string, maxSeconds = 40, wordsPerSecond = 2.5): string => {
  const maxWords = Math.max(10, Math.floor(maxSeconds * wordsPerSecond));
  const sentences = input
    .split(/(?<=[.!?…])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  const selected: string[] = [];
  let total = 0;
  for (const s of sentences) {
    const count = s.split(/\s+/).filter(Boolean).length;
    if (total + count > maxWords) break;
    selected.push(s);
    total += count;
  }

  let result = selected.join(' ');
  if (!result) {
    const words = input.split(/\s+/).filter(Boolean).slice(0, maxWords);
    result = words.join(' ');
  }
  if (result.length < input.length) result = result.replace(/[.,!?…]*$/, '') + '...';
  return result.trim();
};

export const useAudioGeneration = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateAudio = async ({ text, mentor, isDisneyMode }: AudioGenerationOptions) => {
    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const cleaned = cleanOffText(text);
      const finalText = limitToDuration(cleaned, 40);
      console.log('🎙️ Gerando áudio (limpo):', { preview: finalText.substring(0, 120) + '...', mentor, isDisneyMode, alpha: true });

      const { data, error } = await supabase.functions.invoke('generate-audio', {
        body: { text: finalText, mentor, isDisneyMode, useAlpha: true }
      });

      if (error) {
        throw error;
      }

      if (data?.audioContent) {
        const audioBlob = new Blob([
          Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
        ], { type: 'audio/mpeg' });
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        toast({
          title: "🎙️ Áudio gerado com sucesso!",
          description: isDisneyMode ? 
            "Voz encantadora da Fluida criada com magia Disney!" :
            `Áudio criado com a voz do mentor ${mentor}`,
        });

        return url;
      }

    } catch (error) {
      console.error('Erro ao gerar áudio:', error);
      toast({
        title: "Erro na geração de áudio",
        description: "Não foi possível gerar o áudio. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAudio = (filename: string = 'roteiro-fluida.mp3') => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  return {
    generateAudio,
    downloadAudio,
    clearAudio,
    isGenerating,
    audioUrl
  };
};
