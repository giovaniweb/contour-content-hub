
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AudioGenerationOptions {
  text: string;
  mentor?: string;
  isDisneyMode?: boolean;
}

export const useAudioGeneration = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateAudio = async ({ text, mentor, isDisneyMode }: AudioGenerationOptions) => {
    setIsGenerating(true);
    setAudioUrl(null);

    try {
      console.log('🎙️ Gerando áudio:', { text: text.substring(0, 50) + '...', mentor, isDisneyMode });

      const { data, error } = await supabase.functions.invoke('generate-audio', {
        body: { text, mentor, isDisneyMode }
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
