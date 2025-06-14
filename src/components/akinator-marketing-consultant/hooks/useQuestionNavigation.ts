
import { useState } from 'react';
import { MarketingConsultantState } from '../types';
import { MARKETING_STEPS } from '../constants';
import { getNextValidQuestion, getPreviousValidQuestion } from '../utils/questionNavigation';
import { useAIDiagnostic } from '@/hooks/useAIDiagnostic';
import { toast } from 'sonner';

interface UseQuestionNavigationProps {
  state: MarketingConsultantState;
  setState: React.Dispatch<React.SetStateAction<MarketingConsultantState>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  saveCurrentSession: (state: MarketingConsultantState, isCompleted: boolean) => Promise<any>;
}

export const useQuestionNavigation = ({
  state,
  setState,
  currentStep,
  setCurrentStep,
  setIsProcessing,
  setShowDashboard,
  saveCurrentSession
}: UseQuestionNavigationProps) => {
  const [processingError, setProcessingError] = useState<string | null>(null);
  const { generateDiagnostic } = useAIDiagnostic();

  const handleOptionSelect = async (value: string) => {
    const currentQuestion = MARKETING_STEPS[currentStep];
    
    console.log('🟢 INÍCIO handleOptionSelect');
    console.log('🔵 Resposta selecionada:', value);
    console.log('🔵 Step atual:', currentStep);
    
    const newState = {
      ...state,
      [currentQuestion.id]: value
    };
    
    setState(newState);
    console.log('🟡 Estado atualizado:', newState);
    
    const nextStep = getNextValidQuestion(currentStep, newState);
    console.log('🟡 Próximo step calculado:', nextStep);
    
    if (nextStep >= MARKETING_STEPS.length) {
      console.log('🔴 FIM DO QUESTIONÁRIO DETECTADO - iniciando processamento');
      setIsProcessing(true);
      setProcessingError(null);
      
      try {
        const diagnostic = await generateDiagnostic(newState);
        console.log('🟣 Diagnóstico recebido:', diagnostic);
        
        if (diagnostic) {
          const finalState = {
            ...newState,
            generatedDiagnostic: diagnostic
          };
          
          setState(finalState);
          await saveCurrentSession(finalState, true);
          
          console.log('🟢 Processamento concluído - redirecionando para dashboard');
          
          setTimeout(() => {
            setShowDashboard(true);
            setIsProcessing(false);
          }, 1000);
          
          toast.success("✅ Diagnóstico concluído!", {
            description: "Redirecionando para o dashboard..."
          });
        } else {
          throw new Error('Diagnóstico não foi gerado');
        }
        
      } catch (error) {
        console.error('🔴 ERRO no processamento:', error);
        setProcessingError('Erro ao processar diagnóstico com IA');
        
        const finalState = {
          ...newState,
          generatedDiagnostic: 'Diagnóstico temporariamente indisponível. Suas respostas foram salvas e você pode visualizar as recomendações básicas.'
        };
        
        setState(finalState);
        await saveCurrentSession(finalState, true);
        
        setTimeout(() => {
          setShowDashboard(true);
          setIsProcessing(false);
        }, 2000);
        
        toast.warning("Diagnóstico salvo!", {
          description: "Indo para o dashboard com suas respostas..."
        });
      }
    } else {
      console.log('🟢 Navegando para próxima pergunta:', nextStep, MARKETING_STEPS[nextStep]);
      setCurrentStep(nextStep);
      
      // Removido: toast.success para "Resposta salva!" - feedback visual através de animações
    }
    
    console.log('🟢 FIM handleOptionSelect');
  };

  const handleGoBack = () => {
    const previousStep = getPreviousValidQuestion(currentStep, state);
    console.log('⬅️ Voltando para step:', previousStep);
    setCurrentStep(previousStep);
    
    // Removido: toast.success para "Voltando à pergunta anterior" - navegação silenciosa
  };

  const handleContinueWithoutAI = async () => {
    const finalState = {
      ...state,
      generatedDiagnostic: 'Modo básico: Suas respostas foram processadas localmente.'
    };
    
    setState(finalState);
    await saveCurrentSession(finalState, true);
    
    setTimeout(() => {
      setShowDashboard(true);
      setIsProcessing(false);
    }, 500);
    
    toast.success("Continuando com diagnóstico básico", {
      description: "Redirecionando para dashboard..."
    });
  };

  return {
    handleOptionSelect,
    handleGoBack,
    handleContinueWithoutAI,
    processingError
  };
};
