
import { MARKETING_STEPS } from '../constants';
import { MarketingConsultantState } from '../types';

export const shouldShowQuestion = (stepIndex: number, state: MarketingConsultantState): boolean => {
  if (stepIndex >= MARKETING_STEPS.length) return false;
  
  const currentQuestion = MARKETING_STEPS[stepIndex];
  
  // Se não tem condição, sempre mostra
  if (!currentQuestion.condition) return true;
  
  // Verifica se a condição é atendida
  return currentQuestion.condition(state);
};

export const getNextValidQuestion = (currentStep: number, state: MarketingConsultantState): number => {
  let nextStep = currentStep + 1;
  
  // Procura a próxima pergunta válida
  while (nextStep < MARKETING_STEPS.length) {
    if (shouldShowQuestion(nextStep, state)) {
      return nextStep;
    }
    nextStep++;
  }
  
  // Se não encontrou nenhuma pergunta válida, retorna o comprimento do array (fim)
  return MARKETING_STEPS.length;
};

export const getPreviousValidQuestion = (currentStep: number, state: MarketingConsultantState): number => {
  let previousStep = currentStep - 1;
  
  // Procura a pergunta anterior válida
  while (previousStep >= 0) {
    if (shouldShowQuestion(previousStep, state)) {
      return previousStep;
    }
    previousStep--;
  }
  
  // Se não encontrou nenhuma pergunta válida anterior, retorna 0
  return 0;
};

export const getTotalValidQuestions = (state: MarketingConsultantState): number => {
  return MARKETING_STEPS.filter((_, index) => shouldShowQuestion(index, state)).length;
};

export const getCurrentQuestionNumber = (currentStep: number, state: MarketingConsultantState): number => {
  let questionNumber = 0;
  
  for (let i = 0; i <= currentStep && i < MARKETING_STEPS.length; i++) {
    if (shouldShowQuestion(i, state)) {
      questionNumber++;
    }
  }
  
  return questionNumber;
};
