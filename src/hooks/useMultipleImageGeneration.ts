
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
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const extractImagePrompts = (script: any) => {
    const prompts: Array<{prompt: string, slideTitle?: string}> = [];
    
    if (script.formato === 'carrossel') {
      // Melhor extração de prompts das seções "Imagem:" do carrossel
      const slides = script.roteiro.split(/(?=Slide:\s)/gi).filter(Boolean);
      
      slides.forEach((slide: string, index: number) => {
        const slideMatch = slide.match(/Slide:\s*([^\n]+)/i);
        const imageMatch = slide.match(/Imagem:\s*([^\n]+)/i);
        
        if (slideMatch && imageMatch) {
          prompts.push({
            slideTitle: slideMatch[1].trim(),
            prompt: `Imagem profissional para clínica estética: ${imageMatch[1].trim()}, alta qualidade, iluminação cinematográfica, composição elegante`
          });
        } else if (slideMatch) {
          // Fallback se não encontrar descrição de imagem
          prompts.push({
            slideTitle: slideMatch[1].trim(),
            prompt: `Ambiente clínico moderno e luxuoso, profissional especializado, equipamentos de alta tecnologia, iluminação suave e acolhedora, atmosfera de confiança e bem-estar, composição elegante, alta qualidade`
          });
        }
      });
      
      // Garantir exatamente 5 prompts para carrossel
      while (prompts.length < 5) {
        const slideNum = prompts.length + 1;
        prompts.push({
          slideTitle: `Slide ${slideNum}`,
          prompt: `Ambiente clínico moderno para tratamento estético, profissional especializado, equipamentos de alta tecnologia, iluminação suave, atmosfera acolhedora e profissional, composição elegante`
        });
      }
      
      return prompts.slice(0, 5);
    } else {
      // Para outros formatos, gerar 1 prompt baseado no conteúdo
      const tema = script.tema || 'tratamento estético';
      return [{
        prompt: `Ambiente clínico luxuoso e moderno para ${tema}, profissional sorridente atendendo cliente, equipamentos de alta tecnologia, iluminação suave e acolhedora, cores suaves, composição profissional, atmosfera de confiança e bem-estar, alta qualidade`
      }];
    }
  };

  const generateImages = async (script: any) => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);
    setErrors([]);
    
    try {
      console.log('🖼️ [useMultipleImageGeneration] Iniciando geração de imagens para:', script.formato);
      
      const prompts = extractImagePrompts(script);
      const totalImages = prompts.length;
      const newImages: GeneratedImage[] = [];
      const newErrors: string[] = [];
      
      console.log(`🎨 [useMultipleImageGeneration] Gerando ${totalImages} imagens`);
      
      // Gerar imagens sequencialmente com retry
      for (let i = 0; i < prompts.length; i++) {
        const promptData = prompts[i];
        let attempts = 0;
        const maxAttempts = 2;
        
        while (attempts < maxAttempts) {
          try {
            attempts++;
            console.log(`🖼️ Gerando imagem ${i + 1}/${totalImages} (tentativa ${attempts}): ${promptData.prompt.substring(0, 50)}...`);
            
            const { data, error } = await supabase.functions.invoke('generate-image', {
              body: {
                prompt: promptData.prompt,
                quality: 'standard',
                size: '1024x1024'
              }
            });

            if (error) {
              console.error(`❌ Erro na geração da imagem ${i + 1} (tentativa ${attempts}):`, error);
              if (attempts === maxAttempts) {
                newErrors.push(`Imagem ${i + 1}: ${error.message}`);
                break;
              }
              continue;
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
              break;
            } else {
              if (attempts === maxAttempts) {
                newErrors.push(`Imagem ${i + 1}: Nenhuma imagem retornada`);
              }
            }
          } catch (imageError: any) {
            console.error(`❌ Erro ao gerar imagem ${i + 1} (tentativa ${attempts}):`, imageError);
            if (attempts === maxAttempts) {
              newErrors.push(`Imagem ${i + 1}: ${imageError.message}`);
            }
          }
        }
      }
      
      setErrors(newErrors);
      
      if (newImages.length > 0) {
        toast({
          title: `🖼️ ${newImages.length} Imagem(ns) gerada(s)!`,
          description: newErrors.length > 0 
            ? `${newErrors.length} imagem(ns) falharam. Veja os detalhes no modal.`
            : `Suas imagens estão prontas para download.`,
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
    }
  };

  const retryFailedImages = async (script: any, failedIndexes: number[]) => {
    if (failedIndexes.length === 0) return;
    
    setIsGenerating(true);
    const prompts = extractImagePrompts(script);
    const currentImages = [...generatedImages];
    
    try {
      for (const index of failedIndexes) {
        const promptData = prompts[index];
        if (!promptData) continue;
        
        console.log(`🔄 Tentando novamente imagem ${index + 1}`);
        
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: {
            prompt: promptData.prompt,
            quality: 'standard',
            size: '1024x1024'
          }
        });

        if (!error && data?.image) {
          const newImage = {
            id: `img-${index + 1}`,
            prompt: promptData.prompt,
            imageUrl: data.image,
            slideTitle: promptData.slideTitle
          };
          
          currentImages[index] = newImage;
          setGeneratedImages([...currentImages]);
          
          // Remove error for this index
          const newErrors = errors.filter((_, i) => i !== index);
          setErrors(newErrors);
          
          console.log(`✅ Imagem ${index + 1} gerada com sucesso no retry`);
        }
      }
      
      toast({
        title: "🔄 Retry concluído!",
        description: "Algumas imagens foram regeneradas.",
      });
      
    } catch (error: any) {
      console.error('❌ Erro no retry:', error);
      toast({
        title: "Erro no retry",
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
      }, index * 500);
    });
  };

  const clearImages = () => {
    setGeneratedImages([]);
    setProgress(0);
    setErrors([]);
  };

  return {
    generateImages,
    retryFailedImages,
    isGenerating,
    generatedImages,
    progress,
    errors,
    downloadImage,
    downloadAllImages,
    clearImages
  };
};
