import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AcademyStats } from '@/types/academy';

export const useAcademyStats = () => {
  const [stats, setStats] = useState<AcademyStats>({
    totalCourses: 0,
    activeStudents: 0,
    pendingRequests: 0,
    certificatesIssued: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get total active courses
      const { count: totalCourses } = await supabase
        .from('academy_courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get active students (users with non-completed course access)
      const { count: activeStudents } = await supabase
        .from('academy_user_course_access')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'completed');

      // Get pending access requests
      const { count: pendingRequests } = await supabase
        .from('academy_access_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get certificates issued (completed courses)
      const { count: certificatesIssued } = await supabase
        .from('academy_user_course_access')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      setStats({
        totalCourses: totalCourses || 0,
        activeStudents: activeStudents || 0,
        pendingRequests: pendingRequests || 0,
        certificatesIssued: certificatesIssued || 0
      });
    } catch (err) {
      console.error('Error fetching academy stats:', err);
      setError('Erro ao carregar estatísticas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
};