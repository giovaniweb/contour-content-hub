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
  lessonProgress: Record<string, { completed: boolean; watchTime: number }>;
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
    accessExpired: false,
    lessonProgress: {}
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

      // Fetch lesson progress for the user
      const userId = (await supabase.auth.getUser()).data.user?.id;
      let lessonProgress: Record<string, { completed: boolean; watchTime: number }> = {};
      
      if (userId) {
        const { data: progressData, error: progressError } = await supabase
          .from('academy_user_lesson_progress')
          .select('lesson_id, completed, watch_time_seconds')
          .eq('user_id', userId)
          .in('lesson_id', lessonsData?.map(l => l.id) || []);

        if (!progressError && progressData) {
          lessonProgress = progressData.reduce((acc, progress) => {
            acc[progress.lesson_id] = {
              completed: progress.completed,
              watchTime: progress.watch_time_seconds
            };
            return acc;
          }, {} as Record<string, { completed: boolean; watchTime: number }>);
        }
      }

      // Fetch user access
      const { data: userAccessData, error: accessError } = await supabase
        .from('academy_user_course_access')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', userId)
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
        accessExpired,
        lessonProgress
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

  const isLessonUnlocked = (lesson: any): boolean => {
    if (!courseProgress?.lessons) return false;
    
    // First lesson is always unlocked
    if (lesson.order_index === 1) return true;
    
    // Non-mandatory lessons don't block progress
    if (!lesson.is_mandatory) return true;
    
    // Find previous mandatory lesson
    const previousLessons = courseProgress.lessons
      .filter((l: any) => l.order_index < lesson.order_index && l.is_mandatory)
      .sort((a: any, b: any) => b.order_index - a.order_index);
    
    if (previousLessons.length === 0) return true;
    
    const previousLesson = previousLessons[0];
    const previousProgress = courseProgress.lessonProgress?.[previousLesson.id];
    
    return previousProgress?.completed || false;
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
    isLessonUnlocked,
    refetch: fetchCourseDetails
  };
};