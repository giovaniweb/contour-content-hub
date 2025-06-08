
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScriptGenerationData, GeneratedContent } from '@/components/smart-script-generator/types';
import { generateScript, ScriptResponse } from '@/services/supabaseService';
import { mapContentTypeToScriptType, mapObjectiveToMarketingType, buildAdditionalInfo, getMentorName, getSuggestionsForType } from './utils';

export const useScriptGeneration = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'smartInput' | 'generating' | 'result' | 'smartResult'>('smartInput');
  const [generationData, setGenerationData] = useState<ScriptGenerationData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleSmartGenerate = async (data: ScriptGenerationData) => {
    console.log('🚀 Iniciando geração inteligente de roteiro:', data);
    
    setGenerationData(data);
    setStep('generating');
    
    try {
      // Preparar requisição para OpenAI
      const scriptRequest = {
        type: mapContentTypeToScriptType(data.contentType),
        topic: data.theme,
        tone: data.style.toLowerCase(),
        marketingObjective: mapObjectiveToMarketingType(data.objective),
        additionalInfo: buildAdditionalInfo(data),
        contentType: data.contentType,
        objective: data.objective,
        channel: data.channel,
        style: data.style,
        mentor: data.selectedMentor
      };

      console.log('📡 Enviando para OpenAI:', scriptRequest);

      // Timeout estendido para geração complexa
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('⏰ Timeout na geração - OpenAI demorou mais que esperado')), 90000);
      });

      const scriptPromise = generateScript(scriptRequest);
      
      console.log('⚡ Processando com OpenAI...');
      const response = await Promise.race([scriptPromise, timeoutPromise]) as ScriptResponse;
      
      console.log('✅ Resposta OpenAI recebida:', response);
      
      if (!response.content || response.content.trim().length < 50) {
        throw new Error('Resposta inválida da OpenAI - conteúdo muito curto');
      }
      
      const smartContent: GeneratedContent = {
        type: data.contentType,
        content: response.content,
        mentor: getMentorName(data.selectedMentor),
        suggestions: getSuggestionsForType(data.contentType)
      };

      setGeneratedContent(smartContent);
      setStep('smartResult');

      toast({
        title: "🎉 Roteiro gerado com sucesso!",
        description: `✨ Conteúdo ${data.contentType} criado com IA no estilo ${getMentorName(data.selectedMentor)}.`,
      });

    } catch (error) {
      console.error('❌ Erro na geração OpenAI:', error);
      
      setStep('smartInput');
      
      // Tratamento específico de erros OpenAI
      let errorMessage = "Ocorreu um erro inesperado. Tente novamente.";
      
      if (error.message?.includes('rate_limit_exceeded')) {
        errorMessage = "🚫 Limite OpenAI atingido. Aguarde alguns instantes e tente novamente.";
      } else if (error.message?.includes('insufficient_quota')) {
        errorMessage = "💳 Cota OpenAI insuficiente. Verifique sua conta OpenAI.";
      } else if (error.message?.includes('invalid_api_key')) {
        errorMessage = "🔑 Chave OpenAI inválida. Verifique a configuração.";
      } else if (error.message?.includes('Timeout')) {
        errorMessage = "⏰ OpenAI demorou mais que o esperado. Tente novamente.";
      }
      
      toast({
        title: "❌ Erro na geração OpenAI",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleNewScript = () => {
    console.log('🔄 Iniciando novo roteiro');
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
