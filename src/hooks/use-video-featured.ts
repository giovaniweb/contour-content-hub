
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

        // Primeiro verificamos se temos uma tabela de vídeos em destaque
        const { data: featuredData, error: featuredError } = await supabase
          .from('featured_videos')
          .select('video_id')
          .order('order', { ascending: true })
          .limit(limit);

        if (featuredError && featuredError.code !== 'PGRST116') {
          throw new Error(featuredError.message);
        }

        let videoIds: string[] = [];
        
        // Se tivermos vídeos em destaque, buscamos eles
        if (featuredData && featuredData.length > 0) {
          videoIds = featuredData.map(item => item.video_id);
          
          const { data, error } = await supabase
            .from('videos_storage')
            .select('*')
            .in('id', videoIds)
            .order('created_at', { ascending: false })
            .limit(limit);
            
          if (error) throw new Error(error.message);
          
          if (data && data.length > 0) {
            setVideos(data as StoredVideo[]);
            setIsLoading(false);
            return;
          }
        }
        
        // Caso não tenhamos vídeos em destaque ou ocorreu algum erro,
        // buscamos os vídeos mais recentes com status 'ready'
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
