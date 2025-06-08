
import React from 'react';
import { MARKETING_STEPS } from '../constants';
import { MarketingConsultantState } from '../types';
import { getNextValidQuestion } from '../utils/questionNavigation';

interface AkinatorAnswerHandlerProps {
  currentStep: number;
  state: MarketingConsultantState;
  setState: React.Dispatch<React.SetStateAction<MarketingConsultantState>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
  updateClinicType: (clinicType: 'clinica_medica' | 'clinica_estetica') => void;
}

export const useAnswerHandler = ({
  currentStep,
  state,
  setState,
  setCurrentStep,
  setIsProcessing,
  setShowResult,
  updateClinicType
}: AkinatorAnswerHandlerProps) => {
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
      
      // Usar o novo estado para encontrar a próxima pergunta
      const nextStep = getNextValidQuestion(currentStep, newState);
      
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

  return { handleAnswer };
};
