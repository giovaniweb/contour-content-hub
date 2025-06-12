
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  slideTitle?: string;
}

export const useMultipleImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const extractImagePrompts = (script: any) => {
    const prompts: Array<{prompt: string, slideTitle?: string}> = [];
    
    if (script.formato === 'carrossel') {
      // Extrair prompts das seções "Imagem:" do carrossel
      const imageMatches = script.roteiro.match(/Slide:\s*([^\n]+)[\s\S]*?Imagem:\s*([^\n]+)/gi);
      
      if (imageMatches && imageMatches.length > 0) {
        imageMatches.forEach((match: string) => {
          const slideMatch = match.match(/Slide:\s*([^\n]+)/i);
          const imageMatch = match.match(/Imagem:\s*([^\n]+)/i);
          
          if (slideMatch && imageMatch) {
            prompts.push({
              slideTitle: slideMatch[1].trim(),
              prompt: imageMatch[1].trim()
            });
          }
        });
      }
      
      // Garantir exatamente 5 prompts para carrossel
      while (prompts.length < 5) {
        const slideNum = prompts.length + 1;
        prompts.push({
          slideTitle: `Slide ${slideNum}`,
          prompt: `Ambiente clínico moderno para tratamento estético, profissional especializado, equipamentos de alta tecnologia, iluminação suave, atmosfera acolhedora e profissional`
        });
      }
      
      // Limitar a 5 prompts
      return prompts.slice(0, 5);
    } else {
      // Para outros formatos, gerar 1 prompt baseado no conteúdo
      const tema = script.tema || 'tratamento estético';
      return [{
        prompt: `Ambiente clínico luxuoso e moderno para ${tema}, profissional sorridente atendendo cliente, equipamentos de alta tecnologia, iluminação suave e acolhedora, cores suaves, composição profissional, atmosfera de confiança e bem-estar`
      }];
    }
  };

  const generateImages = async (script: any) => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);
    
    try {
      console.log('🖼️ [useMultipleImageGeneration] Iniciando geração de imagens para:', script.formato);
      
      const prompts = extractImagePrompts(script);
      const totalImages = prompts.length;
      const newImages: GeneratedImage[] = [];
      
      console.log(`🎨 [useMultipleImageGeneration] Gerando ${totalImages} imagens`);
      
      // Gerar imagens sequencialmente
      for (let i = 0; i < prompts.length; i++) {
        const promptData = prompts[i];
        
        try {
          console.log(`🖼️ Gerando imagem ${i + 1}/${totalImages}: ${promptData.prompt.substring(0, 50)}...`);
          
          const { data, error } = await supabase.functions.invoke('generate-image', {
            body: {
              prompt: promptData.prompt,
              quality: 'high',
              size: '1024x1024',
              style: 'natural'
            }
          });

          if (error) {
            console.error(`❌ Erro na geração da imagem ${i + 1}:`, error);
            throw error;
          }

          if (data?.image) {
            newImages.push({
              id: `img-${i + 1}`,
              prompt: promptData.prompt,
              imageUrl: data.image,
              slideTitle: promptData.slideTitle
            });
            
            setGeneratedImages([...newImages]);
            setProgress(((i + 1) / totalImages) * 100);
            
            console.log(`✅ Imagem ${i + 1} gerada com sucesso`);
          } else {
            throw new Error(`Nenhuma imagem retornada para o prompt ${i + 1}`);
          }
        } catch (imageError: any) {
          console.error(`❌ Erro ao gerar imagem ${i + 1}:`, imageError);
          // Continuar com as outras imagens mesmo se uma falhar
        }
      }
      
      if (newImages.length > 0) {
        toast({
          title: `🖼️ ${newImages.length} Imagem(ns) gerada(s)!`,
          description: `Suas imagens estão prontas para download.`,
        });
      } else {
        throw new Error('Nenhuma imagem foi gerada com sucesso');
      }
      
      return newImages;

    } catch (error: any) {
      console.error('❌ [useMultipleImageGeneration] Erro geral:', error);
      
      toast({
        title: "Erro na geração de imagens",
        description: error.message || "Não foi possível gerar as imagens. Tente novamente.",
        variant: "destructive",
      });
      
      return [];
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const downloadImage = (image: GeneratedImage) => {
    try {
      const link = document.createElement('a');
      link.href = image.imageUrl;
      link.download = `${image.slideTitle || 'imagem'}-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "📥 Download iniciado!",
        description: `Imagem "${image.slideTitle || 'imagem'}" está sendo baixada.`,
      });
    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar a imagem.",
        variant: "destructive",
      });
    }
  };

  const downloadAllImages = () => {
    generatedImages.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image);
      }, index * 500); // Delay entre downloads
    });
  };

  const clearImages = () => {
    setGeneratedImages([]);
    setProgress(0);
  };

  return {
    generateImages,
    isGenerating,
    generatedImages,
    progress,
    downloadImage,
    downloadAllImages,
    clearImages
  };
};
