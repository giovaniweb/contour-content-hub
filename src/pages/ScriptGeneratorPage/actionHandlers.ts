
import { useToast } from "@/hooks/use-toast";

export const useActionHandlers = () => {
  const { toast } = useToast();

  const handleGenerateImage = () => {
    toast({
      title: "🖼️ Gerando imagem...",
      description: "Sua arte está sendo criada pela IA!"
    });
    // Aqui seria implementada a navegação para o gerador de imagens
    // window.location.href = '/media-library';
  };

  const handleGenerateVoice = () => {
    toast({
      title: "🎧 Gerando áudio...",
      description: "Sua narração está sendo criada!"
    });
    // Aqui seria implementada a lógica para gerar áudio
  };

  return {
    handleGenerateImage,
    handleGenerateVoice
  };
};
