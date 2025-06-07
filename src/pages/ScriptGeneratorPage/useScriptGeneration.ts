
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

      const response = await generateScript(scriptRequest);
      
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
      const mockContent = generateMockContent(data);
      setGeneratedContent(mockContent);
      setStep('smartResult');

      toast({
        title: "Roteiro gerado (modo simulado)",
        description: "Houve um problema com a API, mas geramos um conteúdo de exemplo.",
        variant: "destructive",
      });
    }
  };

  const handleNewScript = () => {
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
