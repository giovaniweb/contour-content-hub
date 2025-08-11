import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ExamQuestion {
  id: string;
  course_id: string;
  question_text: string;
  question_type: string;
  order_index: number;
  points: number;
  explanation?: string;
  options?: ExamOption[];
}

export interface ExamOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

export interface ExamAttempt {
  id: string;
  user_id: string;
  course_id: string;
  score: number;
  total_questions: number;
  passed: boolean;
  attempt_number: number;
  answers: any;
  started_at: string;
  completed_at?: string;
}

export const useAcademyExams = (courseId: string) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: questionsData, error: questionsError } = await supabase
        .from('academy_exam_questions')
        .select(`
          *,
          academy_exam_options (*)
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (questionsError) throw questionsError;

      const formattedQuestions = questionsData?.map(q => ({
        ...q,
        options: q.academy_exam_options || []
      })) || [];

      setQuestions(formattedQuestions);
    } catch (err) {
      console.error('Error fetching exam questions:', err);
      setError('Erro ao carregar questões da prova');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const { data, error: attemptsError } = await supabase
        .from('academy_user_exam_attempts')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (attemptsError) throw attemptsError;

      setAttempts(data || []);
    } catch (err) {
      console.error('Error fetching exam attempts:', err);
    }
  };

  const submitExam = async (answers: Record<string, string>) => {
    try {
      // Calculate score
      let score = 0;
      let totalPoints = 0;

      questions.forEach(question => {
        totalPoints += question.points;
        const userAnswer = answers[question.id];
        const correctOption = question.options?.find(opt => opt.is_correct);
        
        if (correctOption && userAnswer === correctOption.id) {
          score += question.points;
        }
      });

      const passed = (score / totalPoints) >= 0.7; // 70% to pass
      const attemptNumber = (attempts.length || 0) + 1;

      const { data, error } = await supabase
        .from('academy_user_exam_attempts')
        .insert([{
          course_id: courseId,
          user_id: (await supabase.auth.getUser()).data.user?.id!,
          score,
          total_questions: questions.length,
          passed,
          attempt_number: attemptNumber,
          answers,
          completed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: passed ? "Parabéns!" : "Prova Concluída",
        description: passed 
          ? `Você passou na prova com ${Math.round((score/totalPoints) * 100)}%`
          : `Você obteve ${Math.round((score/totalPoints) * 100)}%. Tente novamente para passar.`,
        variant: passed ? "default" : "destructive"
      });

      await fetchAttempts();
      return data;
    } catch (err) {
      console.error('Error submitting exam:', err);
      toast({
        title: "Erro",
        description: "Erro ao enviar prova. Tente novamente.",
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchQuestions();
      fetchAttempts();
    }
  }, [courseId]);

  const hasPassedExam = attempts.some(attempt => attempt.passed);
  const lastAttempt = attempts[0];

  return {
    questions,
    attempts,
    isLoading,
    error,
    submitExam,
    hasPassedExam,
    lastAttempt,
    refetch: () => {
      fetchQuestions();
      fetchAttempts();
    }
  };
};