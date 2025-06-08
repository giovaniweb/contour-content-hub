
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SmartGenerationResult, ScriptIntention } from './useSmartScriptGeneration';
import { useSmartScriptGeneration } from './useSmartScriptGeneration';

export const useScriptGeneration = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [intention, setIntention] = useState<ScriptIntention | null>(null);
  const [generatedResult, setGeneratedResult] = useState<SmartGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDisneyMode, setIsDisneyMode] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const smartGeneration = useSmartScriptGeneration();

  const handleThemeInput = async (theme: string) => {
    console.log('handleThemeInput chamado com tema:', theme);
    
    if (!intention) {
      console.error('Intenção não definida');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Intenção não foi definida corretamente"
      });
      return;
    }

    console.log('Intenção atual:', intention);
    
    setIsGenerating(true);
    
    try {
      const finalIntention = {
        ...intention,
        tema: theme
      };
      
      console.log('finalizeIntention chamado com:', finalIntention);
      await smartGeneration.handleThemeInput(theme);
      
      // Use the result from smartGeneration
      if (smartGeneration.generatedResult) {
        setGeneratedResult(smartGeneration.generatedResult);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Erro ao gerar roteiro:', error);
      setIsGenerating(false);
      toast({
        variant: "destructive",
        title: "Erro ao gerar roteiro",
        description: "Houve um problema ao gerar o roteiro. Tente novamente."
      });
    }
  };

  const applyDisneyMagic = async () => {
    if (!generatedResult) return;
    
    setIsGenerating(true);
    
    try {
      await smartGeneration.applyDisneyMagic();
      setIsDisneyMode(true);
      setIsGenerating(false);
      
      toast({
        title: "✨ Magia Disney Aplicada!",
        description: "Seu roteiro foi transformado com a magia Disney 1928."
      });
    } catch (error) {
      console.error('Erro ao aplicar Disney:', error);
      setIsGenerating(false);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aplicar a transformação Disney."
      });
    }
  };

  const approveScript = () => {
    setIsApproved(true);
    toast({
      title: "✅ Roteiro Aprovado!",
      description: "Agora você pode gerar conteúdo adicional."
    });
  };

  const resetGeneration = () => {
    setCurrentStep(0);
    setIntention(null);
    setGeneratedResult(null);
    setIsGenerating(false);
    setIsDisneyMode(false);
    setIsApproved(false);
    smartGeneration.resetGeneration();
  };

  return {
    currentStep,
    setCurrentStep,
    intention,
    setIntention,
    generatedResult: smartGeneration.generatedResult || generatedResult,
    setGeneratedResult,
    isGenerating: smartGeneration.isGenerating || isGenerating,
    setIsGenerating,
    isDisneyMode: smartGeneration.isDisneyMode || isDisneyMode,
    isApproved: smartGeneration.isApproved || isApproved,
    handleThemeInput,
    applyDisneyMagic,
    approveScript,
    resetGeneration
  };
};
