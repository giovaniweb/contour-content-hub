import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AcademyCourse, CourseFormData } from '@/types/academy';
import { useToast } from '@/hooks/use-toast';

export const useAcademyCourses = () => {
  const [courses, setCourses] = useState<AcademyCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('academy_courses')
        .select(`
          *,
          equipamentos(nome)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const coursesWithEquipment = data?.map(course => ({
        ...course,
        equipment_name: course.equipamentos?.nome || '',
        difficulty_level: (course.difficulty_level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
        status: (course.status as 'active' | 'inactive' | 'draft') || 'active'
      })) || [];

      setCourses(coursesWithEquipment);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Erro ao carregar cursos');
    } finally {
      setIsLoading(false);
    }
  };

  const createCourse = async (courseData: CourseFormData) => {
    try {
      const { data, error: createError } = await supabase
        .from('academy_courses')
        .insert([{
          ...courseData,
          status: 'active'
        }])
        .select()
        .single();

      if (createError) throw createError;

      toast({
        title: "Curso criado!",
        description: "O curso foi criado com sucesso.",
      });

      await fetchCourses();
      return data;
    } catch (err) {
      console.error('Error creating course:', err);
      toast({
        title: "Erro",
        description: "Erro ao criar curso. Tente novamente.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateCourse = async (id: string, courseData: Partial<CourseFormData>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('academy_courses')
        .update(courseData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast({
        title: "Curso atualizado!",
        description: "O curso foi atualizado com sucesso.",
      });

      await fetchCourses();
      return data;
    } catch (err) {
      console.error('Error updating course:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar curso. Tente novamente.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const toggleCourseStatus = async (id: string, status: 'active' | 'inactive') => {
    try {
      const { error: updateError } = await supabase
        .from('academy_courses')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;

      toast({
        title: status === 'active' ? "Curso ativado!" : "Curso desativado!",
        description: `O curso foi ${status === 'active' ? 'ativado' : 'desativado'} com sucesso.`,
      });

      await fetchCourses();
    } catch (err) {
      console.error('Error updating course status:', err);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do curso. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    isLoading,
    error,
    createCourse,
    updateCourse,
    toggleCourseStatus,
    refetch: fetchCourses
  };
};