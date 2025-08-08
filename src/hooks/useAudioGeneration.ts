
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
  let out = input;

  // 1) Remover preâmbulos típicos ("Claro! Segue o roteiro...", "Aqui está o roteiro...", etc.) no início
  out = out.replace(/^(?:\s*)?(?:claro!?|segue(?:\s+abaixo)?\s*o?\s*roteiro|aqui\s+(?:está|esta|vai)\s+o\s*roteiro)[^\n]*\n+/i, '');

  // 2) Remover timestamps e durações (ex.: [0-5s] e "- 13s")
  out = out.replace(/\[\d+(?:-\d+)?s\]\s*/gi, '');
  out = out.replace(/-\s*\d+\s*s\b/gi, '');

  // 3) Remover marcadores e markdown básico, incluindo ** **
  out = out.replace(/^#+\s*/gm, '') // títulos markdown
           .replace(/\*\*/g, '') // negrito markdown
           .replace(/^[\s>*\-•]+/gm, ''); // marcadores no início da linha

  // 4) Remover linhas que parecem cabeçalhos/seções (ex.: HEADLINE, PROBLEMA, AGITAÇÃO, SOLUÇÃO, PROVA, CTA)
  const headingKeywords = /(headline|problema|agit[aã]?[cç][aã]o|solu[cç][aã]o|prova\s*social|autoridade|cta|introdu[cç][aã]o|conclus[aã]o|fechamento|chamada|transi[cç][aã]o)/i;
  out = out
    .split('\n')
    .filter(line => {
      const t = line.trim();
      if (!t) return false; // remove linhas vazias múltiplas
      // linha curta, maioria maiúscula e sem pontuação: provavelmente título
      const letters = t.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');
      const upperRatio = letters ? (letters.replace(/[^A-ZÀ-Ö]/g, '').length / letters.length) : 0;
      if (upperRatio > 0.8 && t.length <= 80 && !/[.!?…]$/.test(t)) return false;
      // contém palavra-chave típica de seção
      if (headingKeywords.test(t)) return false;
      // termina com padrão de duração removida
      if (/\b\d+\s*s\b$/i.test(t)) return false;
      return true;
    })
    .join('\n');

  // 5) Normalizações finais
  out = out.replace(/[ \t]+/g, ' ') // espaços duplicados
           .replace(/\n{3,}/g, '\n\n') // muitas quebras de linha
           .split('\n')
           .map(l => l.trim())
           .join('\n')
           .trim();

  return out;
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
      console.log('🎙️ Gerando áudio (limpo):', { preview: cleaned.substring(0, 80) + '...', mentor, isDisneyMode, alpha: true });

      const { data, error } = await supabase.functions.invoke('generate-audio', {
        body: { text: cleaned, mentor, isDisneyMode, useAlpha: true }
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
