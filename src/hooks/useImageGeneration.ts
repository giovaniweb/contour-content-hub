
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async (script: any) => {
    setIsGenerating(true);
    
    try {
      console.log('🖼️ [useImageGeneration] Iniciando geração de imagem para script:', script.formato);
      
      // Criar prompt baseado no roteiro
      let imagePrompt = '';
      
      if (script.formato === 'carrossel') {
        // Para carrossel, usar a primeira descrição de imagem encontrada
        const imageMatch = script.roteiro.match(/Imagem:\s*([^\n]+)/i);
        imagePrompt = imageMatch ? imageMatch[1] : 'Ambiente clínico moderno e profissional, iluminação suave, atmosfera acolhedora';
      } else {
        // Para outros formatos, criar prompt baseado no conteúdo
        const tema = script.tema || 'tratamento estético';
        imagePrompt = `Ambiente clínico moderno e luxuoso para ${tema}, profissional especializado, equipamentos de alta tecnologia, iluminação suave e acolhedora, atmosfera de confiança e bem-estar`;
      }

      console.log('🎨 [useImageGeneration] Prompt da imagem:', imagePrompt);

      // Chamar edge function para gerar imagem
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: imagePrompt,
          quality: 'high',
          size: '1024x1024',
          style: 'natural'
        }
      });

      if (error) {
        console.error('❌ [useImageGeneration] Erro na API:', error);
        throw error;
      }

      if (data?.image) {
        console.log('✅ [useImageGeneration] Imagem gerada com sucesso');
        setGeneratedImageUrl(data.image);
        
        toast({
          title: "🖼️ Imagem gerada!",
          description: "Sua imagem foi criada com sucesso usando IA.",
        });
        
        return data.image;
      } else {
        throw new Error('Nenhuma imagem foi retornada pela API');
      }

    } catch (error: any) {
      console.error('❌ [useImageGeneration] Erro ao gerar imagem:', error);
      
      toast({
        title: "Erro na geração de imagem",
        description: error.message || "Não foi possível gerar a imagem. Tente novamente.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearImage = () => {
    setGeneratedImageUrl(null);
  };

  return {
    generateImage,
    isGenerating,
    generatedImageUrl,
    clearImage
  };
};
