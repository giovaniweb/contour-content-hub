import React, { useState } from 'react';
import { Question } from './types';
import { questions } from './questions';
import AnalysisProgressScreen from './AnalysisProgressScreen';
import MarketingResult from './MarketingResult';
import MarketingDashboard from './MarketingDashboard';
import { MarketingConsultantState } from './types';
import { useEquipments } from '@/hooks/useEquipments';

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
  generatedDiagnostic: ''
};

const AkinatorMarketingConsultant: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<MarketingConsultantState>(initialState);
  const [showResult, setShowResult] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { equipments } = useEquipments();

  const handleAnswer = (answer: string) => {
    setState({ ...state, [currentQuestion.key]: answer });
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const currentQuestion: Question = questions[currentStep];

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

  return (
    <div>
      {currentStep < questions.length ? (
        <AnalysisProgressScreen currentStep={currentStep} totalSteps={questions.length} state={state} />
      ) : (
        <div>
          <h2>Obrigado por responder!</h2>
          <p>Estamos processando suas respostas...</p>
        </div>
      )}
    </div>
  );
};

export default AkinatorMarketingConsultant;
