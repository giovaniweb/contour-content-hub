
import { useState, useEffect } from 'react';
import { StoredVideo } from '@/types/video-storage';
import { supabase } from '@/integrations/supabase/client';

interface UseVideoFeaturedResult {
  videos: StoredVideo[];
  isLoading: boolean;
  error: string | null;
}

export function useVideoFeatured(limit = 6): UseVideoFeaturedResult {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Buscar os vídeos mais recentes com status 'ready'
        const { data, error } = await supabase
          .from('videos_storage')
          .select('*')
          .eq('status', 'ready')
          .eq('public', true)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) throw new Error(error.message);
        
        if (data) {
          setVideos(data as StoredVideo[]);
        }
      } catch (err) {
        console.error('Error fetching featured videos:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar vídeos em destaque');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedVideos();
  }, [limit]);

  return { videos, isLoading, error };
}
