import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface UserDashboardStats {
  totalScripts: number;
  totalVideosWatched: number;
  totalDownloads: number;
  totalPhotosUploaded: number;
  recentActivity: Array<{
    id: string;
    action_type: string;
    target_type: string;
    created_at: string;
  }>;
  gamification: {
    xp_total: number;
    nivel: string;
    videos_watched: number;
    videos_downloaded: number;
    diagnostics_completed: number;
    photos_uploaded: number;
  };
}

export const useRealUserDashboardStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-dashboard-stats', user?.id],
    queryFn: async (): Promise<UserDashboardStats> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      try {
        // Get user stats in parallel
        const [
          scriptsResponse,
          videosWatchedResponse,
          downloadsResponse,
          photosResponse,
          recentActivityResponse,
          gamificationResponse
        ] = await Promise.all([
          // Total scripts created
          supabase
            .from('approved_scripts')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id),
          
          // Videos watched (from user_actions)
          supabase
            .from('user_actions')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id)
            .eq('action_type', 'video_watch'),
          
          // Downloads made
          supabase
            .from('user_actions')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id)
            .eq('action_type', 'video_download'),
          
          // Photos uploaded
          supabase
            .from('before_after_photos')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id),
          
          // Recent activity
          supabase
            .from('user_actions')
            .select('id, action_type, target_type, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10),
          
          // Gamification data
          supabase
            .from('user_gamification')
            .select('*')
            .eq('user_id', user.id)
            .single()
        ]);

        // Calculate level based on XP
        const xpTotal = gamificationResponse.data?.xp_total || 0;
        let nivel = 'Bronze';
        if (xpTotal >= 500) nivel = 'Diamante';
        else if (xpTotal >= 250) nivel = 'Ouro';
        else if (xpTotal >= 100) nivel = 'Prata';

        return {
          totalScripts: scriptsResponse.count || 0,
          totalVideosWatched: videosWatchedResponse.count || 0,
          totalDownloads: downloadsResponse.count || 0,
          totalPhotosUploaded: photosResponse.count || 0,
          recentActivity: recentActivityResponse.data || [],
          gamification: {
            xp_total: xpTotal,
            nivel,
            videos_watched: videosWatchedResponse.count || 0,
            videos_downloaded: downloadsResponse.count || 0,
            diagnostics_completed: 0, // Could add this from user_actions later
            photos_uploaded: photosResponse.count || 0,
          }
        };
      } catch (error) {
        console.error('Error fetching user dashboard stats:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes
  });
};