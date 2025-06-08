
import React from 'react';
import AnalysisProgressScreen from './AnalysisProgressScreen';
import MarketingResult from './MarketingResult';
import MarketingDashboard from './MarketingDashboard';
import MarketingQuestion from './MarketingQuestion';
import { MARKETING_STEPS } from './constants';
import { useAkinatorFlow } from './hooks/useAkinatorFlow';
import { useAnswerHandler } from './components/AkinatorAnswerHandler';
import { shouldShowQuestion, getPreviousValidQuestion } from './utils/questionNavigation';

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

  const { handleAnswer } = useAnswerHandler({
    currentStep,
    state,
    setState,
    setCurrentStep,
    setIsProcessing,
    setShowResult,
    updateClinicType
  });

  const handleGoBack = () => {
    const previousStep = getPreviousValidQuestion(currentStep, state);
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

  if (currentStep < MARKETING_STEPS.length && shouldShowQuestion(currentStep, state)) {
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
