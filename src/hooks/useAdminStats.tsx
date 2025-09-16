import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  totalEquipments: number;
  totalVideos: number;
  totalDocuments: number;
  totalActions: number;
  totalBeforeAfter: number;
  totalDownloads: number;
  activeUsersLast30Days: number;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      try {
        // Get all stats in parallel
        const [
          usersResponse,
          equipmentsResponse,
          videosResponse,
          documentsResponse,
          actionsResponse,
          beforeAfterResponse,
          downloadsResponse
        ] = await Promise.all([
          supabase.from('perfis').select('id', { count: 'exact' }),
          supabase.from('equipamentos').select('id', { count: 'exact' }),
          supabase.from('videos').select('id', { count: 'exact' }),
          supabase.from('unified_documents').select('id', { count: 'exact' }),
          supabase.from('user_actions').select('id', { count: 'exact' }).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
          supabase.from('before_after_photos').select('id', { count: 'exact' }),
          supabase.from('downloads_storage').select('id', { count: 'exact' })
        ]);

        // Get active users from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const activeUsersResponse = await supabase
          .from('user_actions')
          .select('user_id')
          .gte('created_at', thirtyDaysAgo.toISOString());

        const uniqueActiveUsers = new Set(activeUsersResponse.data?.map(action => action.user_id) || []);

        const { data: stats, isLoading } = useAdminStats();

        return {
          ...stats,
          totalGamificationUsers: stats?.totalUsers || 0,
          hotLeads: 0, // Would need to implement hot leads calculation
          topEngagementUser: null, // Would need to implement top user calculation
          averageXP: 0 // Would need to implement average XP calculation
        };
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
};