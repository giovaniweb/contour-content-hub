
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateScript as apiGenerateScript } from '@/services/supabaseService';
import { validatePreGeneration, validatePostGeneration, ValidationResult } from '../utils/antiGenericValidation';
import { validateAkinatorScript } from '../utils/akinatorValidation';
import { ScriptGenerationData, FluidaScriptResult } from '../types';

export const useFluidaScript = () => {
  const [results, setResults] = useState<FluidaScriptResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const { toast } = useToast();

  const generateScript = async (data: ScriptGenerationData, forceGenerate = false): Promise<FluidaScriptResult[]> => {
    console.log('🚀 [useFluidaScript] generateScript called with:', data);
    
    setIsGenerating(true);
    setShowValidation(false);
    
    try {
      // Verificação de segurança - garantir que data existe
      if (!data) {
        throw new Error('Dados de geração não fornecidos');
      }

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

      // Preparar dados para a API com verificações de segurança
      const apiData = {
        type: 'fluidaroteirista',
        topic: data.tema || 'Tema não especificado', // Guard: valor padrão se undefined
        equipment: Array.isArray(data.equipamentos) ? data.equipamentos.join(', ') : '', // Guard: verificar se é array
        additionalInfo: `Tipo: ${data.tipo_conteudo || 'não especificado'}, Objetivo: ${data.objetivo || 'não especificado'}, Canal: ${data.canal || 'não especificado'}, Estilo: ${data.estilo || 'não especificado'}, Mentor: ${data.mentor || 'não especificado'}`,
        tone: data.estilo || 'profissional', // Guard: valor padrão
        marketingObjective: data.objetivo || 'atrair', // Guard: valor padrão
        systemPrompt: buildSystemPrompt(data),
        userPrompt: buildUserPrompt(data)
      };

      console.log('📤 [useFluidaScript] Calling API with:', apiData);

      // Chamada para a API usando a interface correta
      const response = await apiGenerateScript(apiData);
      console.log('📥 [useFluidaScript] API response:', response);

      // Verificação robusta da resposta da API
      if (!response) {
        throw new Error('Resposta vazia da API');
      }

      if (typeof response !== 'object') {
        throw new Error('Resposta da API em formato inválido');
      }

      // Verificar se a resposta tem o conteúdo esperado
      if (!response.content || typeof response.content !== 'string') {
        console.error('❌ [useFluidaScript] Resposta sem conteúdo válido:', response);
        throw new Error('Resposta da API não contém conteúdo válido');
      }

      const scriptResult: FluidaScriptResult = {
        roteiro: response.content,
        formato: data.tipo_conteudo || data.formato || 'carrossel',
        emocao_central: data.estilo || 'engajamento',
        intencao: data.objetivo || 'atrair',
        objetivo: data.objetivo || 'atrair',
        mentor: data.mentor || 'Criativo',
        equipamentos_utilizados: Array.isArray(data.equipamentos) ? data.equipamentos : [],
        created_at: new Date().toISOString()
      };

      console.log('✅ [useFluidaScript] Script result created:', scriptResult);
      setResults([scriptResult]);
      
      toast({
        title: "✨ Roteiro gerado!",
        description: `Criado no estilo ${scriptResult.mentor}`,
      });

      return [scriptResult];

    } catch (error) {
      console.error('❌ [useFluidaScript] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "Erro na geração",
        description: `Erro: ${errorMessage}. Tente novamente em alguns instantes.`,
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

    // Verificação de segurança do script
    if (!script || !script.roteiro) {
      console.error('❌ [useFluidaScript] Script inválido para Disney Magic');
      toast({
        title: "❌ Erro",
        description: "Script inválido para aplicar Disney Magic",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Aplicar transformação Disney
      const disneyData = {
        type: 'disney_magic',
        topic: 'Disney Transformation',
        equipment: '',
        additionalInfo: 'Transformar roteiro com magia Disney',
        tone: 'magical',
        marketingObjective: 'encantar',
        systemPrompt: 'Você é Walt Disney em 1928. Transforme este roteiro com sua magia única.',
        userPrompt: `Transforme este roteiro com a magia Disney: ${script.roteiro}`
      };

      const response = await apiGenerateScript(disneyData);
      
      // Verificação robusta da resposta Disney
      if (!response) {
        throw new Error('Resposta vazia da API Disney');
      }

      if (!response.content || typeof response.content !== 'string') {
        throw new Error('Resposta Disney sem conteúdo válido');
      }

      const updatedScript = {
        ...script,
        roteiro: response.content,
        disney_applied: true,
        mentor: 'Walt Disney 1928',
        emocao_central: 'encantamento'
      };
      
      setResults([updatedScript]);
      
      toast({
        title: "✨ Disney Magic Aplicada!",
        description: "Roteiro transformado com a magia de Walt Disney",
      });

    } catch (error) {
      console.error('🔥 [useFluidaScript] Erro no Disney Magic:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "❌ Erro ao aplicar Disney Magic",
        description: `Erro: ${errorMessage}. Tente novamente`,
        variant: "destructive",
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

    // Verificação de segurança do script
    if (!script || !script.roteiro) {
      console.error('❌ [useFluidaScript] Script inválido para geração de imagem');
      toast({
        title: "❌ Erro",
        description: "Script inválido para gerar imagem",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);
    
    try {
      // Construir prompt inteligente baseado no roteiro
      const imagePrompt = buildImagePrompt(script);
      
      toast({
        title: "🖼️ Gerando imagem...",
        description: "Criando arte baseada no seu roteiro",
      });

      // Simular geração de imagem por enquanto
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Placeholder image URL
      const imageUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBHZXJhZGE8L3RleHQ+PC9zdmc+";
      
      setGeneratedImageUrl(imageUrl);
      
      toast({
        title: "🎨 Imagem gerada com sucesso!",
        description: "Sua arte está pronta para download",
      });

    } catch (error) {
      console.error('🔥 [useFluidaScript] Erro na geração de imagem:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "❌ Erro ao gerar imagem",
        description: `Erro: ${errorMessage}. Tente novamente`,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const buildImagePrompt = (script: FluidaScriptResult): string => {
    // Verificações de segurança para construir o prompt
    const equipamentos = Array.isArray(script.equipamentos_utilizados) ? script.equipamentos_utilizados.join(', ') : '';
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
    
    // Verificação de segurança
    if (!script || !script.roteiro) {
      toast({
        title: "❌ Erro",
        description: "Script inválido para gerar áudio",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "🎙️ Gerando áudio...",
      description: "Preparando narração do roteiro",
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

const buildSystemPrompt = (data: ScriptGenerationData): string => {
  // Verificações de segurança para todas as propriedades
  const canal = data.canal || 'redes sociais';
  const tipo_conteudo = data.tipo_conteudo || 'conteúdo';
  const objetivo = data.objetivo || 'engajar';
  const estilo = data.estilo || 'criativo';
  const mentor = data.mentor || 'Criativo';
  const equipamentos = Array.isArray(data.equipamentos) && data.equipamentos.length > 0 
    ? data.equipamentos 
    : [];

  return `
    Você é o FLUIDAROTEIRISTA especializado em ${canal}.
    
    CONTEXTO DO PROJETO:
    - Tipo de conteúdo: ${tipo_conteudo}
    - Objetivo: ${objetivo}
    - Canal: ${canal}
    - Estilo: ${estilo}
    - Mentor: ${mentor}
    ${equipamentos.length > 0 ? `- Equipamentos: ${equipamentos.join(', ')}` : ''}
    
    INSTRUÇÕES ESPECÍFICAS:
    - Crie conteúdo otimizado para ${canal}
    - Use o estilo ${estilo} do mentor ${mentor}
    - Foque no objetivo de ${objetivo}
    ${equipamentos.length > 0 ? `- OBRIGATÓRIO: Mencione os equipamentos: ${equipamentos.join(', ')}` : ''}
    
    Retorne apenas JSON válido com o roteiro estruturado.
  `;
};

const buildUserPrompt = (data: ScriptGenerationData): string => {
  // Verificações de segurança
  const tema = data.tema || 'Tema não especificado';
  const tipo_conteudo = data.tipo_conteudo || 'conteúdo';
  const canal = data.canal || 'redes sociais';
  const objetivo = data.objetivo || 'engajar';
  const estilo = data.estilo || 'criativo';

  return `
    Tema: ${tema}
    
    Crie um roteiro de ${tipo_conteudo} para ${canal} com o objetivo de ${objetivo}.
    Use o estilo ${estilo} e, se aplicável, mencione os equipamentos específicos.
  `;
};
