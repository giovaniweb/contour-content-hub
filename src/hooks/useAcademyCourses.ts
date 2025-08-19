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

  const deleteCourse = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita e removerá todas as aulas associadas.')) {
      return;
    }

    try {
      // Delete lessons first (cascade)
      const { error: lessonsError } = await supabase
        .from('academy_lessons')
        .delete()
        .eq('course_id', id);

      if (lessonsError) throw lessonsError;

      // Delete course access records
      const { error: accessError } = await supabase
        .from('academy_user_course_access')
        .delete()
        .eq('course_id', id);

      if (accessError) throw accessError;

      // Delete access requests
      const { error: requestsError } = await supabase
        .from('academy_access_requests')
        .delete()
        .eq('course_id', id);

      if (requestsError) throw requestsError;

      // Finally delete the course
      const { error: courseError } = await supabase
        .from('academy_courses')
        .delete()
        .eq('id', id);

      if (courseError) throw courseError;

      toast({
        title: "Curso excluído!",
        description: "O curso e todos os dados associados foram removidos com sucesso.",
      });

      await fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
      toast({
        title: "Erro",
        description: "Erro ao excluir curso. Tente novamente.",
        variant: "destructive"
      });
      throw err;
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
    deleteCourse,
    refetch: fetchCourses
  };
};