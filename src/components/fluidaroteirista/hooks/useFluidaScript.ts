import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateScript } from '@/services/supabaseService';
import { validatePreGeneration, validatePostGeneration, ValidationResult } from '../utils/antiGenericValidation';
import { validateAkinatorScript } from '../utils/akinatorValidation';
import { ScriptGenerationData, FluidaScriptResult } from '../types';

export const useFluidaScript = () => {
  const [results, setResults] = useState<FluidaScriptResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const { toast } = useToast();

  const generateScript = async (data: ScriptGenerationData, forceGenerate = false): Promise<FluidaScriptResult[]> => {
    console.log('🚀 [useFluidaScript] generateScript called with:', data);
    
    setIsGenerating(true);
    setShowValidation(false);
    
    try {
      // Escolher validação baseada no modo
      let validation: ValidationResult;
      
      if (data.modo === 'akinator') {
        console.log('🎯 [useFluidaScript] Usando validação Akinator');
        validation = validateAkinatorScript(data);
      } else {
        console.log('🔍 [useFluidaScript] Usando validação padrão');
        validation = validatePreGeneration(data);
      }

      console.log('📊 [useFluidaScript] Validation result:', validation);

      // Se não for forçar geração e validação falhar
      if (!forceGenerate && !validation.isValid && validation.quality === 'low') {
        console.log('❌ [useFluidaScript] Validation failed, showing validation UI');
        setValidationResult(validation);
        setShowValidation(true);
        setIsGenerating(false);
        return [];
      }

      // Preparar dados para a API
      const apiData = {
        type: 'fluidaroteirista',
        topic: data.tema,
        equipment: data.equipamentos?.join(', ') || '',
        additionalInfo: `Tipo: ${data.tipo_conteudo}, Objetivo: ${data.objetivo}, Canal: ${data.canal}, Estilo: ${data.estilo}, Mentor: ${data.mentor}`,
        tone: data.estilo,
        marketingObjective: data.objetivo,
        systemPrompt: buildSystemPrompt(data),
        userPrompt: buildUserPrompt(data)
      };

      console.log('📤 [useFluidaScript] Calling API with:', apiData);

      const response = await generateScript(apiData);
      console.log('📥 [useFluidaScript] API response:', response);

      if (response && response.content) {
        const scriptResult: FluidaScriptResult = {
          id: Date.now().toString(),
          roteiro: response.content,
          formato: data.tipo_conteudo || 'carrossel',
          emocao_central: response.emotion || data.estilo || 'engajamento',
          intencao: response.intention || data.objetivo || 'atrair',
          objetivo: data.objetivo || 'atrair',
          mentor: data.mentor || 'Criativo',
          equipamentos_utilizados: data.equipamentos || [],
          created_at: new Date().toISOString()
        };

        console.log('✅ [useFluidaScript] Script result created:', scriptResult);
        setResults([scriptResult]);
        
        toast({
          title: "✨ Roteiro gerado!",
          description: `Criado no estilo ${scriptResult.mentor}`,
        });

        return [scriptResult];
      } else {
        throw new Error('Resposta inválida da API');
      }

    } catch (error) {
      console.error('❌ [useFluidaScript] Error:', error);
      toast({
        title: "Erro na geração",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  const forceGenerate = async (data: ScriptGenerationData): Promise<FluidaScriptResult[]> => {
    console.log('💪 [useFluidaScript] Force generating script');
    return generateScript(data, true);
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
    console.log('❌ [useFluidaScript] Dismissing validation');
    setShowValidation(false);
    setValidationResult(null);
  };

  return {
    results,
    isGenerating,
    generateScript,
    forceGenerate,
    applyDisneyMagic,
    generateImage: generateImageForScript,
    generateAudio,
    clearResults,
    dismissValidation
  };
};

const buildSystemPrompt = (data: ScriptGenerationData): string => {
  return `
    Você é o FLUIDAROTEIRISTA especializado em ${data.canal || 'redes sociais'}.
    
    CONTEXTO DO PROJETO:
    - Tipo de conteúdo: ${data.tipo_conteudo}
    - Objetivo: ${data.objetivo}
    - Canal: ${data.canal}
    - Estilo: ${data.estilo}
    - Mentor: ${data.mentor}
    ${data.equipamentos?.length ? `- Equipamentos: ${data.equipamentos.join(', ')}` : ''}
    
    INSTRUÇÕES ESPECÍFICAS:
    - Crie conteúdo otimizado para ${data.canal}
    - Use o estilo ${data.estilo} do mentor ${data.mentor}
    - Foque no objetivo de ${data.objetivo}
    ${data.equipamentos?.length ? `- OBRIGATÓRIO: Mencione os equipamentos: ${data.equipamentos.join(', ')}` : ''}
    
    Retorne apenas JSON válido com o roteiro estruturado.
  `;
};

const buildUserPrompt = (data: ScriptGenerationData): string => {
  return `
    Tema: ${data.tema}
    
    Crie um roteiro de ${data.tipo_conteudo} para ${data.canal} com o objetivo de ${data.objetivo}.
    Use o estilo ${data.estilo} e, se aplicável, mencione os equipamentos específicos.
  `;
};
