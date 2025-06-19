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
      // Buscar categorias
      const { data: categories, error: categoriesError } = await supabase
        .from<Category>("categories")
        .select("*")
        .order("id");

      if (categoriesError) throw categoriesError;

      // Buscar perguntas
      const { data: questions, error: questionsError } = await supabase
        .from<Question>("questions")
        .select("*")
        .order("order")
        .order("id");

      if (questionsError) throw questionsError;

      // Buscar recomendações
      const { data: recommendations, error: recommendationsError } = await supabase
        .from<Recommendation>("recommendations")
        .select("*")
        .order("order")
        .order("id");

      if (recommendationsError) throw recommendationsError;

      setState((prev) => ({
        ...prev,
        categories: categories || [],
        questions: questions || [],
        recommendations: recommendations || [],
        loading: false,
      }));
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err?.message || 'Erro desconhecido ao carregar dados',
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
