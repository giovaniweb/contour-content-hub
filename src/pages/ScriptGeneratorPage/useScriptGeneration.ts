
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SmartGenerationResult, ScriptIntention } from './useSmartScriptGeneration';
import { useSmartScriptGeneration } from './useSmartScriptGeneration';

export const useScriptGeneration = () => {
  const { toast } = useToast();
  const smartGeneration = useSmartScriptGeneration();

  const handleThemeInput = async (theme: string) => {
    console.log('🎬 handleThemeInput iniciado com tema:', theme);
    
    if (!smartGeneration.intention || Object.keys(smartGeneration.intention).length === 0) {
      console.error('❌ Intenção não definida no smartGeneration');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Intenção não foi definida corretamente"
      });
      return;
    }

    console.log('✅ Intenção válida, chamando handleThemeInput do smartGeneration');
    
    try {
      await smartGeneration.handleThemeInput(theme);
      console.log('✅ handleThemeInput do smartGeneration concluído');
    } catch (error) {
      console.error('❌ Erro em handleThemeInput:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar roteiro",
        description: "Houve um problema ao gerar o roteiro. Tente novamente."
      });
    }
  };

  const applyDisneyMagic = async () => {
    console.log('✨ Aplicando magia Disney...');
    try {
      await smartGeneration.applyDisneyMagic();
      toast({
        title: "✨ Magia Disney Aplicada!",
        description: "Seu roteiro foi transformado com a magia Disney 1928."
      });
    } catch (error) {
      console.error('❌ Erro ao aplicar Disney:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aplicar a transformação Disney."
      });
    }
  };

  const approveScript = () => {
    smartGeneration.approveScript();
    toast({
      title: "✅ Roteiro Aprovado!",
      description: "Agora você pode gerar conteúdo adicional."
    });
  };

  const resetGeneration = () => {
    console.log('🔄 Resetando geração...');
    smartGeneration.resetGeneration();
  };

  return {
    // Estados sincronizados com smartGeneration
    currentStep: smartGeneration.currentStep,
    intention: smartGeneration.intention,
    generatedResult: smartGeneration.generatedResult,
    isGenerating: smartGeneration.isGenerating,
    isDisneyMode: smartGeneration.isDisneyMode,
    isApproved: smartGeneration.isApproved,
    
    // Métodos
    handleThemeInput,
    applyDisneyMagic,
    approveScript,
    resetGeneration,
    
    // Métodos do smartGeneration
    getCurrentQuestion: smartGeneration.getCurrentQuestion,
    handleAnswer: smartGeneration.handleAnswer,
    
    // Setters (se necessário)
    setCurrentStep: () => {}, // Não usado diretamente
    setIntention: () => {}, // Não usado diretamente
    setGeneratedResult: () => {}, // Não usado diretamente
    setIsGenerating: () => {} // Não usado diretamente
  };
};
