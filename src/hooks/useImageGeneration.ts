
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PhotographicPromptBuilder } from '@/utils/photographicPromptBuilder';
import AIMonitoring from '@/utils/aiMonitoring';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async (script: any) => {
    setIsGenerating(true);
    
    try {
      console.log('🖼️ [useImageGeneration] Iniciando geração de imagem para script:', script.formato);
      
      // Detectar equipamentos e construir prompt fotográfico robusto (anti-alucinação)
      const equipments = PhotographicPromptBuilder.extractEquipmentsFromScript(script);
      const slidePrompts = PhotographicPromptBuilder.buildSlidePrompts(script);
      const heroPrompt = slidePrompts?.[0]?.prompt || 'Professional medical clinic environment, natural lighting, clean composition';

      const equipmentName = equipments?.[0]?.nome;
      console.log('🎯 [useImageGeneration] Equipamento detectado:', equipmentName || 'nenhum');

      console.log('🎨 [useImageGeneration] Prompt da imagem:', heroPrompt);

      const t0 = Date.now();
      // Chamar edge function para gerar imagem (com ancoragem textual de equipamento)
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: heroPrompt,
          quality: 'hd',
          size: '1024x1024',
          style: 'natural',
          equipmentName
        }
      });
      const elapsed = Date.now() - t0;

      if (error) {
        console.error('❌ [useImageGeneration] Erro na API:', error);
        throw error;
      }

      if (data?.image) {
        console.log('✅ [useImageGeneration] Imagem gerada com sucesso em', elapsed, 'ms');
        setGeneratedImageUrl(data.image);
        
        // Observabilidade básica
        const monitor = AIMonitoring.getInstance();
        const estimatedPromptTokens = Math.round(heroPrompt.length / 4); // estimativa simples
        monitor.trackUsage({
          service: 'image',
          endpoint: 'generate-image',
          promptTokens: estimatedPromptTokens,
          completionTokens: 1, // imagens não retornam tokens, marcador
          totalTokens: estimatedPromptTokens + 1,
          estimatedCost: 0, // calculado internamente
          model: data?.metrics?.model || 'dall-e-3',
          responseTime: data?.metrics?.response_time_ms || elapsed
        }).catch((e) => console.warn('⚠️ monitor.trackUsage falhou (não crítico):', e));

        toast({
          title: "🖼️ Imagem gerada!",
          description: equipmentName 
            ? `Imagem criada com contexto do equipamento ${equipmentName}.`
            : "Sua imagem foi criada com sucesso usando IA.",
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
