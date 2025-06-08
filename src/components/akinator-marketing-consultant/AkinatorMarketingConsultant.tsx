
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MarketingConsultantState } from './types';
import { MARKETING_STEPS } from './constants';
import { generateMarketingDiagnostic } from './marketingGenerator';
import { useAIDiagnostic } from '@/hooks/useAIDiagnostic';
import MarketingDashboard from './MarketingDashboard';
import MarketingQuestion from './MarketingQuestion';
import MarketingResult from './MarketingResult';
import AnalysisProgressScreen from './AnalysisProgressScreen';

const AkinatorMarketingConsultant: React.FC = () => {
  const { toast } = useToast();
  const { generateDiagnostic, isGenerating } = useAIDiagnostic();
  
  const [state, setState] = useState<MarketingConsultantState>({
    currentStep: 0,
    isComplete: false
  });

  console.log('AkinatorMarketingConsultant - Estado atual:', state);

  const currentStepData = MARKETING_STEPS[state.currentStep];

  const handleOptionSelect = async (value: string) => {
    const newState = { ...state, [currentStepData.id]: value };
    
    console.log('handleOptionSelect - newState:', newState);
    console.log('handleOptionSelect - currentStep:', state.currentStep, 'MARKETING_STEPS.length:', MARKETING_STEPS.length);
    
    if (state.currentStep < MARKETING_STEPS.length - 1) {
      console.log('Avançando para próximo step');
      setState({ ...newState, currentStep: state.currentStep + 1 });
    } else {
      console.log('Gerando diagnóstico - última etapa');
      
      // Gerar diagnóstico usando IA primeiro, depois fallback
      try {
        const aiDiagnostic = await generateDiagnostic(newState);
        
        let finalDiagnostic;
        if (aiDiagnostic) {
          finalDiagnostic = aiDiagnostic;
        } else {
          // Fallback para sistema local se IA falhar
          finalDiagnostic = await generateMarketingDiagnostic(newState, false);
        }
        
        const finalState = {
          ...newState,
          isComplete: true,
          generatedDiagnostic: finalDiagnostic
        };
        
        console.log('Estado final sendo definido:', finalState);
        setState(finalState);
        
        toast({
          title: "🎯 Diagnóstico Concluído!",
          description: "Sua análise estratégica foi gerada com sucesso."
        });
        
      } catch (error) {
        console.error('Erro ao gerar diagnóstico:', error);
        toast({
          variant: "destructive",
          title: "Erro na geração",
          description: "Não foi possível gerar o diagnóstico. Tente novamente."
        });
      }
    }
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

  console.log('Renderizando - isComplete:', state.isComplete, 'isGenerating:', isGenerating);

  // Mostrar tela de análise/progresso quando estiver gerando
  if (isGenerating) {
    return (
      <AnalysisProgressScreen 
        currentStep={state.currentStep} 
        totalSteps={MARKETING_STEPS.length} 
      />
    );
  }

  if (state.isComplete) {
    console.log('Renderizando MarketingResult com state:', state);
    return (
      <MarketingResult
        state={state}
        onReset={resetConsultant}
      />
    );
  }

  return (
    <div>
      <MarketingDashboard currentStep={state.currentStep} totalSteps={MARKETING_STEPS.length} />
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
