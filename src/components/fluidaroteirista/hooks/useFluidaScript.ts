import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateScript as apiGenerateScript } from '@/services/supabaseService';
import { validatePreGeneration, validatePostGeneration, ValidationResult } from '../utils/antiGenericValidation';
import { validateAkinatorScript, ScriptDataFromAkinator } from '../utils/akinatorValidation';
import { parseAndLimitCarousel, validateCarouselSlides } from '../utils/carouselParser';
import { ScriptGenerationData, FluidaScriptResult } from '../types';
import { buildSystemPrompt, buildDisneyPrompt } from '../utils/promptBuilders';

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
        // Convert ScriptGenerationData to ScriptDataFromAkinator for validation
        const akinatorData: ScriptDataFromAkinator = {
          canal: data.canal || 'instagram',
          formato: data.formato || 'carrossel',
          objetivo: data.objetivo || 'atrair',
          estilo: data.estilo || 'criativo',
          equipamentos: Array.isArray(data.equipamentos) ? data.equipamentos : [],
          tema: data.tema || '',
          modo: data.modo || 'akinator'
        };
        validation = validateAkinatorScript(akinatorData);
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

      // Construir system prompt com nova estrutura - AWAIT necessário
      const systemPrompt = await buildSystemPrompt(
        [], // equipamentos detalhados - será populado depois
        data.modo || 'normal',
        data.mentor || 'Criativo',
        {
          canal: data.canal || 'instagram',
          formato: data.tipo_conteudo || data.formato || 'carrossel',
          objetivo: data.objetivo || 'atrair',
          estilo: data.estilo || 'criativo'
        }
      );

      const userPrompt = `
        Tema: ${data.tema}
        Canal: ${data.canal || 'instagram'}
        Formato: ${data.tipo_conteudo || data.formato || 'carrossel'}
        Objetivo: ${data.objetivo || 'atrair'}
        Estilo: ${data.estilo || 'criativo'}
        Equipamentos: ${Array.isArray(data.equipamentos) ? data.equipamentos.join(', ') : 'Nenhum específico'}
        
        Crie o roteiro seguindo exatamente as especificações do formato selecionado.
      `;

      // Preparar dados para a API
      const apiData = {
        type: 'fluidaroteirista',
        topic: data.tema || 'Tema não especificado',
        equipment: Array.isArray(data.equipamentos) ? data.equipamentos.join(', ') : '',
        additionalInfo: `Canal: ${data.canal}, Formato: ${data.tipo_conteudo || data.formato}, Objetivo: ${data.objetivo}, Estilo: ${data.estilo}`,
        tone: data.estilo || 'profissional',
        marketingObjective: data.objetivo || 'atrair',
        systemPrompt, // Now properly awaited
        userPrompt
      };

      console.log('📤 [useFluidaScript] Calling API with:', apiData);

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

      // Processar roteiro baseado no formato
      let processedContent = response.content;
      
      // Se for carrossel, aplicar parser e validação
      if (data.formato === 'carrossel' || data.tipo_conteudo === 'carrossel') {
        console.log('🎠 [useFluidaScript] Processando carrossel...');
        processedContent = parseAndLimitCarousel(response.content);
        
        const validation = validateCarouselSlides(processedContent);
        if (!validation.isValid) {
          console.warn('⚠️ [useFluidaScript] Validação do carrossel:', validation.errors);
        }
        
        console.log(`✅ [useFluidaScript] Carrossel processado com ${validation.slideCount} slides`);
      }

      const scriptResult: FluidaScriptResult = {
        roteiro: processedContent,
        formato: data.tipo_conteudo || data.formato || 'carrossel',
        emocao_central: data.estilo || 'engajamento',
        intencao: data.objetivo || 'atrair',
        objetivo: data.objetivo || 'atrair',
        mentor: data.mentor || 'Paulo Cuenca',
        equipamentos_utilizados: Array.isArray(data.equipamentos) ? data.equipamentos : [],
        created_at: new Date().toISOString(),
        canal: data.canal || 'instagram'
      };

      console.log('✅ [useFluidaScript] Script result created:', scriptResult);

      // CORREÇÃO CRÍTICA: Garantir que setResults seja chamado ANTES do return
      // e aguardar um microtask para garantir que o estado seja atualizado
      setResults([scriptResult]);
      console.log('📝 [useFluidaScript] Results state updated, length:', 1);
      
      // Aguardar um microtask para garantir atualização do state
      await new Promise(resolve => setTimeout(resolve, 10));
      
      toast({
        title: "✨ Roteiro gerado!",
        description: `${scriptResult.formato} para ${scriptResult.canal} no estilo ${scriptResult.mentor}`,
      });

      console.log('🎯 [useFluidaScript] Returning script result for callbacks');
      return [scriptResult];

    } catch (error) {
      console.error('❌ [useFluidaScript] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Limpar results em caso de erro
      setResults([]);
      
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
      const disneyPrompt = buildDisneyPrompt(script.roteiro, script.formato);

      const disneyData = {
        type: 'disney_magic',
        topic: 'Disney Transformation',
        equipment: '',
        additionalInfo: 'Transformar roteiro com magia Disney',
        tone: 'magical',
        marketingObjective: 'encantar',
        systemPrompt: disneyPrompt,
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
