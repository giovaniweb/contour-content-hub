
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

  const { generateScript } = useSmartScriptGeneration();

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
      const result = await generateScript(finalIntention);
      
      if (result) {
        console.log('Resultado final:', result);
        setGeneratedResult(result);
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
      // Simular transformação Disney
      const disneyContent = transformContentWithDisney(generatedResult.content);
      
      setGeneratedResult({
        ...generatedResult,
        content: disneyContent
      });
      
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

  const transformContentWithDisney = (content: string): string => {
    // Transformação Disney básica
    const lines = content.split('\n');
    const transformedLines = lines.map(line => {
      if (line.includes('🎬')) {
        return line.replace('🎬 **Gancho**', '🏰 Era uma vez...');
      }
      if (line.includes('🎯')) {
        return line.replace('🎯 **Conflito**', '⚡ Até que um dia...');
      }
      if (line.includes('🔁')) {
        return line.replace('🔁 **Virada**', '✨ Então ela descobriu...');
      }
      if (line.includes('📣')) {
        return line.replace('📣 **CTA**', '🌟 E eles viveram felizes...');
      }
      return line;
    });
    
    return transformedLines.join('\n') + '\n\n🎠 Transformado com a magia Disney 1928\n"Onde há sonhos, há sempre um caminho para torná-los realidade."';
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
  };

  return {
    currentStep,
    setCurrentStep,
    intention,
    setIntention,
    generatedResult,
    setGeneratedResult,
    isGenerating,
    setIsGenerating,
    isDisneyMode,
    isApproved,
    handleThemeInput,
    applyDisneyMagic,
    approveScript,
    resetGeneration
  };
};
