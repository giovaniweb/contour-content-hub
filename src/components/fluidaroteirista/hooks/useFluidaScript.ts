
import { useState } from 'react';
import { toast } from 'sonner';
import { useEquipmentData } from '@/hooks/useEquipmentData';
import { FluidaScriptResult, ScriptGenerationData } from '../types';
import { 
  validatePreGeneration, 
  validatePostGeneration, 
  meetsQualityStandards,
  generateImprovementSuggestions,
  generateSmartQuestions,
  ValidationResult 
} from '../utils/antiGenericValidation';
import { generateFluidaScript, applyDisneyTransformation } from '../services/scriptGenerator';
import { generateImage } from '@/services/supabaseService';

export const useFluidaScript = () => {
  const [results, setResults] = useState<FluidaScriptResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const { getEquipmentDetails } = useEquipmentData();

  const generateScript = async (data: ScriptGenerationData, forceGenerate: boolean = false) => {
    console.log('🎬 [useFluidaScript] ===== INICIANDO GERAÇÃO COM VALIDAÇÃO =====');
    console.log('📋 [useFluidaScript] Dados recebidos:', data);
    console.log('🔒 [useFluidaScript] Força geração:', forceGenerate);
    
    // STEP 1: VALIDAÇÃO PRÉ-GERAÇÃO OBRIGATÓRIA
    if (!forceGenerate) {
      console.log('🔍 [useFluidaScript] Executando validação pré-geração...');
      const validation = validatePreGeneration(data);
      
      if (!validation.isValid) {
        console.log('❌ [useFluidaScript] VALIDAÇÃO FALHOU - Bloqueando geração');
        console.log('📊 [useFluidaScript] Erros encontrados:', validation.errors);
        
        setValidationResult(validation);
        setShowValidation(true);
        
        // Gerar perguntas inteligentes
        const smartQuestions = generateSmartQuestions(validation);
        
        toast.error('🚫 Roteiro bloqueado pelo sistema anti-genérico', {
          description: `${validation.errors.length} problemas encontrados. Complete as informações obrigatórias.`
        });
        
        console.log('💡 [useFluidaScript] Perguntas inteligentes:', smartQuestions);
        return [];
      }
      
      console.log('✅ [useFluidaScript] Validação pré-geração APROVADA');
      setValidationResult(null);
      setShowValidation(false);
    }

    if (isGenerating) {
      console.warn('⚠️ [useFluidaScript] Geração já em andamento, ignorando nova solicitação');
      return [];
    }
    
    setIsGenerating(true);
    
    try {
      // CORREÇÃO: Tratar equipamentos como array
      const equipmentNames = Array.isArray(data.equipamentos) 
        ? data.equipamentos 
        : data.equipamentos 
          ? [data.equipamentos]
          : [];

      console.log('🔍 [useFluidaScript] Equipment names to search for:', equipmentNames);
      
      if (equipmentNames.length > 0) {
        console.log('🔧 [useFluidaScript] Buscando dados detalhados dos equipamentos...');
        const equipmentDetails = await getEquipmentDetails(equipmentNames);
        console.log('✅ [useFluidaScript] Equipamentos carregados:', equipmentDetails.length);
        
        // VALIDAÇÃO CRÍTICA: Verificar se equipamentos foram carregados corretamente
        if (equipmentNames.length > 0 && equipmentDetails.length === 0) {
          console.error('❌ [useFluidaScript] ERRO CRÍTICO: Equipamentos selecionados mas nenhum detalhe carregado!');
          toast.error('⚠️ Equipamentos não carregados', {
            description: 'Os equipamentos selecionados não puderam ser carregados. Gerando roteiro genérico.'
          });
        }

        console.log('🚀 [useFluidaScript] Gerando roteiro com equipamentos...');
        const scriptResult = await generateFluidaScript(data, equipmentDetails);
        
        // STEP 2: VALIDAÇÃO PÓS-GERAÇÃO RIGOROSA
        console.log('🎯 [useFluidaScript] Executando validação pós-geração...');
        const qualityCheck = validatePostGeneration(scriptResult, data);
        const meetsStandards = meetsQualityStandards(qualityCheck);
        
        if (!meetsStandards && !forceGenerate) {
          console.warn('⚠️ [useFluidaScript] QUALIDADE INSUFICIENTE - Solicitando melhorias');
          
          const improvements = generateImprovementSuggestions(qualityCheck, data);
          
          toast.warning('⚠️ Roteiro precisa de melhorias', {
            description: `${improvements.length} ajustes sugeridos para maior personalização`
          });
          
          console.log('📋 [useFluidaScript] Melhorias sugeridas:', improvements);
          // Retornar o script mesmo assim, mas com aviso
        }
        
        // VALIDAÇÃO PÓS-GERAÇÃO: Verificar se equipamentos aparecem no roteiro
        if (equipmentDetails.length > 0) {
          const equipmentMentioned = equipmentDetails.some(eq => 
            scriptResult.roteiro.toLowerCase().includes(eq.nome.toLowerCase())
          );
          
          if (!equipmentMentioned) {
            console.error('❌ [useFluidaScript] PROBLEMA: Equipamentos não mencionados no roteiro gerado!');
            
            toast.warning('⚠️ Atenção aos equipamentos', {
              description: 'Verifique se os equipamentos estão bem integrados no roteiro.'
            });
          } else {
            console.log('✅ [useFluidaScript] Equipamentos mencionados no roteiro!');
            toast.success('🎬 Roteiro FLUIDA gerado!', {
              description: `Criado com ${equipmentNames.length} equipamento(s) integrado(s) ✅`
            });
          }
        }

        console.log('🎯 [useFluidaScript] Script resultado criado:', scriptResult);
        setResults([scriptResult]);
        return [scriptResult];
        
      } else {
        console.log('📝 [useFluidaScript] Gerando roteiro sem equipamentos específicos...');
        const scriptResult = await generateFluidaScript(data, []);
        
        // Validação pós-geração mesmo sem equipamentos
        const qualityCheck = validatePostGeneration(scriptResult, data);
        const meetsStandards = meetsQualityStandards(qualityCheck);
        
        if (!meetsStandards && !forceGenerate) {
          console.warn('⚠️ [useFluidaScript] QUALIDADE INSUFICIENTE - Roteiro muito genérico');
          
          toast.warning('⚠️ Roteiro muito genérico', {
            description: 'Adicione equipamentos ou seja mais específico no tema'
          });
        }
        
        console.log('🎯 [useFluidaScript] Script resultado criado (sem equipamentos):', scriptResult);
        setResults([scriptResult]);
        
        toast.success('🎬 Roteiro FLUIDA gerado!', {
          description: 'Roteiro criado. Para melhor qualidade, adicione equipamentos específicos.'
        });

        return [scriptResult];
      }

    } catch (error) {
      console.error('🔥 [useFluidaScript] ERRO NA GERAÇÃO:', error);
      toast.error('❌ Erro ao gerar roteiro', {
        description: error instanceof Error ? error.message : 'Tente novamente em alguns instantes'
      });
      return [];
    } finally {
      console.log('🏁 [useFluidaScript] ===== FINALIZANDO GERAÇÃO =====');
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
    setValidationResult(null);
    setShowValidation(false);
  };

  const dismissValidation = () => {
    setShowValidation(false);
    setValidationResult(null);
  };

  const forceGenerate = async (data: ScriptGenerationData) => {
    console.log('🚀 [useFluidaScript] Forçando geração ignorando validação...');
    return await generateScript(data, true);
  };

  return {
    results,
    isGenerating,
    isGeneratingImage,
    generatedImageUrl,
    validationResult,
    showValidation,
    generateScript,
    forceGenerate,
    applyDisneyMagic,
    generateImage: generateImageForScript,
    generateAudio,
    clearResults,
    dismissValidation
  };
};
