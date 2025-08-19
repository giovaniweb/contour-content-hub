import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AcademyCourse, AcademyUserAccess } from '@/types/academy';
import { AcademyLesson } from './useAcademyLessons';
import { useToast } from '@/hooks/use-toast';

export interface CourseProgress {
  course: AcademyCourse | null;
  lessons: AcademyLesson[];
  userAccess: AcademyUserAccess | null;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  hasAccess: boolean;
  accessExpired: boolean;
}

export const useCourseDetails = (courseId: string) => {
  const [courseProgress, setCourseProgress] = useState<CourseProgress>({
    course: null,
    lessons: [],
    userAccess: null,
    progressPercentage: 0,
    completedLessons: 0,
    totalLessons: 0,
    hasAccess: false,
    accessExpired: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCourseDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('academy_courses')
        .select(`
          *,
          equipamentos(nome)
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('academy_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;

      // Fetch user access
      const { data: userAccessData, error: accessError } = await supabase
        .from('academy_user_course_access')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (accessError) throw accessError;

      const course: AcademyCourse = {
        ...courseData,
        equipment_name: courseData.equipamentos?.nome || '',
        difficulty_level: courseData.difficulty_level as 'beginner' | 'intermediate' | 'advanced',
        status: courseData.status as 'active' | 'inactive' | 'draft'
      };

      const lessons = lessonsData || [];
      const userAccess: AcademyUserAccess | null = userAccessData ? {
        ...userAccessData,
        status: userAccessData.status as 'not_started' | 'in_progress' | 'completed' | 'expired',
        exam_status: userAccessData.exam_status as 'not_taken' | 'passed' | 'failed' | undefined
      } : null;
      
      // Check access - user has access if they have any record (access requests are handled separately)
      const hasAccess = userAccess !== null;
      const accessExpired = userAccess?.access_expires_at ? new Date(userAccess.access_expires_at) < new Date() : false;
      
      // Calculate progress
      const totalLessons = lessons.length;
      const completedLessons = 0; // Will be calculated based on lesson progress
      const progressPercentage = userAccess?.progress_percentage || 0;

      setCourseProgress({
        course,
        lessons,
        userAccess,
        progressPercentage,
        completedLessons,
        totalLessons,
        hasAccess,
        accessExpired
      });

    } catch (err) {
      console.error('Error fetching course details:', err);
      setError('Erro ao carregar detalhes do curso');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (newProgress: number) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      const { error } = await supabase
        .from('academy_user_course_access')
        .update({ 
          progress_percentage: newProgress,
          status: newProgress === 100 ? 'completed' : 'in_progress',
          completed_at: newProgress === 100 ? new Date().toISOString() : null
        })
        .eq('course_id', courseId)
        .eq('user_id', userId);

      if (error) throw error;

      setCourseProgress(prev => ({
        ...prev,
        progressPercentage: newProgress,
        userAccess: prev.userAccess ? {
          ...prev.userAccess,
          progress_percentage: newProgress,
          status: newProgress === 100 ? 'completed' : 'in_progress'
        } : null
      }));

      if (newProgress === 100) {
        toast({
          title: "Parabéns!",
          description: "Você concluiu o curso!",
        });
      }

    } catch (err) {
      console.error('Error updating progress:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar progresso.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  return {
    ...courseProgress,
    isLoading,
    error,
    updateProgress,
    refetch: fetchCourseDetails
  };
};