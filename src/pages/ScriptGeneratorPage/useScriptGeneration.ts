
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
    
    if (!smartGeneration.intention || Object.keys(smartGeneration.intention).length === 0) {
      console.error('Intenção não definida no smartGeneration');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Intenção não foi definida corretamente"
      });
      return;
    }

    console.log('Intenção atual do smartGeneration:', smartGeneration.intention);
    
    setIsGenerating(true);
    
    try {
      console.log('Chamando smartGeneration.handleThemeInput');
      await smartGeneration.handleThemeInput(theme);
      
      // Aguardar que o resultado esteja disponível
      if (smartGeneration.generatedResult) {
        console.log('Resultado recebido:', smartGeneration.generatedResult);
        setGeneratedResult(smartGeneration.generatedResult);
        setIsGenerating(false);
        
        toast({
          title: "✨ Roteiro gerado com sucesso!",
          description: "Seu roteiro personalizado está pronto para revisão."
        });
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
    if (!generatedResult && !smartGeneration.generatedResult) return;
    
    setIsGenerating(true);
    
    try {
      await smartGeneration.applyDisneyMagic();
      setIsDisneyMode(true);
      setIsGenerating(false);
      
      // Atualizar o resultado local com o resultado do smartGeneration
      if (smartGeneration.generatedResult) {
        setGeneratedResult(smartGeneration.generatedResult);
      }
      
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
    smartGeneration.approveScript();
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

  // Sincronizar os estados do smartGeneration com os locais
  const syncedGeneratedResult = smartGeneration.generatedResult || generatedResult;
  const syncedIsGenerating = smartGeneration.isGenerating || isGenerating;
  const syncedIsDisneyMode = smartGeneration.isDisneyMode || isDisneyMode;
  const syncedIsApproved = smartGeneration.isApproved || isApproved;

  return {
    currentStep: smartGeneration.currentStep,
    setCurrentStep,
    intention: smartGeneration.intention,
    setIntention,
    generatedResult: syncedGeneratedResult,
    setGeneratedResult,
    isGenerating: syncedIsGenerating,
    setIsGenerating,
    isDisneyMode: syncedIsDisneyMode,
    isApproved: syncedIsApproved,
    handleThemeInput,
    applyDisneyMagic,
    approveScript,
    resetGeneration,
    // Expor métodos do smartGeneration
    getCurrentQuestion: smartGeneration.getCurrentQuestion,
    handleAnswer: smartGeneration.handleAnswer
  };
};
