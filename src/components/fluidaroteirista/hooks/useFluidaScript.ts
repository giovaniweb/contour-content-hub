
import { useState } from 'react';
import { toast } from 'sonner';
import { useEquipmentData } from '@/hooks/useEquipmentData';
import { FluidaScriptResult, ScriptGenerationData } from '../types';
import { validateScriptData } from '../utils/scriptValidation';
import { generateFluidaScript, applyDisneyTransformation } from '../services/scriptGenerator';
import { generateImage } from '@/services/supabaseService';

export const useFluidaScript = () => {
  const [results, setResults] = useState<FluidaScriptResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { getEquipmentDetails } = useEquipmentData();

  const generateScript = async (data: ScriptGenerationData) => {
    console.log('🎬 [useFluidaScript] Iniciando geração de roteiro:', data);
    
    // Validações básicas
    if (!validateScriptData(data)) {
      return [];
    }

    if (isGenerating) {
      console.warn('⚠️ [useFluidaScript] Geração já em andamento, ignorando nova solicitação');
      return [];
    }
    
    setIsGenerating(true);
    
    try {
      console.log('🔧 [useFluidaScript] Buscando dados dos equipamentos...');
      // Buscar dados dos equipamentos se disponíveis
      const equipmentNames = data.equipamentos || [];
      const equipmentDetails = await getEquipmentDetails(equipmentNames);
      console.log('✅ [useFluidaScript] Equipamentos carregados:', equipmentDetails.length);
      
      const scriptResult = await generateFluidaScript(data, equipmentDetails);
      
      console.log('🎯 [useFluidaScript] Script resultado criado:', scriptResult);
      setResults([scriptResult]);
      
      toast.success('🎬 Roteiro FLUIDA gerado!', {
        description: `Criado em 60 segundos com ${equipmentNames.length} equipamento(s)`
      });

      return [scriptResult];

    } catch (error) {
      console.error('🔥 [useFluidaScript] Erro na geração:', error);
      toast.error('❌ Erro ao gerar roteiro', {
        description: error instanceof Error ? error.message : 'Tente novamente em alguns instantes'
      });
      return [];
    } finally {
      console.log('🏁 [useFluidaScript] Finalizando geração');
      setIsGenerating(false);
    }
  };

  const applyDisneyMagic = async (script: FluidaScriptResult) => {
    console.log('✨ [useFluidaScript] Aplicando Disney Magic...');
    
    if (isGenerating) {
      console.warn('⚠️ [useFluidaScript] Operação já em andamento');
      return;
    }

    setIsGenerating(true);
    
    try {
      const updatedScript = await applyDisneyTransformation(script);
      setResults([updatedScript]);
      
      toast.success('✨ Disney Magic Aplicada!', {
        description: 'Roteiro transformado com a magia de Walt Disney'
      });

    } catch (error) {
      console.error('🔥 [useFluidaScript] Erro no Disney Magic:', error);
      toast.error('❌ Erro ao aplicar Disney Magic', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImageForScript = async (script: FluidaScriptResult) => {
    console.log('🖼️ [useFluidaScript] Gerando imagem para roteiro...');
    
    if (isGeneratingImage) {
      console.warn('⚠️ [useFluidaScript] Geração de imagem já em andamento');
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);
    
    try {
      // Construir prompt inteligente baseado no roteiro
      const imagePrompt = buildImagePrompt(script);
      
      toast.info('🖼️ Gerando imagem...', {
        description: 'Criando arte baseada no seu roteiro'
      });

      const response = await generateImage({
        prompt: imagePrompt,
        style: 'realistic',
        aspectRatio: script.formato === 'stories' ? '9:16' : '1:1'
      });

      if (response.success && response.imageUrl) {
        setGeneratedImageUrl(response.imageUrl);
        
        toast.success('🎨 Imagem gerada com sucesso!', {
          description: 'Sua arte está pronta para download'
        });
      } else {
        throw new Error(response.error || 'Erro na geração da imagem');
      }

    } catch (error) {
      console.error('🔥 [useFluidaScript] Erro na geração de imagem:', error);
      toast.error('❌ Erro ao gerar imagem', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const buildImagePrompt = (script: FluidaScriptResult): string => {
    const equipamentos = script.equipamentos_utilizados?.map(eq => eq.nome).join(', ') || '';
    const emocao = script.emocao_central || 'confiança';
    
    return `Create a professional medical aesthetic clinic image featuring ${equipamentos ? `${equipamentos} equipment` : 'modern aesthetic equipment'}. 
    Style: Clean, modern, medical aesthetic clinic setting. 
    Emotion: ${emocao} and professionalism. 
    Colors: Soft, clean tones with medical white and subtle accent colors.
    Elements: Professional medical environment, clean surfaces, modern equipment, elegant lighting.
    No text, no people, focus on the equipment and clinical environment.
    High quality, professional photography style.`;
  };

  const generateAudio = async (script: FluidaScriptResult) => {
    console.log('🎙️ [useFluidaScript] Gerando áudio...');
    toast.info('🎙️ Gerando áudio...', {
      description: 'Preparando narração do roteiro'
    });
  };

  const clearResults = () => {
    console.log('🧹 [useFluidaScript] Limpando resultados');
    setResults([]);
    setGeneratedImageUrl(null);
  };

  return {
    results,
    isGenerating,
    isGeneratingImage,
    generatedImageUrl,
    generateScript,
    applyDisneyMagic,
    generateImage: generateImageForScript,
    generateAudio,
    clearResults
  };
};
