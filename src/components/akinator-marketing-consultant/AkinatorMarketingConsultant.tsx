import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Sparkles, Target, Users, TrendingUp, ArrowLeft, ArrowRight, RotateCcw, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import MarketingQuestion from './MarketingQuestion';
import MarketingResult from './MarketingResult';
import MarketingDashboard from './MarketingDashboard';
import LoadingMessages from './dashboard/LoadingMessages';
import { useAkinatorFlow } from './hooks/useAkinatorFlow';
import { useAIDiagnostic } from '@/hooks/useAIDiagnostic';
import { getNextValidQuestion, getPreviousValidQuestion, shouldShowQuestion, getCurrentQuestionNumber, getTotalValidQuestions } from './utils/questionNavigation';
import { MARKETING_STEPS } from './constants';
import { MarketingConsultantState } from './types';
import { useUserProfile } from '@/hooks/useUserProfile';

const AkinatorMarketingConsultant: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    state,
    setState,
    showResult,
    setShowResult,
    showDashboard,
    setShowDashboard,
    isProcessing,
    setIsProcessing,
    equipments,
    updateClinicType
  } = useAkinatorFlow();

  const { profile } = useUserProfile();
  const { generateDiagnostic, isGenerating } = useAIDiagnostic();
  const [mentor, setMentor] = useState<any>(null);
  const [aiSections, setAiSections] = useState<any>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Atualizar o perfil do usuário quando o tipo de clínica for selecionado
  useEffect(() => {
    if (state.clinicType && state.clinicType !== profile?.clinic_type) {
      const clinicType = state.clinicType === 'clinica_medica' ? 'clinica_medica' : 'clinica_estetica';
      updateClinicType(clinicType);
    }
  }, [state.clinicType, profile?.clinic_type, updateClinicType]);

  const handleOptionSelect = async (value: string) => {
    const currentQuestion = MARKETING_STEPS[currentStep];
    
    console.log('🟢 INÍCIO handleOptionSelect');
    console.log('🔵 Resposta selecionada:', value);
    console.log('🔵 Step atual:', currentStep);
    console.log('🔵 Pergunta atual:', currentQuestion);
    console.log('🔵 Estado atual antes da atualização:', state);
    
    // Atualizar o estado com a resposta usando o ID da pergunta
    const newState = {
      ...state,
      [currentQuestion.id]: value
    };
    
    setState(newState);
    console.log('🟡 Estado atualizado:', newState);
    
    // Encontrar a próxima pergunta válida
    const nextStep = getNextValidQuestion(currentStep, newState);
    console.log('🟡 Próximo step calculado:', nextStep);
    console.log('🟡 Total steps disponíveis:', MARKETING_STEPS.length);
    
    if (nextStep >= MARKETING_STEPS.length) {
      // Chegou ao fim do questionário
      console.log('🔴 FIM DO QUESTIONÁRIO DETECTADO - iniciando processamento');
      setIsProcessing(true);
      setProcessingError(null);
      
      try {
        // Gerar diagnóstico usando IA via hook
        console.log('🟣 Chamando generateDiagnostic via hook com estado:', newState);
        
        const diagnostic = await generateDiagnostic(newState);
        console.log('🟣 Diagnóstico recebido:', diagnostic);
        
        if (diagnostic) {
          const finalState = {
            ...newState,
            generatedDiagnostic: diagnostic
          };
          
          setState(finalState);
          console.log('🟢 Processamento concluído - indo para dashboard');
          setShowDashboard(true);
        } else {
          throw new Error('Diagnóstico não foi gerado');
        }
        
      } catch (error) {
        console.error('🔴 ERRO no processamento:', error);
        setProcessingError('Erro ao processar diagnóstico com IA');
        
        // Permitir continuar mesmo com erro na API
        const finalState = {
          ...newState,
          generatedDiagnostic: 'Diagnóstico temporariamente indisponível. Suas respostas foram salvas e você pode visualizar as recomendações básicas.'
        };
        
        setState(finalState);
        
        // Continuar para o dashboard mesmo com erro
        console.log('🟡 Continuando para dashboard mesmo com erro da IA');
        setTimeout(() => {
          setShowDashboard(true);
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.log('🟢 Navegando para próxima pergunta:', nextStep, MARKETING_STEPS[nextStep]);
      setCurrentStep(nextStep);
      
      toast.success("Resposta salva!", {
        description: "Continuando para a próxima pergunta..."
      });
    }
    
    console.log('🟢 FIM handleOptionSelect');
  };

  const handleGoBack = () => {
    const previousStep = getPreviousValidQuestion(currentStep, state);
    console.log('⬅️ Voltando para step:', previousStep);
    setCurrentStep(previousStep);
    
    toast.info("Voltando à pergunta anterior", {
      description: "Você pode revisar sua resposta."
    });
  };

  const handleRestart = () => {
    console.log('🔄 Reiniciando diagnóstico...');
    setState({
      clinicType: '',
      medicalSpecialty: '',
      medicalProcedures: '',
      medicalEquipments: '',
      medicalBestSeller: '',
      medicalTicket: '',
      medicalSalesModel: '',
      medicalObjective: '',
      medicalContentFrequency: '',
      medicalClinicStyle: '',
      aestheticFocus: '',
      aestheticEquipments: '',
      aestheticBestSeller: '',
      aestheticSalesModel: '',
      aestheticTicket: '',
      aestheticObjective: '',
      aestheticContentFrequency: '',
      aestheticClinicStyle: '',
      currentRevenue: '',
      revenueGoal: '',
      targetAudience: '',
      contentFrequency: '',
      communicationStyle: '',
      mainChallenges: '',
      generatedDiagnostic: ''
    });
    setCurrentStep(0);
    setShowResult(false);
    setShowDashboard(false);
    setMentor(null);
    setAiSections(null);
    setProcessingError(null);
    
    toast.success("Diagnóstico reiniciado!", {
      description: "Vamos começar um novo diagnóstico."
    });
  };

  const handleContinueWithoutAI = () => {
    const finalState = {
      ...state,
      generatedDiagnostic: 'Modo básico: Suas respostas foram processadas localmente.'
    };
    
    setState(finalState);
    setShowDashboard(true);
    setIsProcessing(false);
    
    toast.success("Continuando com diagnóstico básico", {
      description: "Você pode ver suas respostas e recomendações gerais."
    });
  };

  const currentQuestion = MARKETING_STEPS[currentStep];
  const totalQuestions = getTotalValidQuestions(state);
  const currentQuestionNumber = getCurrentQuestionNumber(currentStep, state);
  const progress = (currentQuestionNumber / totalQuestions) * 100;

  // Debug logs detalhados
  console.log('🔍 RENDERIZAÇÃO PRINCIPAL:');
  console.log('🔹 currentStep:', currentStep);
  console.log('🔹 currentQuestion:', currentQuestion);
  console.log('🔹 shouldShow:', currentQuestion ? shouldShowQuestion(currentStep, state) : false);
  console.log('🔹 state:', state);
  console.log('🔹 showDashboard:', showDashboard);
  console.log('🔹 showResult:', showResult);
  console.log('🔹 isProcessing:', isProcessing);
  console.log('🔹 isGenerating:', isGenerating);

  if (showDashboard) {
    console.log('📊 Renderizando Dashboard');
    
    // Validação de segurança antes de renderizar o dashboard
    const safeState = {
      ...state,
      generatedDiagnostic: state.generatedDiagnostic || 'Diagnóstico em processamento...'
    };
    
    const safeMentor = mentor || null;
    const safeAiSections = aiSections || null;
    
    console.log('📊 Dashboard - dados seguros:', { safeState, safeMentor, safeAiSections });
    
    return (
      <MarketingDashboard 
        state={safeState}
        mentor={safeMentor}
        aiSections={safeAiSections}
        onRestart={handleRestart}
        onStateUpdate={setState}
      />
    );
  }

  if (showResult) {
    console.log('📋 Renderizando Result');
    return (
      <MarketingResult 
        onRestart={handleRestart}
        onContinue={() => setShowDashboard(true)}
      />
    );
  }

  if (isProcessing || isGenerating) {
    console.log('⏳ Renderizando Processing com LoadingMessages');
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <LoadingMessages isLoading={true} />
        
        {processingError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 max-w-md mx-auto mt-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-medium text-yellow-600">IA Temporariamente Indisponível</h3>
            </div>
            <p className="text-sm text-yellow-700 mb-4">
              Não foi possível processar seu diagnóstico com IA, mas você pode continuar e ver as recomendações básicas baseadas em suas respostas.
            </p>
            <Button 
              onClick={handleContinueWithoutAI}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Continuar com Diagnóstico Básico
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  // Verificar se a pergunta atual é válida
  if (!currentQuestion) {
    console.error('❌ Pergunta não encontrada para step:', currentStep);
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-400">Erro: Pergunta não encontrada</p>
        <Button onClick={handleRestart} className="mt-4">
          Reiniciar Diagnóstico
        </Button>
      </div>
    );
  }

  if (!shouldShowQuestion(currentStep, state)) {
    console.log('⏭️ Pergunta não deve ser mostrada, buscando próxima...');
    // Se a pergunta atual não deve ser mostrada, navegar automaticamente
    const nextValidStep = getNextValidQuestion(currentStep, state);
    console.log('⏭️ Próximo step válido encontrado:', nextValidStep);
    
    if (nextValidStep < MARKETING_STEPS.length && nextValidStep !== currentStep) {
      console.log('⏭️ Navegando automaticamente para:', nextValidStep);
      setTimeout(() => setCurrentStep(nextValidStep), 100);
    } else {
      console.log('🏁 Chegamos ao fim automaticamente');
    }
    
    return (
      <div className="text-center py-12">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando próxima pergunta...</span>
        </div>
      </div>
    );
  }

  console.log('✅ Renderizando pergunta normalmente');

  return (
    <div className="container mx-auto max-w-6xl py-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <MarketingQuestion
            stepData={currentQuestion}
            currentStep={currentStep}
            onOptionSelect={handleOptionSelect}
            onGoBack={handleGoBack}
            canGoBack={currentStep > 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AkinatorMarketingConsultant;
