
import React, { useState } from 'react';
import { MARKETING_STEPS } from './constants';
import AnalysisProgressScreen from './AnalysisProgressScreen';
import MarketingResult from './MarketingResult';
import MarketingDashboard from './MarketingDashboard';
import MarketingQuestion from './MarketingQuestion';
import { MarketingConsultantState } from './types';
import { useEquipments } from '@/hooks/useEquipments';
import { useUserProfile } from '@/hooks/useUserProfile';

const initialState: MarketingConsultantState = {
  clinicType: '',
  medicalSpecialty: '',
  medicalProcedures: '',
  medicalEquipments: '',
  medicalProblems: '',
  medicalMostSought: '',
  medicalTicket: '',
  medicalSalesModel: '',
  medicalObjective: '',
  medicalVideoFrequency: '',
  medicalClinicStyle: '',
  aestheticFocus: '',
  aestheticEquipments: '',
  aestheticProblems: '',
  aestheticBestSeller: '',
  aestheticSalesModel: '',
  aestheticTicket: '',
  aestheticObjective: '',
  aestheticVideoFrequency: '',
  aestheticClinicStyle: '',
  currentRevenue: '',
  revenueGoal: '',
  targetAudience: '',
  contentFrequency: '',
  communicationStyle: '',
  generatedDiagnostic: ''
};

const AkinatorMarketingConsultant: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<MarketingConsultantState>(initialState);
  const [showResult, setShowResult] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { equipments } = useEquipments();
  const { updateClinicType } = useUserProfile();

  // Função para determinar se uma pergunta deve ser exibida baseada no estado atual
  const shouldShowQuestion = (questionIndex: number): boolean => {
    const question = MARKETING_STEPS[questionIndex];
    
    if (!question.condition) {
      return true; // Sem condição, sempre exibir
    }

    // Verificar se a condição está atendida
    if (question.condition === 'clinica_medica') {
      return state.clinicType === 'clinica_medica';
    }
    
    if (question.condition === 'clinica_estetica') {
      return state.clinicType === 'clinica_estetica';
    }

    return true;
  };

  // Função para encontrar a próxima pergunta válida
  const getNextValidQuestion = (currentIndex: number): number => {
    for (let i = currentIndex + 1; i < MARKETING_STEPS.length; i++) {
      if (shouldShowQuestion(i)) {
        return i;
      }
    }
    return MARKETING_STEPS.length;
  };

  // Função para encontrar a pergunta anterior válida
  const getPreviousValidQuestion = (currentIndex: number): number => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (shouldShowQuestion(i)) {
        return i;
      }
    }
    return 0;
  };

  const handleAnswer = (answer: string) => {
    console.log('Resposta selecionada:', answer, 'Step atual:', currentStep);
    
    if (currentStep >= 0 && currentStep < MARKETING_STEPS.length) {
      const currentQuestion = MARKETING_STEPS[currentStep];
      
      const newState = { ...state, [currentQuestion.id]: answer };
      setState(newState);
      
      // Se for a primeira pergunta (tipo de clínica), salvar no perfil do usuário
      if (currentQuestion.id === 'clinicType') {
        updateClinicType(answer as 'clinica_medica' | 'clinica_estetica');
      }
      
      console.log('Estado atualizado:', newState);
      
      const nextStep = getNextValidQuestion(currentStep);
      
      if (nextStep < MARKETING_STEPS.length) {
        console.log('Próxima pergunta:', nextStep, MARKETING_STEPS[nextStep]);
        setCurrentStep(nextStep);
      } else {
        console.log('Última pergunta respondida, iniciando processamento...');
        setIsProcessing(true);
        
        setTimeout(() => {
          setIsProcessing(false);
          setShowResult(true);
        }, 3000);
      }
    }
  };

  const handleGoBack = () => {
    const previousStep = getPreviousValidQuestion(currentStep);
    setCurrentStep(previousStep);
  };

  const handleViewDashboard = (diagnostic: string) => {
    setState(prev => ({ ...prev, generatedDiagnostic: diagnostic }));
    setShowDashboard(true);
  };

  const handleBackFromDashboard = () => {
    setShowDashboard(false);
  };

  const handleCreateScript = () => {
    window.location.href = '/script-generator';
  };

  const handleGenerateImage = () => {
    window.location.href = '/media-library';
  };

  const handleDownloadPDF = () => {
    console.log('Generate PDF');
  };

  if (showDashboard) {
    return (
      <MarketingDashboard
        state={state}
        onBack={handleBackFromDashboard}
        onCreateScript={handleCreateScript}
        onGenerateImage={handleGenerateImage}
        onDownloadPDF={handleDownloadPDF}
        onViewHistory={() => {}}
      />
    );
  }

  if (showResult) {
    return (
      <MarketingResult 
        consultantData={state} 
        equipments={equipments}
        onViewDashboard={handleViewDashboard}
      />
    );
  }

  if (isProcessing) {
    return (
      <AnalysisProgressScreen 
        currentStep={currentStep} 
        totalSteps={MARKETING_STEPS.length} 
        state={state} 
      />
    );
  }

  if (currentStep < MARKETING_STEPS.length && shouldShowQuestion(currentStep)) {
    const currentQuestion = MARKETING_STEPS[currentStep];
    
    return (
      <MarketingQuestion
        stepData={currentQuestion}
        currentStep={currentStep}
        onOptionSelect={handleAnswer}
        onGoBack={handleGoBack}
        canGoBack={currentStep > 0}
      />
    );
  }

  return (
    <div className="text-center">
      <h2>Carregando...</h2>
    </div>
  );
};

export default AkinatorMarketingConsultant;
