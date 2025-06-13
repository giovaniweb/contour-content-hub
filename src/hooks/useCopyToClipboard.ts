
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useCopyToClipboard = () => {
  const [isCopying, setIsCopying] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, successMessage?: string) => {
    if (isCopying) return;
    
    setIsCopying(true);
    
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: successMessage || "Texto copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível copiar o texto. Tente novamente.",
      });
    } finally {
      setTimeout(() => setIsCopying(false), 1000);
    }
  };

  return { copyToClipboard, isCopying };
};
