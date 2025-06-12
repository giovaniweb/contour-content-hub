
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import MarketingQuestion from './MarketingQuestion';
import MarketingResult from './MarketingResult';
import MarketingDashboard from './MarketingDashboard';
import ProcessingState from './components/ProcessingState';
import ProgressIndicators from './components/ProgressIndicators';
import { useAkinatorFlow } from './hooks/useAkinatorFlow';
import { useSessionManagement } from './hooks/useSessionManagement';
import { useQuestionNavigation } from './hooks/useQuestionNavigation';
import { getNextValidQuestion, shouldShowQuestion, getCurrentQuestionNumber, getTotalValidQuestions } from './utils/questionNavigation';
import { MARKETING_STEPS } from './constants';
import { MarketingConsultantState } from './types';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AkinatorMarketingConsultantProps {
  forceNew?: boolean;
}

const AkinatorMarketingConsultant: React.FC<AkinatorMarketingConsultantProps> = ({ forceNew = false }) => {
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
  const [mentor, setMentor] = useState<any>(null);
  const [aiSections, setAiSections] = useState<any>(null);

  // Use session management hook
  const {
    hasLoadedSavedData,
    isSyncing,
    hasCurrentSession: hasSession,
    saveCurrentSession
  } = useSessionManagement({
    forceNew,
    state,
    setState,
    setShowDashboard,
    setCurrentStep
  });

  // Use question navigation hook
  const {
    handleOptionSelect,
    handleGoBack,
    handleContinueWithoutAI,
    processingError
  } = useQuestionNavigation({
    state,
    setState,
    currentStep,
    setCurrentStep,
    setIsProcessing,
    setShowDashboard,
    saveCurrentSession
  });

  // Update user profile when clinic type is selected
  useEffect(() => {
    if (state.clinicType && state.clinicType !== profile?.clinic_type) {
      const clinicType = state.clinicType === 'clinica_medica' ? 'clinica_medica' : 'clinica_estetica';
      updateClinicType(clinicType);
    }
  }, [state.clinicType, profile?.clinic_type, updateClinicType]);

  const handleRestart = async () => {
    console.log('🔄 Reiniciando diagnóstico...');
    
    // Clear saved data
    // await clearCurrentSession();
    
    setState({
      clinicType: '',
      clinicName: '',
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
    
    toast.success("Diagnóstico reiniciado!", {
      description: "Vamos começar um novo diagnóstico."
    });
  };

  const currentQuestion = MARKETING_STEPS[currentStep];
  const totalQuestions = getTotalValidQuestions(state);
  const currentQuestionNumber = getCurrentQuestionNumber(currentStep, state);

  // Debug logs
  console.log('🔍 RENDERIZAÇÃO PRINCIPAL:');
  console.log('🔹 currentStep:', currentStep);
  console.log('🔹 currentQuestion:', currentQuestion);
  console.log('🔹 shouldShow:', currentQuestion ? shouldShowQuestion(currentStep, state) : false);
  console.log('🔹 state:', state);
  console.log('🔹 showDashboard:', showDashboard);
  console.log('🔹 showResult:', showResult);
  console.log('🔹 isProcessing:', isProcessing);

  if (showDashboard) {
    console.log('📊 Renderizando Dashboard');
    
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

  if (isProcessing) {
    console.log('⏳ Renderizando Processing com LoadingMessages');
    return (
      <ProcessingState 
        processingError={processingError}
        onContinueWithoutAI={handleContinueWithoutAI}
      />
    );
  }

  // Check if current question is valid
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
      {/* Progress indicators */}
      <ProgressIndicators 
        forceNew={forceNew}
        hasCurrentSession={hasSession()}
        isSyncing={isSyncing}
      />

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
