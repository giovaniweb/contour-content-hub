
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
  // Remove timestamps tipo [0-5s]
  let out = input.replace(/\[\d+\-\d+s\]\s*/g, '');
  // Remove markdown básico e marcadores no início das linhas
  out = out.replace(/^#+\s*/gm, '').replace(/^[\s>*\-•]+/gm, '');
  // Remove rótulos comuns seguidos de ':'
  out = out.replace(/^\s*(Gancho|A(?:ç|c)ão|Cena(?: \d+)?|CTA|Narrador|OFF|Off|Introdu(?:ç|c)ão|Conclus(?:ã|a)o|Fechamento|Chamada|Transi(?:ç|c)ão|Story\s*\d+|Slide\s*\d+)\s*:\s*/gmi, '');
  // Normaliza espaços e quebras de linha
  out = out.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
  // Trim por linha e no final
  out = out.split('\n').map(l => l.trim()).join('\n').trim();
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
