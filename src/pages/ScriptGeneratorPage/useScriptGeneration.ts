
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScriptIntention } from '@/components/smart-script-generator/intentionTree';
import { MentorInferenceEngine } from '@/components/smart-script-generator/mentorInference';
import { DynamicPromptGenerator } from '@/components/smart-script-generator/dynamicPrompts';
import { generateScript, ScriptResponse } from '@/services/supabaseService';

export interface SmartGenerationResult {
  content: string;
  mentor: string;
  enigma: string;
  intention: ScriptIntention;
}

export const useScriptGeneration = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('root');
  const [intention, setIntention] = useState<Partial<ScriptIntention>>({});
  const [generatedResult, setGeneratedResult] = useState<SmartGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDisneyMode, setIsDisneyMode] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const handleThemeInput = async (tema: string) => {
    console.log('🚀 handleThemeInput iniciado com tema:', tema);
    console.log('📋 Intenção atual:', intention);
    
    // IMPORTANTE: Definir loading IMEDIATAMENTE
    setIsGenerating(true);
    
    try {
      // Finalizar intenção completa
      const completeIntention: ScriptIntention = {
        ...intention,
        tema
      } as ScriptIntention;

      console.log('✅ Intenção finalizada:', completeIntention);

      // Inferir mentor
      const mentorInference = MentorInferenceEngine.inferMentor(completeIntention);
      
      const finalIntention: ScriptIntention = {
        ...completeIntention,
        mentor_inferido: mentorInference.mentor,
        enigma_mentor: mentorInference.enigma
      };

      console.log('🧠 Mentor inferido:', finalIntention);

      // Gerar prompts
      const { systemPrompt, userPrompt } = DynamicPromptGenerator.generateMentorPrompt(finalIntention);
      
      console.log('📝 Prompts gerados, chamando OpenAI...');

      // Chamar API OpenAI
      const response = await generateScript({
        type: 'custom',
        systemPrompt,
        userPrompt,
        topic: finalIntention.tema,
        additionalInfo: `Tipo: ${finalIntention.tipo_conteudo}, Objetivo: ${finalIntention.objetivo}`,
        tone: finalIntention.estilo_comunicacao,
        marketingObjective: finalIntention.objetivo as any
      }) as ScriptResponse;

      console.log('✨ Resposta OpenAI recebida:', response);

      const mentorProfile = MentorInferenceEngine.getMentorProfile(finalIntention.mentor_inferido);
      
      const result: SmartGenerationResult = {
        content: response.content,
        mentor: mentorProfile.name,
        enigma: finalIntention.enigma_mentor,
        intention: finalIntention
      };
      
      setGeneratedResult(result);
      
      toast({
        title: "✨ Roteiro gerado com sucesso!",
        description: `Criado no estilo ${mentorProfile.name}.`,
      });

    } catch (error) {
      console.error('❌ Erro na geração:', error);
      
      toast({
        title: "❌ Erro na geração",
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
      }) as ScriptResponse;

      setGeneratedResult({
        ...generatedResult,
        content: response.content
      });
      
      setIsDisneyMode(true);
      
      toast({
        title: "✨ Magia Disney 1928 Aplicada!",
        description: "Walt Disney transformou seu roteiro.",
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
    console.log('🔄 Reset geração');
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
    handleThemeInput,
    applyDisneyMagic,
    approveScript,
    resetGeneration,
    setCurrentStep,
    setIntention
  };
};
