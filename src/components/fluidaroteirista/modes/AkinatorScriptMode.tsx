
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import EnhancedAkinatorQuestion from '../components/EnhancedAkinatorQuestion';
import FluidaLoadingScreen from '../components/FluidaLoadingScreen';
import { useEquipments } from '@/hooks/useEquipments';
import { AKINATOR_TREE } from '../constants/intentionTree';

interface AkinatorScriptModeProps {
  onScriptGenerated: (script: any) => void;
  onGoBack: () => void;
  generateScript: (data: any) => Promise<any>;
  isGenerating: boolean;
}

const AkinatorScriptMode: React.FC<AkinatorScriptModeProps> = ({
  onScriptGenerated,
  onGoBack,
  generateScript,
  isGenerating
}) => {
  const [currentStep, setCurrentStep] = useState('tipo_conteudo');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [history, setHistory] = useState<string[]>(['tipo_conteudo']);
  const { equipments, loading: equipmentsLoading } = useEquipments();

  console.log('🎬 [AkinatorScriptMode] Current step:', currentStep, 'Answers:', answers);
  console.log('🔧 [AkinatorScriptMode] Equipments loaded:', equipments.length, 'Loading:', equipmentsLoading);

  const getCurrentQuestion = () => {
    const question = AKINATOR_TREE[currentStep];
    
    // Se for a etapa de equipamento, injetar os equipamentos do banco
    if (currentStep === 'equipamento' && equipments.length > 0) {
      return {
        ...question,
        options: equipments.map(eq => ({
          value: eq.nome,
          label: eq.nome,
          emoji: '🔧',
          description: eq.categoria || 'Equipamento para tratamentos'
        }))
      };
    }
    
    return question;
  };

  const handleOptionSelect = async (value: string | string[]) => {
    console.log('📝 [AkinatorScriptMode] Option selected:', value, 'for step:', currentStep);
    
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);

    const currentQuestion = getCurrentQuestion();
    
    // Se chegamos ao final do tema, gerar o roteiro
    if (currentStep === 'tema') {
      console.log('🎯 [AkinatorScriptMode] Final step reached, generating script...');
      
      try {
        const scriptData = {
          tipo_conteudo: newAnswers.tipo_conteudo as string || 'carrossel',
          objetivo: newAnswers.objetivo as string || 'atrair',
          canal: newAnswers.canal as string || 'instagram',
          estilo: newAnswers.estilo as string || 'criativo',
          equipamento: Array.isArray(newAnswers.equipamento) 
            ? (newAnswers.equipamento as string[]).join(', ')
            : newAnswers.equipamento as string || '',
          tema: value as string
        };

        console.log('🚀 [AkinatorScriptMode] Calling generateScript with:', scriptData);
        
        const result = await generateScript(scriptData);
        console.log('✅ [AkinatorScriptMode] Script generated:', result);
        
        if (result) {
          onScriptGenerated(result);
        }
      } catch (error) {
        console.error('❌ [AkinatorScriptMode] Error generating script:', error);
      }
      return;
    }

    // Determinar próximo passo
    let nextStep = currentQuestion?.next;
    
    if (typeof nextStep === 'object') {
      // Navegação condicional
      nextStep = nextStep[value as string] || Object.values(nextStep)[0];
    }

    if (nextStep && AKINATOR_TREE[nextStep]) {
      console.log('➡️ [AkinatorScriptMode] Moving to next step:', nextStep);
      setCurrentStep(nextStep);
      setHistory(prev => [...prev, nextStep]);
    } else {
      console.error('❌ [AkinatorScriptMode] Invalid next step:', nextStep);
    }
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current step
      const previousStep = newHistory[newHistory.length - 1];
      
      console.log('⬅️ [AkinatorScriptMode] Going back to:', previousStep);
      
      setCurrentStep(previousStep);
      setHistory(newHistory);
      
      // Remove the answer for the current step
      const newAnswers = { ...answers };
      delete newAnswers[currentStep];
      setAnswers(newAnswers);
    } else {
      onGoBack();
    }
  };

  // Mostrar loading se estiver gerando
  if (isGenerating) {
    return <FluidaLoadingScreen mentor="akinator" />;
  }

  // Mostrar loading se estiver carregando equipamentos na etapa de equipamento
  if (currentStep === 'equipamento' && equipmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-12 w-12 text-aurora-electric-purple mx-auto" />
          </motion.div>
          <p className="text-white">Carregando equipamentos...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  
  if (!currentQuestion) {
    console.error('❌ [AkinatorScriptMode] No question found for step:', currentStep);
    return (
      <div className="text-center space-y-4">
        <p className="text-red-400">Erro: Pergunta não encontrada para o passo atual</p>
        <Button onClick={onGoBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <EnhancedAkinatorQuestion
        question={currentQuestion.pergunta}
        titulo={currentQuestion.titulo}
        subtitulo={currentQuestion.subtitulo}
        descricao={currentQuestion.descricao}
        options={currentQuestion.options}
        stepId={currentStep}
        onOptionSelect={handleOptionSelect}
        onGoBack={handleGoBack}
        canGoBack={history.length > 1}
        mentorStyle="conversacional"
        currentStep={history.length - 1}
        totalSteps={Object.keys(AKINATOR_TREE).length}
        isTextInput={currentStep === 'tema'}
        mentorPhrase={currentQuestion.mentorPhrase}
      />
    </div>
  );
};

export default AkinatorScriptMode;
