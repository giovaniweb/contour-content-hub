import { useState, useCallback } from 'react';
import { perguntasInteligentes, PerguntaInteligente } from '../perguntasInteligentes';
import { useMestreDaBelezaSession } from '@/hooks/useMestreDaBelezaSession';

export interface QuestionFlow {
  currentQuestion: PerguntaInteligente | null;
  currentIndex: number;
  totalQuestions: number;
  progress: number;
  responses: Record<string, any>;
  isComplete: boolean;
}

export function useIntelligentQuestions() {
  const { session, saveResponse, nextStep } = useMestreDaBelezaSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = perguntasInteligentes[currentIndex] || null;
  const progress = ((currentIndex + 1) / perguntasInteligentes.length) * 100;

  const answerQuestion = useCallback(async (answer: string) => {
    if (!currentQuestion) return;

    const newResponses = { ...responses, [currentQuestion.id]: answer };
    setResponses(newResponses);

    // Salvar resposta na sessão
    await saveResponse(currentQuestion.id, answer);

    // Verificar lógica de ramificação
    let nextIndex = currentIndex + 1;
    
    if (currentQuestion.ramifica) {
      const shouldSkip = currentQuestion.ramifica(newResponses);
      if (shouldSkip) {
        nextIndex = currentIndex + 2; // Pular próxima pergunta
      }
    }

    // Verificar se terminou
    if (nextIndex >= perguntasInteligentes.length) {
      setIsComplete(true);
      await nextStep('analysis', { final_responses: newResponses });
      return newResponses;
    }

    setCurrentIndex(nextIndex);
    return null; // Não terminou ainda
  }, [currentQuestion, currentIndex, responses, saveResponse, nextStep]);

  const resetQuestions = useCallback(() => {
    setCurrentIndex(0);
    setResponses({});
    setIsComplete(false);
  }, []);

  const jumpToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < perguntasInteligentes.length) {
      setCurrentIndex(index);
    }
  }, []);

  const getQuestionsByType = useCallback((type: string) => {
    return perguntasInteligentes.filter(q => q.tipo === type);
  }, []);

  return {
    // Estado atual
    currentQuestion,
    currentIndex,
    totalQuestions: perguntasInteligentes.length,
    progress,
    responses,
    isComplete,
    
    // Ações
    answerQuestion,
    resetQuestions,
    jumpToQuestion,
    
    // Utilitários
    getQuestionsByType,
    allQuestions: perguntasInteligentes
  };
}