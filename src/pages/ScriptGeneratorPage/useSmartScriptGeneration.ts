
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScriptIntention, INTENTION_TREE } from '@/components/smart-script-generator/intentionTree';
import { MentorInferenceEngine } from '@/components/smart-script-generator/mentorInference';
import { DynamicPromptGenerator } from '@/components/smart-script-generator/dynamicPrompts';
import { generateScript } from '@/services/supabaseService';

export interface SmartGenerationResult {
  content: string;
  mentor: string;
  enigma: string;
  intention: ScriptIntention;
}

export const useSmartScriptGeneration = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('root');
  const [intention, setIntention] = useState<Partial<ScriptIntention>>({});
  const [generatedResult, setGeneratedResult] = useState<SmartGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDisneyMode, setIsDisneyMode] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const getCurrentQuestion = () => {
    return INTENTION_TREE[currentStep];
  };

  const handleAnswer = (value: string) => {
    const currentNode = INTENTION_TREE[currentStep];
    const selectedOption = currentNode.options.find(opt => opt.value === value);
    
    // Atualizar intenção baseado no passo atual
    const updatedIntention = { ...intention };
    
    switch (currentStep) {
      case 'root':
        updatedIntention.tipo_conteudo = value as any;
        break;
      case 'objetivo':
        updatedIntention.objetivo = value as any;
        break;
      case 'canal':
        updatedIntention.canal = value;
        break;
      case 'estilo':
        updatedIntention.estilo_comunicacao = value as any;
        break;
      case 'equipamento':
        updatedIntention.equipamento = value;
        break;
    }
    
    setIntention(updatedIntention);
    
    // Navegar para próximo passo
    if (selectedOption?.leads_to) {
      setCurrentStep(selectedOption.leads_to);
    } else if (currentStep === 'tema') {
      // Último passo - gerar roteiro
      finalizeIntention({ ...updatedIntention, tema: value });
    }
  };

  const handleThemeInput = (tema: string) => {
    finalizeIntention({ ...intention, tema });
  };

  const finalizeIntention = async (completeIntention: Partial<ScriptIntention>) => {
    // Inferir mentor
    const mentorInference = MentorInferenceEngine.inferMentor(completeIntention);
    
    const finalIntention: ScriptIntention = {
      ...completeIntention,
      mentor_inferido: mentorInference.mentor,
      enigma_mentor: mentorInference.enigma
    } as ScriptIntention;
    
    setIntention(finalIntention);
    await generateRoteiro(finalIntention);
  };

  const generateRoteiro = async (finalIntention: ScriptIntention) => {
    setIsGenerating(true);
    
    try {
      const { systemPrompt, userPrompt } = DynamicPromptGenerator.generateMentorPrompt(finalIntention);
      
      // Chamar API com prompts dinâmicos
      const response = await generateScript({
        type: 'custom',
        systemPrompt,
        userPrompt,
        topic: finalIntention.tema,
        additionalInfo: `Tipo: ${finalIntention.tipo_conteudo}, Objetivo: ${finalIntention.objetivo}, Canal: ${finalIntention.canal}, Equipamento: ${finalIntention.equipamento || 'Não específico'}`,
        tone: finalIntention.estilo_comunicacao,
        marketingObjective: finalIntention.objetivo as any
      });

      const mentorProfile = MentorInferenceEngine.getMentorProfile(finalIntention.mentor_inferido);
      
      const result: SmartGenerationResult = {
        content: response.content,
        mentor: mentorProfile.name,
        enigma: finalIntention.enigma_mentor,
        intention: finalIntention
      };
      
      setGeneratedResult(result);
      
      toast({
        title: "✨ Roteiro gerado!",
        description: `Criado no estilo ${mentorProfile.name} com base na sua intenção.`,
      });

    } catch (error) {
      console.error('Erro ao gerar roteiro:', error);
      toast({
        title: "Erro na geração",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applyDisneyMagic = async () => {
    if (!generatedResult) return;
    
    setIsGenerating(true);
    
    try {
      const { systemPrompt, userPrompt } = DynamicPromptGenerator.generateDisneyPrompt(
        generatedResult.content, 
        generatedResult.intention
      );
      
      const response = await generateScript({
        type: 'custom',
        systemPrompt,
        userPrompt,
        topic: generatedResult.intention.tema,
        additionalInfo: 'Transformação Disney 1928',
        tone: 'magical',
        marketingObjective: generatedResult.intention.objetivo as any
      });

      setGeneratedResult({
        ...generatedResult,
        content: response.content
      });
      
      setIsDisneyMode(true);
      
      toast({
        title: "✨ Magia Disney 1928 Aplicada!",
        description: "Walt Disney transformou seu roteiro com narrativa encantadora.",
      });

    } catch (error) {
      console.error('Erro ao aplicar magia Disney:', error);
      toast({
        title: "Erro na transformação",
        description: "Não foi possível aplicar a magia Disney.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const approveScript = () => {
    setIsApproved(true);
    toast({
      title: "✅ Roteiro Aprovado!",
      description: "Agora você pode gerar conteúdo adicional.",
    });
  };

  const resetGeneration = () => {
    setCurrentStep('root');
    setIntention({});
    setGeneratedResult(null);
    setIsGenerating(false);
    setIsDisneyMode(false);
    setIsApproved(false);
  };

  return {
    currentStep,
    intention,
    generatedResult,
    isGenerating,
    isDisneyMode,
    isApproved,
    getCurrentQuestion,
    handleAnswer,
    handleThemeInput,
    applyDisneyMagic,
    approveScript,
    resetGeneration
  };
};
