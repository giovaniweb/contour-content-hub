
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StoredVideo } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';

export function useVideosFetch() {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      const { data: fetchedVideos, error } = await supabase
        .from('videos_storage')
        .select('*')
        .eq('status', 'ready')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Explicitly convert the fetched videos to the StoredVideo type
      const typedVideos: StoredVideo[] = fetchedVideos as StoredVideo[];
      setVideos(typedVideos);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeos",
        description: error.message || "Não foi possível carregar os vídeos."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    setVideos,
    fetchVideos
  };
}
