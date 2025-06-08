
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MarketingConsultantState } from './types';
import { MARKETING_STEPS } from './constants';
import { generateMarketingDiagnostic } from './marketingGenerator';
import AkinatorProgress from '../akinator-script-generator/AkinatorProgress';
import MarketingQuestion from './MarketingQuestion';
import MarketingResult from './MarketingResult';

const AkinatorMarketingConsultant: React.FC = () => {
  const { toast } = useToast();
  const [state, setState] = useState<MarketingConsultantState>({
    currentStep: 0,
    isComplete: false
  });

  console.log('AkinatorMarketingConsultant - Estado atual:', state);

  const currentStepData = MARKETING_STEPS[state.currentStep];

  const handleOptionSelect = (value: string) => {
    const newState = { ...state, [currentStepData.id]: value };
    
    console.log('handleOptionSelect - newState:', newState);
    console.log('handleOptionSelect - currentStep:', state.currentStep, 'MARKETING_STEPS.length:', MARKETING_STEPS.length);
    
    if (state.currentStep < MARKETING_STEPS.length - 1) {
      console.log('Avançando para próximo step');
      setState({ ...newState, currentStep: state.currentStep + 1 });
    } else {
      console.log('Gerando diagnóstico - última etapa');
      // Gerar diagnóstico
      const diagnostic = generateMarketingDiagnostic(newState);
      
      const finalState = {
        ...newState,
        isComplete: true,
        generatedDiagnostic: diagnostic
      };
      
      console.log('Estado final sendo definido:', finalState);
      setState(finalState);
    }
  };

  const handleGenerateStrategy = () => {
    toast({
      title: "📋 Gerando estratégia completa...",
      description: "Sua estratégia de marketing personalizada está sendo criada!"
    });
  };

  const handleGeneratePlan = () => {
    toast({
      title: "📅 Criando plano de ação...",
      description: "Seu cronograma de implementação está sendo gerado!"
    });
  };

  const resetConsultant = () => {
    console.log('resetConsultant chamado');
    setState({
      currentStep: 0,
      isComplete: false
    });
  };

  const handleGoBack = () => {
    setState({ ...state, currentStep: state.currentStep - 1 });
  };

  console.log('Renderizando - isComplete:', state.isComplete);

  if (state.isComplete) {
    console.log('Renderizando MarketingResult com state:', state);
    return (
      <MarketingResult
        state={state}
        onGenerateStrategy={handleGenerateStrategy}
        onGeneratePlan={handleGeneratePlan}
        onReset={resetConsultant}
      />
    );
  }

  return (
    <div>
      <AkinatorProgress currentStep={state.currentStep} />
      <MarketingQuestion
        stepData={currentStepData}
        currentStep={state.currentStep}
        onOptionSelect={handleOptionSelect}
        onGoBack={handleGoBack}
        canGoBack={state.currentStep > 0}
      />
    </div>
  );
};

export default AkinatorMarketingConsultant;
