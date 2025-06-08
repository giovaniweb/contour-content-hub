
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MarketingConsultantState } from './types';
import { MARKETING_STEPS } from './constants';
import { generateMarketingDiagnostic } from './marketingGenerator';
import { useAIDiagnostic } from '@/hooks/useAIDiagnostic';
import AkinatorProgress from '../akinator-script-generator/AkinatorProgress';
import MarketingQuestion from './MarketingQuestion';
import MarketingResult from './MarketingResult';
import AnalysisProgressScreen from './AnalysisProgressScreen';
import MarketingDashboard from './MarketingDashboard';

const AkinatorMarketingConsultant: React.FC = () => {
  const { toast } = useToast();
  const { generateDiagnostic, isGenerating } = useAIDiagnostic();
  const [showDashboard, setShowDashboard] = useState(false);
  
  const [state, setState] = useState<MarketingConsultantState>({
    currentStep: 0,
    isComplete: false
  });

  console.log('AkinatorMarketingConsultant - Estado atual:', state);
  console.log('showDashboard:', showDashboard);

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
      
      try {
        // Gerar diagnóstico usando IA primeiro, depois fallback
        console.log('🔄 Tentando IA primeiro...');
        const aiDiagnostic = await generateDiagnostic(newState);
        
        let finalDiagnostic;
        if (aiDiagnostic) {
          console.log('✅ IA funcionou! Usando diagnóstico da OpenAI');
          finalDiagnostic = aiDiagnostic;
        } else {
          console.log('⚠️ IA falhou, usando fallback estático');
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
        console.error('💥 Erro CRÍTICO ao gerar diagnóstico:', error);
        
        // Em caso de erro crítico, usar o fallback
        console.log('🆘 Usando fallback de emergência...');
        try {
          const emergencyDiagnostic = await generateMarketingDiagnostic(newState, false);
          
          const finalState = {
            ...newState,
            isComplete: true,
            generatedDiagnostic: emergencyDiagnostic
          };
          
          setState(finalState);
          
          toast({
            title: "⚠️ Diagnóstico gerado (modo offline)",
            description: "IA indisponível, mas seu diagnóstico foi criado com sucesso."
          });
        } catch (emergencyError) {
          console.error('💥 Erro no fallback de emergência:', emergencyError);
          toast({
            variant: "destructive",
            title: "Erro na geração",
            description: "Não foi possível gerar o diagnóstico. Tente novamente."
          });
        }
      }
    }
  };

  const resetConsultant = () => {
    console.log('resetConsultant chamado');
    setState({
      currentStep: 0,
      isComplete: false
    });
    setShowDashboard(false);
  };

  const handleGoBack = () => {
    setState({ ...state, currentStep: state.currentStep - 1 });
  };

  const handleGenerateStrategy = () => {
    console.log('🚀 Navegando para dashboard estratégico');
    setShowDashboard(true);
  };

  const handleGeneratePlan = () => {
    console.log('🚀 Navegando para dashboard de plano');
    setShowDashboard(true);
  };

  const handleBackFromDashboard = () => {
    console.log('🔙 Voltando do dashboard');
    setShowDashboard(false);
  };

  const handleCreateScript = () => {
    toast({
      title: "🎬 Criando Roteiro...",
      description: "Redirecionando para o gerador de roteiros!"
    });
  };

  const handleGenerateImage = () => {
    toast({
      title: "🎨 Gerando Imagem...",
      description: "Funcionalidade de geração de imagens em desenvolvimento!"
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "📄 Gerando PDF...",
      description: "Criando seu relatório em PDF!"
    });
  };

  const handleViewHistory = () => {
    toast({
      title: "📊 Abrindo histórico...",
      description: "Carregando seus diagnósticos anteriores!"
    });
  };

  console.log('Renderizando - isComplete:', state.isComplete, 'isGenerating:', isGenerating, 'showDashboard:', showDashboard);

  // Mostrar dashboard se solicitado
  if (showDashboard && state.isComplete) {
    console.log('📊 Renderizando MarketingDashboard');
    return (
      <MarketingDashboard
        state={state}
        onBack={handleBackFromDashboard}
        onCreateScript={handleCreateScript}
        onGenerateImage={handleGenerateImage}
        onDownloadPDF={handleDownloadPDF}
        onViewHistory={handleViewHistory}
      />
    );
  }

  // Mostrar tela de análise/progresso quando estiver gerando
  if (isGenerating) {
    return (
      <AnalysisProgressScreen 
        currentStep={state.currentStep} 
        totalSteps={MARKETING_STEPS.length}
        state={state}
      />
    );
  }

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
      <AkinatorProgress currentStep={state.currentStep} totalSteps={MARKETING_STEPS.length} />
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
