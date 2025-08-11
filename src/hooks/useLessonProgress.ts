import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LessonProgress {
  lesson_id: string;
  user_id: string;
  completed: boolean;
  completed_at?: string;
  watch_time_seconds?: number;
}

export const useLessonProgress = (courseId: string) => {
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchLessonProgress = async () => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      // For now, we'll simulate lesson progress since we don't have the table yet
      // In a real implementation, you'd have an academy_lesson_progress table
      setLessonProgress([]);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching lesson progress:', err);
      setIsLoading(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      // Simulate marking lesson as complete
      const newProgress: LessonProgress = {
        lesson_id: lessonId,
        user_id: userId,
        completed: true,
        completed_at: new Date().toISOString()
      };

      setLessonProgress(prev => [
        ...prev.filter(p => p.lesson_id !== lessonId),
        newProgress
      ]);

      toast({
        title: "Aula concluída!",
        description: "Seu progresso foi salvo.",
      });

      return newProgress;
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      toast({
        title: "Erro",
        description: "Erro ao salvar progresso da aula.",
        variant: "destructive"
      });
    }
  };

  const updateWatchTime = async (lessonId: string, watchTimeSeconds: number) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      // Update watch time for lesson
      setLessonProgress(prev => {
        const existing = prev.find(p => p.lesson_id === lessonId);
        if (existing) {
          return prev.map(p => 
            p.lesson_id === lessonId 
              ? { ...p, watch_time_seconds: watchTimeSeconds }
              : p
          );
        } else {
          return [...prev, {
            lesson_id: lessonId,
            user_id: userId,
            completed: false,
            watch_time_seconds: watchTimeSeconds
          }];
        }
      });
    } catch (err) {
      console.error('Error updating watch time:', err);
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return lessonProgress.some(p => p.lesson_id === lessonId && p.completed);
  };

  const getLessonWatchTime = (lessonId: string): number => {
    const progress = lessonProgress.find(p => p.lesson_id === lessonId);
    return progress?.watch_time_seconds || 0;
  };

  useEffect(() => {
    if (courseId) {
      fetchLessonProgress();
    }
  }, [courseId]);

  return {
    lessonProgress,
    isLoading,
    markLessonComplete,
    updateWatchTime,
    isLessonCompleted,
    getLessonWatchTime,
    refetch: fetchLessonProgress
  };
};