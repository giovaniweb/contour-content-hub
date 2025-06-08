
import React, { useState } from 'react';
import { questions } from './questions';
import AnalysisProgressScreen from './AnalysisProgressScreen';
import MarketingResult from './MarketingResult';
import MarketingDashboard from './MarketingDashboard';
import { MarketingConsultantState } from './types';
import { useEquipments } from '@/hooks/useEquipments';
import AkinatorQuestion from './AkinatorQuestion';

const initialState: MarketingConsultantState = {
  clinicType: '',
  medicalSpecialty: '',
  aestheticFocus: '',
  medicalObjective: '',
  aestheticObjective: '',
  currentRevenue: '',
  revenueGoal: '',
  targetAudience: '',
  personalBrand: '',
  mainService: '',
  medicalEquipments: '',
  aestheticEquipments: '',
  generatedDiagnostic: '',
  medicalProcedures: '',
  medicalTicket: '',
  medicalModel: '',
  contentFrequency: '',
  paidTraffic: '',
  clinicPosition: '',
  aestheticBestSeller: '',
  aestheticSalesModel: ''
};

const AkinatorMarketingConsultant: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<MarketingConsultantState>(initialState);
  const [showResult, setShowResult] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { equipments } = useEquipments();

  // Função para determinar se uma pergunta deve ser exibida baseada no estado atual
  const shouldShowQuestion = (questionIndex: number): boolean => {
    const question = questions[questionIndex];
    
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
    for (let i = currentIndex + 1; i < questions.length; i++) {
      if (shouldShowQuestion(i)) {
        return i;
      }
    }
    return questions.length; // Fim das perguntas
  };

  // Função para encontrar a pergunta anterior válida
  const getPreviousValidQuestion = (currentIndex: number): number => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (shouldShowQuestion(i)) {
        return i;
      }
    }
    return 0; // Primeira pergunta
  };

  const handleAnswer = (answer: string) => {
    console.log('Resposta selecionada:', answer, 'Step atual:', currentStep);
    
    if (currentStep >= 0 && currentStep < questions.length) {
      const currentQuestion = questions[currentStep];
      
      // Atualizar o estado com a resposta
      const newState = { ...state, [currentQuestion.id]: answer };
      setState(newState);
      
      console.log('Estado atualizado:', newState);
      
      // Encontrar próxima pergunta válida
      const nextStep = getNextValidQuestion(currentStep);
      
      if (nextStep < questions.length) {
        setCurrentStep(nextStep);
      } else {
        console.log('Última pergunta respondida, iniciando processamento...');
        setIsProcessing(true);
        
        // Simular processamento e depois mostrar resultado
        setTimeout(() => {
          setIsProcessing(false);
          setShowResult(true);
        }, 2000);
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

  const handleAddToPlanner = () => {
    console.log('Adicionar ao planejador');
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
        totalSteps={questions.length} 
        state={state} 
      />
    );
  }

  // Mostrar apenas perguntas válidas baseadas no estado atual
  if (currentStep < questions.length && shouldShowQuestion(currentStep)) {
    const currentQuestion = questions[currentStep];
    
    return (
      <AkinatorQuestion
        question={currentQuestion}
        currentStep={currentStep}
        totalSteps={questions.length}
        onAnswer={handleAnswer}
        onGoBack={handleGoBack}
        canGoBack={currentStep > 0}
      />
    );
  }

  // Fallback (não deveria chegar aqui)
  return (
    <div className="text-center">
      <h2>Carregando...</h2>
    </div>
  );
};

export default AkinatorMarketingConsultant;
