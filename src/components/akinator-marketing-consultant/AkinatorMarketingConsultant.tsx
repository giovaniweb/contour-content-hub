
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MarketingConsultantState } from './types';
import { MARKETING_STEPS } from './constants';
import { generateMarketingDiagnostic } from './marketingGenerator';
import AkinatorProgress from '../akinator-script-generator/AkinatorProgress';
import MarketingQuestion from './MarketingQuestion';
import MarketingResult from './MarketingResult';
import MarketingDashboard from './MarketingDashboard';

type ViewMode = 'questions' | 'result' | 'dashboard';

const AkinatorMarketingConsultant: React.FC = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('questions');
  const [state, setState] = useState<MarketingConsultantState>({
    currentStep: 0,
    isComplete: false
  });

  console.log('AkinatorMarketingConsultant - Estado atual:', state);

  // Filtrar perguntas baseado no tipo de clínica
  const getFilteredSteps = () => {
    return MARKETING_STEPS.filter(step => {
      if (!step.condition) return true;
      
      // Mostrar perguntas específicas baseadas no tipo de clínica
      if (step.condition === 'clinica_medica') {
        return state.clinicType === 'clinica_medica';
      }
      if (step.condition === 'clinica_estetica') {
        return state.clinicType === 'clinica_estetica';
      }
      
      return true;
    });
  };

  const filteredSteps = getFilteredSteps();
  const currentStepData = filteredSteps[state.currentStep];

  const handleOptionSelect = (value: string) => {
    const newState = { ...state, [currentStepData.id]: value };
    
    console.log('handleOptionSelect - newState:', newState);
    console.log('handleOptionSelect - currentStep:', state.currentStep, 'filteredSteps.length:', filteredSteps.length);
    
    if (state.currentStep < filteredSteps.length - 1) {
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
      
      // Navegar diretamente para o dashboard após completar o diagnóstico
      setTimeout(() => {
        setViewMode('dashboard');
        toast({
          title: "🎯 Dashboard estratégico gerado!",
          description: "Sua análise completa está pronta com ideias personalizadas."
        });
      }, 1000);
    }
  };

  const handleGenerateStrategy = () => {
    toast({
      title: "📋 Gerando estratégia completa...",
      description: "Sua estratégia de marketing personalizada está sendo criada!"
    });
    setViewMode('dashboard');
  };

  const handleGeneratePlan = () => {
    toast({
      title: "📅 Criando plano de ação...",
      description: "Seu cronograma de implementação está sendo gerado!"
    });
    setViewMode('dashboard');
  };

  const resetConsultant = () => {
    console.log('resetConsultant chamado');
    setState({
      currentStep: 0,
      isComplete: false
    });
    setViewMode('questions');
  };

  const handleGoBack = () => {
    setState({ ...state, currentStep: state.currentStep - 1 });
  };

  const handleBackToResult = () => {
    setViewMode('result');
  };

  const handleCreateScript = () => {
    toast({
      title: "📝 Redirecionando para gerador de roteiros...",
      description: "Vamos criar conteúdo baseado no seu diagnóstico!"
    });
  };

  const handleGenerateImage = () => {
    toast({
      title: "🎨 Gerando descrição de imagem...",
      description: "Criando ideias visuais baseadas na sua estratégia!"
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "📄 Preparando PDF da estratégia...",
      description: "Seu relatório completo está sendo gerado!"
    });
  };

  const handleViewHistory = () => {
    toast({
      title: "📊 Abrindo histórico de relatórios...",
      description: "Carregando seus diagnósticos anteriores!"
    });
    window.open('/reports', '_blank');
  };

  console.log('Renderizando - viewMode:', viewMode, 'isComplete:', state.isComplete);

  if (viewMode === 'dashboard') {
    return (
      <MarketingDashboard
        state={state}
        onBack={handleBackToResult}
        onCreateScript={handleCreateScript}
        onGenerateImage={handleGenerateImage}
        onDownloadPDF={handleDownloadPDF}
        onViewHistory={handleViewHistory}
      />
    );
  }

  if (viewMode === 'result' && state.isComplete) {
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

  // Se não há step atual (pode acontecer após filtrar), mostrar mensagem de erro
  if (!currentStepData) {
    return (
      <div className="text-center p-8">
        <p>Erro na navegação. Reiniciando...</p>
        <button onClick={resetConsultant} className="mt-4 px-4 py-2 bg-primary text-white rounded">
          Reiniciar
        </button>
      </div>
    );
  }

  return (
    <div>
      <AkinatorProgress currentStep={state.currentStep} totalSteps={filteredSteps.length} />
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
