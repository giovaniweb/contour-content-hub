
import { useToast } from '@/hooks/use-toast';

export const useActionHandlers = () => {
  const { toast } = useToast();

  const handleGenerateImage = () => {
    toast({
      title: "Geração de imagem",
      description: "Funcionalidade de geração de imagem com IA será implementada em breve.",
    });
  };

  const handleGenerateVoice = () => {
    toast({
      title: "Geração de voz",
      description: "Funcionalidade de geração de voz com ElevenLabs será implementada em breve.",
    });
  };

  return {
    handleGenerateImage,
    handleGenerateVoice
  };
};
