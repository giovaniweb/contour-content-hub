
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Definindo os tipos para as tabelas do Supabase
type Category = {
  id: number;
  name: string;
  description?: string;
};

type Question = {
  id: string;
  text: string;
  category_id: number;
  type: "profile" | "intention" | "diagnosis" | "nostalgia" | "technical";
  options: string[];
  next?: { [key: string]: string } | string;
  order?: number;
};

type Recommendation = {
  id: string;
  text: string;
  question_id: string;
  order?: number;
};

// Tipo para o estado do hook
type MestreDaBelezaState = {
  categories: Category[];
  questions: Question[];
  recommendations: Recommendation[];
  currentQuestion: Question | null;
  answers: { [questionId: string]: string };
  recommendation: Recommendation | null;
  loading: boolean;
  error: string | null;
  completed: boolean;
};

// Estado inicial
const initialState: MestreDaBelezaState = {
  categories: [],
  questions: [],
  recommendations: [],
  currentQuestion: null,
  answers: {},
  recommendation: null,
  loading: false,
  error: null,
  completed: false,
};

// Hook personalizado
export function useMestreDaBeleza() {
  const [state, setState] = useState<MestreDaBelezaState>(initialState);

  // Função para buscar dados do Supabase
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // Buscar categorias - usando mock data since the table doesn't exist
      const mockCategories: Category[] = [
        { id: 1, name: "Facial", description: "Tratamentos faciais" },
        { id: 2, name: "Corporal", description: "Tratamentos corporais" }
      ];

      // Buscar perguntas - usando mock data
      const mockQuestions: Question[] = [
        {
          id: "init",
          text: "Qual é seu principal objetivo?",
          category_id: 1,
          type: "profile",
          options: ["Rejuvenescimento", "Emagrecimento", "Definição"],
          next: "intention",
          order: 1
        }
      ];

      // Buscar recomendações - usando mock data
      const mockRecommendations: Recommendation[] = [
        {
          id: "rec1",
          text: "Recomendamos tratamento com HIFU",
          question_id: "init",
          order: 1
        }
      ];

      setState((prev) => ({
        ...prev,
        categories: mockCategories,
        questions: mockQuestions,
        recommendations: mockRecommendations,
        loading: false,
      }));
    } catch (err: any) {
      console.error('Error fetching data:', err);
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Erro desconhecido ao carregar dados';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Função para iniciar o questionário
  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentQuestion: state.questions.find((q) => q.id === "init") || null,
      answers: {},
      recommendation: null,
      completed: false,
    }));
  }, [state.questions]);

  // Função para responder a uma pergunta
  const answer = useCallback(
    (questionId: string, option: string) => {
      setState((prev) => {
        const currentQuestion =
          prev.questions.find((q) => q.id === questionId) || null;

        if (!currentQuestion) {
          console.warn(`Pergunta não encontrada com ID: ${questionId}`);
          return prev;
        }

        const newAnswers = { ...prev.answers, [questionId]: option };

        // Determinar a próxima pergunta
        let nextQuestionId: string | undefined;

        if (typeof currentQuestion.next === "string") {
          nextQuestionId = currentQuestion.next;
        } else if (
          typeof currentQuestion.next === "object" &&
          currentQuestion.next !== null
        ) {
          nextQuestionId = currentQuestion.next[option];
        }

        // Se não houver próxima pergunta, buscar recomendação
        if (!nextQuestionId) {
          // Lógica de recomendação (simplificada)
          const recommendation = prev.recommendations.find(
            (r) => r.question_id === questionId && r.text === option
          ) || null;

          return {
            ...prev,
            answers: newAnswers,
            recommendation: recommendation,
            completed: true,
          };
        }

        const nextQuestion = prev.questions.find((q) => q.id === nextQuestionId) || null;

        return {
          ...prev,
          answers: newAnswers,
          currentQuestion: nextQuestion,
          recommendation: null,
          completed: !nextQuestion,
        };
      });
    },
    [state.questions, state.recommendations]
  );

  const calculateSimilarity = useCallback((answers: { [questionId: string]: string }) => {
    const answeredQuestions = Object.keys(answers);
    const totalQuestions = state.questions.filter(q => q.type === 'intention').length;
    const answeredIntentionQuestions = state.questions.filter(q => q.type === 'intention' && answeredQuestions.includes(q.id)).length;
    
    // Ajuste para evitar divisão por zero
    const adjustedTotal = Math.max(1, totalQuestions);
    
    return (answeredIntentionQuestions / adjustedTotal) * 100;
  }, [state.questions]);

  // Função para obter uma recomendação baseada nas respostas
  const getRecommendation = useCallback(() => {
    if (!state.completed) {
      console.warn("Questionário ainda não foi concluído.");
      return null;
    }

    // Tenta encontrar uma recomendação direta
    let recommendation = state.recommendation;

    // Se não encontrou, tenta uma lógica mais complexa
    if (!recommendation) {
      // Lógica de recomendação mais complexa (exemplo)
      const lastAnsweredQuestionId = Object.keys(state.answers).pop();
      if (lastAnsweredQuestionId) {
        const lastAnswer = state.answers[lastAnsweredQuestionId];
        recommendation =
          state.recommendations.find(
            (r) => r.question_id === lastAnsweredQuestionId && r.text === lastAnswer
          ) || null;
      }
    }

    return recommendation;
  }, [state.answers, state.recommendation, state.recommendations, state.completed]);

  // Hook useEffect para buscar os dados ao montar o componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset
  const reset = useCallback(() => {
    start();
  }, [start]);

  const confidence = calculateSimilarity(state.answers);

  return {
    ...state,
    start,
    answer,
    getRecommendation,
    reset,
    confidence
  };
}
