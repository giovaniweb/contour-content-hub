
import { MARKETING_STEPS } from '../constants';
import { MarketingConsultantState } from '../types';

// Função para determinar se uma pergunta deve ser exibida baseada no estado atual
export const shouldShowQuestion = (questionIndex: number, currentState: MarketingConsultantState): boolean => {
  const question = MARKETING_STEPS[questionIndex];
  
  if (!question.condition) {
    return true; // Sem condição, sempre exibir
  }

  // Chamar a função de condição com o estado atual
  return question.condition(currentState);
};

// Função para encontrar a próxima pergunta válida
export const getNextValidQuestion = (currentIndex: number, currentState: MarketingConsultantState): number => {
  for (let i = currentIndex + 1; i < MARKETING_STEPS.length; i++) {
    if (shouldShowQuestion(i, currentState)) {
      console.log(`Próxima pergunta válida encontrada: ${i}`, MARKETING_STEPS[i]);
      return i;
    }
  }
  console.log('Nenhuma próxima pergunta válida encontrada');
  return MARKETING_STEPS.length;
};

// Função para encontrar a pergunta anterior válida
export const getPreviousValidQuestion = (currentIndex: number, currentState: MarketingConsultantState): number => {
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (shouldShowQuestion(i, currentState)) {
      return i;
    }
  }
  return 0;
};
