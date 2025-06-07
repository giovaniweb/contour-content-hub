
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScriptGenerationData, GeneratedContent } from '@/components/smart-script-generator/types';
import { generateScript } from '@/services/supabaseService';
import { mapContentTypeToScriptType, mapObjectiveToMarketingType, buildAdditionalInfo, getMentorName, getSuggestionsForType } from './utils';
import { generateMockContent } from './mockContentService';

export const useScriptGeneration = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'smartInput' | 'generating' | 'result' | 'smartResult'>('smartInput');
  const [generationData, setGenerationData] = useState<ScriptGenerationData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleSmartGenerate = async (data: ScriptGenerationData) => {
    console.log('handleSmartGenerate iniciado com dados:', data);
    
    setGenerationData(data);
    setStep('generating');
    
    try {
      // Preparar requisição correta para a API
      const scriptRequest = {
        type: mapContentTypeToScriptType(data.contentType),
        topic: data.theme,
        tone: data.style.toLowerCase(),
        marketingObjective: mapObjectiveToMarketingType(data.objective),
        additionalInfo: buildAdditionalInfo(data),
        // Novos parâmetros para SmartScriptGenerator
        contentType: data.contentType,
        objective: data.objective,
        channel: data.channel,
        style: data.style,
        mentor: data.selectedMentor
      };

      console.log('Enviando requisição para API:', scriptRequest);

      // Adicionar timeout para evitar travamento
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na geração do roteiro')), 30000);
      });

      const scriptPromise = generateScript(scriptRequest);
      
      const response = await Promise.race([scriptPromise, timeoutPromise]);
      
      console.log('Resposta da API recebida:', response);
      
      const smartContent: GeneratedContent = {
        type: data.contentType,
        content: response.content,
        mentor: getMentorName(data.selectedMentor),
        suggestions: getSuggestionsForType(data.contentType)
      };

      setGeneratedContent(smartContent);
      setStep('smartResult');

      toast({
        title: "Roteiro gerado com sucesso!",
        description: `Conteúdo ${data.contentType} criado com base no estilo ${getMentorName(data.selectedMentor)}.`,
      });

    } catch (error) {
      console.error('Erro ao gerar roteiro:', error);
      
      // Fallback para conteúdo mock em caso de erro
      try {
        const mockContent = generateMockContent(data);
        setGeneratedContent(mockContent);
        setStep('smartResult');

        toast({
          title: "Roteiro gerado (modo simulado)",
          description: "Houve um problema com a API, mas geramos um conteúdo de exemplo.",
          variant: "destructive",
        });
      } catch (mockError) {
        console.error('Erro ao gerar conteúdo mock:', mockError);
        
        // Se mesmo o mock falhar, voltar para o input
        setStep('smartInput');
        
        toast({
          title: "Erro ao gerar roteiro",
          description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewScript = () => {
    console.log('handleNewScript chamado');
    setStep('smartInput');
    setGenerationData(null);
    setGeneratedContent(null);
  };

  return {
    step,
    generationData,
    generatedContent,
    handleSmartGenerate,
    handleNewScript,
    setStep
  };
};
