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
  order_index: number;
  duration_minutes: number;
  is_mandatory: boolean;
}

export const useAcademyLessons = (courseId?: string) => {
  const [lessons, setLessons] = useState<AcademyLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLessons = async () => {
    if (!courseId) return;
    
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
    if (!courseId) return;

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
    } catch (err) {
      console.error('Error deleting lesson:', err);
      toast({
        title: "Erro",
        description: "Erro ao excluir aula. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const reorderLessons = async (reorderedLessons: AcademyLesson[]) => {
    try {
      const updates = reorderedLessons.map((lesson, index) => ({
        id: lesson.id,
        order_index: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('academy_lessons')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      toast({
        title: "Ordem atualizada!",
        description: "A ordem das aulas foi atualizada com sucesso.",
      });

      await fetchLessons();
    } catch (err) {
      console.error('Error reordering lessons:', err);
      toast({
        title: "Erro",
        description: "Erro ao reordenar aulas. Tente novamente.",
        variant: "destructive"
      });
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
    deleteLesson,
    reorderLessons,
    refetch: fetchLessons
  };
};