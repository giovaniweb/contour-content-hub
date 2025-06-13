
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PhotographicPromptBuilder, SlideImagePrompt } from '@/utils/photographicPromptBuilder';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  slideTitle?: string;
  equipmentUsed?: string[];
  imageStyle?: string;
  isRealistic?: boolean;
}

export const usePhotographicImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [slidePrompts, setSlidePrompts] = useState<SlideImagePrompt[]>([]);
  const { toast } = useToast();

  const generatePhotographicImages = async (script: any) => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);
    setErrors([]);
    
    try {
      console.log('📸 [usePhotographicImageGeneration] Iniciando geração de imagens fotográficas para:', script.formato);
      
      // Gerar prompts fotográficos baseados no script
      const prompts = PhotographicPromptBuilder.buildSlidePrompts(script);
      setSlidePrompts(prompts);
      
      console.log(`🎨 [usePhotographicImageGeneration] ${prompts.length} prompts fotográficos gerados`);
      prompts.forEach((p, i) => {
        console.log(`📸 Prompt ${i + 1} (${p.imageStyle}):`, p.prompt.substring(0, 100) + '...');
      });
      
      const totalImages = prompts.length;
      const newImages: GeneratedImage[] = [];
      const newErrors: string[] = [];
      
      // Gerar imagens sequencialmente com retry
      for (let i = 0; i < prompts.length; i++) {
        const promptData = prompts[i];
        let attempts = 0;
        const maxAttempts = 2;
        
        while (attempts < maxAttempts) {
          try {
            attempts++;
            console.log(`📸 Gerando imagem fotográfica ${i + 1}/${totalImages} (tentativa ${attempts}): ${promptData.slideTitle}`);
            
            // Validar prompt antes de enviar
            if (!PhotographicPromptBuilder.validatePrompt(promptData.prompt)) {
              throw new Error('Prompt inválido - falhou na validação anti-alucinação');
            }
            
            const { data, error } = await supabase.functions.invoke('generate-image', {
              body: {
                prompt: promptData.prompt,
                quality: 'hd', // Usar qualidade HD para imagens fotográficas
                size: '1024x1024',
                style: 'natural' // Estilo natural para realismo
              }
            });

            if (error) {
              console.error(`❌ Erro na geração da imagem ${i + 1} (tentativa ${attempts}):`, error);
              if (attempts === maxAttempts) {
                newErrors.push(`Imagem ${i + 1} (${promptData.slideTitle}): ${error.message}`);
                break;
              }
              continue;
            }

            if (data?.image) {
              const newImage: GeneratedImage = {
                id: `photo-${i + 1}`,
                prompt: promptData.prompt,
                imageUrl: data.image,
                slideTitle: promptData.slideTitle,
                equipmentUsed: promptData.equipmentUsed,
                imageStyle: promptData.imageStyle,
                isRealistic: true
              };
              
              newImages.push(newImage);
              setGeneratedImages([...newImages]);
              setProgress(((i + 1) / totalImages) * 100);
              
              console.log(`✅ Imagem fotográfica ${i + 1} gerada com sucesso - Estilo: ${promptData.imageStyle}`);
              break;
            } else {
              if (attempts === maxAttempts) {
                newErrors.push(`Imagem ${i + 1} (${promptData.slideTitle}): Nenhuma imagem retornada`);
              }
            }
          } catch (imageError: any) {
            console.error(`❌ Erro ao gerar imagem fotográfica ${i + 1} (tentativa ${attempts}):`, imageError);
            if (attempts === maxAttempts) {
              newErrors.push(`Imagem ${i + 1} (${promptData.slideTitle}): ${imageError.message}`);
            }
          }
        }
      }
      
      setErrors(newErrors);
      
      if (newImages.length > 0) {
        toast({
          title: `📸 ${newImages.length} Imagem(ns) fotográfica(s) gerada(s)!`,
          description: newErrors.length > 0 
            ? `${newErrors.length} imagem(ns) falharam. Verifique o modal para detalhes.`
            : `Suas imagens realistas estão prontas para download.`,
        });
      } else {
        throw new Error('Nenhuma imagem fotográfica foi gerada com sucesso');
      }
      
      return newImages;

    } catch (error: any) {
      console.error('❌ [usePhotographicImageGeneration] Erro geral:', error);
      
      toast({
        title: "Erro na geração de imagens fotográficas",
        description: error.message || "Não foi possível gerar as imagens realistas. Tente novamente.",
        variant: "destructive",
      });
      
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  const retryFailedImages = async (script: any, failedIndexes: number[]) => {
    if (failedIndexes.length === 0 || slidePrompts.length === 0) return;
    
    setIsGenerating(true);
    const currentImages = [...generatedImages];
    
    try {
      for (const index of failedIndexes) {
        const promptData = slidePrompts[index];
        if (!promptData) continue;
        
        console.log(`🔄 Tentando novamente imagem fotográfica ${index + 1}: ${promptData.slideTitle}`);
        
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: {
            prompt: promptData.prompt,
            quality: 'hd',
            size: '1024x1024',
            style: 'natural'
          }
        });

        if (!error && data?.image) {
          const newImage: GeneratedImage = {
            id: `photo-retry-${index + 1}`,
            prompt: promptData.prompt,
            imageUrl: data.image,
            slideTitle: promptData.slideTitle,
            equipmentUsed: promptData.equipmentUsed,
            imageStyle: promptData.imageStyle,
            isRealistic: true
          };
          
          currentImages[index] = newImage;
          setGeneratedImages([...currentImages]);
          
          // Remove error for this index
          const newErrors = errors.filter((_, i) => i !== index);
          setErrors(newErrors);
          
          console.log(`✅ Imagem fotográfica ${index + 1} regenerada com sucesso`);
        }
      }
      
      toast({
        title: "🔄 Regeneração concluída!",
        description: "Algumas imagens fotográficas foram regeneradas com sucesso.",
      });
      
    } catch (error: any) {
      console.error('❌ Erro no retry fotográfico:', error);
      toast({
        title: "Erro na regeneração",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (image: GeneratedImage) => {
    try {
      const link = document.createElement('a');
      link.href = image.imageUrl;
      link.download = `${image.slideTitle || 'imagem-fotografica'}-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "📥 Download iniciado!",
        description: `Imagem fotográfica "${image.slideTitle || 'imagem'}" está sendo baixada.`,
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
      }, index * 500);
    });
  };

  const clearImages = () => {
    setGeneratedImages([]);
    setSlidePrompts([]);
    setProgress(0);
    setErrors([]);
  };

  return {
    generatePhotographicImages,
    retryFailedImages,
    isGenerating,
    generatedImages,
    slidePrompts,
    progress,
    errors,
    downloadImage,
    downloadAllImages,
    clearImages
  };
};
