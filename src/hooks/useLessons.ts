import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AcademyLesson {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  vimeo_url: string;
  order_index: number;
  duration_minutes?: number;
  is_mandatory?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LessonFormData {
  title: string;
  description: string;
  vimeo_url: string;
  duration_minutes: number;
  is_mandatory: boolean;
  order_index: number;
}

export const useLessons = (courseId: string) => {
  const [lessons, setLessons] = useState<AcademyLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('academy_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;

      setLessons(data || []);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Erro ao carregar aulas');
    } finally {
      setIsLoading(false);
    }
  };

  const createLesson = async (lessonData: LessonFormData) => {
    try {
      const { data, error: createError } = await supabase
        .from('academy_lessons')
        .insert([{
          ...lessonData,
          course_id: courseId
        }])
        .select()
        .single();

      if (createError) throw createError;

      toast({
        title: "Aula criada!",
        description: "A aula foi criada com sucesso.",
      });

      await fetchLessons();
      await updateCourseDuration();
      return data;
    } catch (err) {
      console.error('Error creating lesson:', err);
      toast({
        title: "Erro",
        description: "Erro ao criar aula. Tente novamente.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateLessonsOrder = async (updatedLessons: AcademyLesson[]) => {
    try {
      // Update all lessons with new order
      const updates = updatedLessons.map(lesson => 
        supabase
          .from('academy_lessons')
          .update({ order_index: lesson.order_index })
          .eq('id', lesson.id)
      );

      await Promise.all(updates);

      toast({
        title: "Ordem atualizada!",
        description: "A ordem das aulas foi atualizada com sucesso.",
      });

      await fetchLessons();
    } catch (err) {
      console.error('Error updating lesson order:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ordem das aulas. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const updateLesson = async (id: string, lessonData: Partial<LessonFormData>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('academy_lessons')
        .update(lessonData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast({
        title: "Aula atualizada!",
        description: "A aula foi atualizada com sucesso.",
      });

      await fetchLessons();
      await updateCourseDuration();
      return data;
    } catch (err) {
      console.error('Error updating lesson:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar aula. Tente novamente.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteLesson = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('academy_lessons')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({
        title: "Aula excluída!",
        description: "A aula foi excluída com sucesso.",
      });

      await fetchLessons();
      await updateCourseDuration();
    } catch (err) {
      console.error('Error deleting lesson:', err);
      toast({
        title: "Erro",
        description: "Erro ao excluir aula. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const updateCourseDuration = async () => {
    if (!courseId) return;

    try {
      // Get current lessons to calculate total duration
      const { data: currentLessons } = await supabase
        .from('academy_lessons')
        .select('duration_minutes')
        .eq('course_id', courseId);

      if (currentLessons) {
        const totalMinutes = currentLessons.reduce((total, lesson) => total + (lesson.duration_minutes || 0), 0);
        const totalHours = Math.ceil(totalMinutes / 60);

        // Update course duration
        await supabase
          .from('academy_courses')
          .update({ estimated_duration_hours: totalHours })
          .eq('id', courseId);
      }
    } catch (err) {
      console.error('Error updating course duration:', err);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchLessons();
    }
  }, [courseId]);

  return {
    lessons,
    isLoading,
    error,
    createLesson,
    updateLesson,
    updateLessonsOrder,
    deleteLesson,
    refetch: fetchLessons
  };
};