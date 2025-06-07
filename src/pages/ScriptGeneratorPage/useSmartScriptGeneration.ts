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
        // Para equipamento, salvar o ID do equipamento ou string especial
        updatedIntention.equipamento = value;
        break;
    }
    
    setIntention(updatedIntention);
    
    // Navegar para próximo passo
    if (selectedOption?.leads_to) {
      setCurrentStep(selectedOption.leads_to);
    } else if (currentStep === 'equipamento') {
      // Após equipamento, ir para tema
      setCurrentStep('tema');
    }
  };

  const handleThemeInput = async (tema: string) => {
    console.log('handleThemeInput chamado com tema:', tema);
    console.log('Intenção atual:', intention);
    
    // Começar loading IMEDIATAMENTE antes de qualquer processamento
    setIsGenerating(true);
    
    // Aguardar um frame para garantir que o estado seja atualizado na UI
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Finalizar intenção e gerar roteiro
      await finalizeIntention({ ...intention, tema });
    } catch (error) {
      console.error('Erro em handleThemeInput:', error);
      setIsGenerating(false);
      toast({
        title: "Erro na preparação",
        description: "Não foi possível preparar o roteiro.",
        variant: "destructive",
      });
    }
  };

  const finalizeIntention = async (completeIntention: Partial<ScriptIntention>) => {
    console.log('finalizeIntention chamado com:', completeIntention);
    
    try {
      // Inferir mentor
      const mentorInference = MentorInferenceEngine.inferMentor(completeIntention);
      
      const finalIntention: ScriptIntention = {
        ...completeIntention,
        mentor_inferido: mentorInference.mentor,
        enigma_mentor: mentorInference.enigma
      } as ScriptIntention;
      
      console.log('Intenção finalizada:', finalIntention);
      setIntention(finalIntention);
      
      await generateRoteiro(finalIntention);
    } catch (error) {
      console.error('Erro em finalizeIntention:', error);
      setIsGenerating(false);
      toast({
        title: "Erro na preparação",
        description: "Não foi possível preparar o roteiro.",
        variant: "destructive",
      });
    }
  };

  const generateRoteiro = async (finalIntention: ScriptIntention) => {
    console.log('generateRoteiro iniciado com:', finalIntention);
    
    try {
      const { systemPrompt, userPrompt } = DynamicPromptGenerator.generateMentorPrompt(finalIntention);
      
      console.log('Prompts gerados, chamando API...');
      
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

      console.log('Resposta da API recebida:', response);

      const mentorProfile = MentorInferenceEngine.getMentorProfile(finalIntention.mentor_inferido);
      
      const result: SmartGenerationResult = {
        content: response.content,
        mentor: mentorProfile.name,
        enigma: finalIntention.enigma_mentor,
        intention: finalIntention
      };
      
      console.log('Resultado final:', result);
      
      setGeneratedResult(result);
      
      toast({
        title: "✨ Roteiro gerado!",
        description: `Criado no estilo ${mentorProfile.name} com base na sua intenção.`,
      });

    } catch (error) {
      console.error('Erro ao gerar roteiro:', error);
      
      // Tratar erro de rate limit especificamente
      if (error.message && error.message.includes('rate_limit_exceeded')) {
        toast({
          title: "Limite de requisições atingido",
          description: "Muitas requisições foram feitas. Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro na geração",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      }
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
    console.log('resetGeneration chamado');
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
