
import React, { useState } from 'react';
import { Question } from './types';
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

  const handleAnswer = (answer: string) => {
    console.log('Resposta selecionada:', answer, 'Step atual:', currentStep);
    
    if (currentStep >= 0 && currentStep < questions.length) {
      const currentQuestion: Question = questions[currentStep];
      
      // Atualizar o estado com a resposta
      const newState = { ...state, [currentQuestion.id]: answer };
      setState(newState);
      
      console.log('Estado atualizado:', newState);
      
      // Verificar se chegou ao final das perguntas
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
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
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleViewDashboard = (diagnostic: string) => {
    setState(prev => ({ ...prev, generatedDiagnostic: diagnostic }));
    setShowDashboard(true);
  };

  const handleBackFromDashboard = () => {
    setShowDashboard(false);
  };

  const handleCreateScript = () => {
    // Navigate to script generator
    window.location.href = '/script-generator';
  };

  const handleGenerateImage = () => {
    // Navigate to image generator
    window.location.href = '/media-library';
  };

  const handleDownloadPDF = () => {
    // PDF generation functionality
    console.log('Generate PDF');
  };

  const handleAddToPlanner = () => {
    console.log('Adicionar ao planejador');
    // Implementar lógica para adicionar ao planejador
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

  // Mostrar as perguntas do questionário
  if (currentStep < questions.length) {
    const currentQuestion: Question = questions[currentStep];
    
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
