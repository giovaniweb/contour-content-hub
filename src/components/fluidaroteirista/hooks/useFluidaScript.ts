
import { useState } from 'react';
import { toast } from 'sonner';
import { useEquipmentData } from '@/hooks/useEquipmentData';
import { FluidaScriptResult, ScriptGenerationData } from '../types';
import { validateScriptData } from '../utils/scriptValidation';
import { generateFluidaScript, applyDisneyTransformation } from '../services/scriptGenerator';

export const useFluidaScript = () => {
  const [results, setResults] = useState<FluidaScriptResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const generateImage = async (script: FluidaScriptResult) => {
    console.log('🖼️ [useFluidaScript] Gerando imagem...');
    toast.info('🖼️ Gerando imagem...', {
      description: 'Aguarde enquanto criamos a arte perfeita'
    });
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
  };

  return {
    results,
    isGenerating,
    generateScript,
    applyDisneyMagic,
    generateImage,
    generateAudio,
    clearResults
  };
};
