import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SurveyQuestion {
  id: string;
  course_id: string;
  question_text: string;
  question_type: string;
  options?: any;
  is_required: boolean;
  order_index: number;
}

export interface SurveyResponse {
  question_id: string;
  response_value?: string;
  rating?: number;
}

export const useAcademySurvey = (courseId: string) => {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: questionsError } = await supabase
        .from('academy_survey_questions')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (questionsError) throw questionsError;

      setQuestions(data || []);
    } catch (err) {
      console.error('Error fetching survey questions:', err);
      setError('Erro ao carregar questionário');
    } finally {
      setIsLoading(false);
    }
  };

  const checkCompletion = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('academy_user_survey_responses')
        .select('question_id')
        .eq('course_id', courseId)
        .eq('user_id', userData.user.id);

      if (error) throw error;

      // Check if user has answered all required questions
      const answeredQuestionIds = new Set(data?.map(r => r.question_id) || []);
      const requiredQuestions = questions.filter(q => q.is_required);
      const allRequiredAnswered = requiredQuestions.every(q => answeredQuestionIds.has(q.id));

      setHasCompleted(allRequiredAnswered && data && data.length > 0);
    } catch (err) {
      console.error('Error checking survey completion:', err);
    }
  };

  const submitSurvey = async (responses: SurveyResponse[]) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      // Delete existing responses first
      await supabase
        .from('academy_user_survey_responses')
        .delete()
        .eq('course_id', courseId)
        .eq('user_id', userData.user.id);

      // Insert new responses
      const responseData = responses.map(response => ({
        course_id: courseId,
        user_id: userData.user.id,
        question_id: response.question_id,
        response_value: response.response_value,
        rating: response.rating
      }));

      const { error } = await supabase
        .from('academy_user_survey_responses')
        .insert(responseData);

      if (error) throw error;

      toast({
        title: "Pesquisa Enviada!",
        description: "Obrigado pelo seu feedback!",
      });

      setHasCompleted(true);
    } catch (err) {
      console.error('Error submitting survey:', err);
      toast({
        title: "Erro",
        description: "Erro ao enviar pesquisa. Tente novamente.",
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchQuestions();
    }
  }, [courseId]);

  useEffect(() => {
    if (questions.length > 0) {
      checkCompletion();
    }
  }, [questions]);

  return {
    questions,
    hasCompleted,
    isLoading,
    error,
    submitSurvey,
    refetch: fetchQuestions
  };
};