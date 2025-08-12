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
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      if (!userId || !courseId) {
        setLessonProgress([]);
        setIsLoading(false);
        return;
      }

      // Fetch lessons for the course
      const { data: lessons, error: lessonsError } = await supabase
        .from('academy_lessons')
        .select('id')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;

      const lessonIds = (lessons || []).map((l) => l.id);
      if (lessonIds.length === 0) {
        setLessonProgress([]);
        setIsLoading(false);
        return;
      }

      // Fetch progress for those lessons
      const { data: progressData, error: progressError } = await supabase
        .from('academy_user_lesson_progress')
        .select('lesson_id, user_id, completed, completed_at, watch_time_seconds')
        .eq('user_id', userId)
        .in('lesson_id', lessonIds);

      if (progressError) throw progressError;

      setLessonProgress(progressData || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching lesson progress:', err);
      setIsLoading(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      if (!userId) return;

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('academy_user_lesson_progress')
        .upsert(
          [{
            user_id: userId,
            lesson_id: lessonId,
            completed: true,
            completed_at: now,
            // Do not send watch_time_seconds here to avoid overwriting
            last_watched_at: now
          }],
          { onConflict: 'user_id,lesson_id' }
        )
        .select()
        .maybeSingle();

      if (error) throw error;

      const newProgress: LessonProgress = {
        lesson_id: lessonId,
        user_id: userId,
        completed: true,
        completed_at: now,
        watch_time_seconds: lessonProgress.find(p => p.lesson_id === lessonId)?.watch_time_seconds
      };

      setLessonProgress(prev => [
        ...prev.filter(p => p.lesson_id !== lessonId),
        newProgress
      ]);

      toast({
        title: 'Aula concluída!',
        description: 'Seu progresso foi salvo.'
      });

      return data;
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar progresso da aula.',
        variant: 'destructive'
      });
    }
  };

  const updateWatchTime = async (lessonId: string, watchTimeSeconds: number) => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      if (!userId) return;

      const now = new Date().toISOString();

      // Upsert only the fields we want to update to avoid overriding completed flags
      const { error } = await supabase
        .from('academy_user_lesson_progress')
        .upsert(
          [{
            user_id: userId,
            lesson_id: lessonId,
            watch_time_seconds: Math.max(0, Math.floor(watchTimeSeconds)),
            last_watched_at: now
          }],
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) throw error;

      setLessonProgress(prev => {
        const existing = prev.find(p => p.lesson_id === lessonId);
        if (existing) {
          return prev.map(p =>
            p.lesson_id === lessonId
              ? { ...p, watch_time_seconds: Math.max(p.watch_time_seconds || 0, Math.floor(watchTimeSeconds)) }
              : p
          );
        } else {
          return [
            ...prev,
            {
              lesson_id: lessonId,
              user_id: userId,
              completed: false,
              watch_time_seconds: Math.floor(watchTimeSeconds)
            }
          ];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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