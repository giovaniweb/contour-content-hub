
import { useState, useCallback, useEffect } from 'react';
import { StoredVideo } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useVideoPlayer = (videoId: string | null, mode: string) => {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (mode === 'swipe') {
      fetchRecommendedVideos();
    } else if (videoId) {
      fetchSingleVideo(videoId);
    }
  }, [videoId, mode]);

  const fetchSingleVideo = async (id: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('videos_storage')
        .select('*')
        .eq('id', id)
        .eq('status', 'ready')
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setVideos([data as StoredVideo]);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeo",
        description: error.message || "Não foi possível carregar o vídeo solicitado."
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedVideos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('videos_storage')
        .select('*')
        .eq('status', 'ready')
        .order('created_at', { ascending: false });
      
      // If we have a specific video ID, start with that one
      if (videoId) {
        const { data: featuredVideo, error: featuredError } = await supabase
          .from('videos_storage')
          .select('*')
          .eq('id', videoId)
          .single();
          
        if (!featuredError && featuredVideo) {
          // Exclude the featured video from the main query
          query = query.neq('id', videoId);
        }
      }
      
      const { data: recommendedVideos, error } = await query.limit(20);

      if (error) {
        throw error;
      }

      // If we have a featured video, put it first
      if (videoId) {
        const { data: featuredVideo, error: featuredError } = await supabase
          .from('videos_storage')
          .select('*')
          .eq('id', videoId)
          .single();
          
        if (!featuredError && featuredVideo) {
          setVideos([
            featuredVideo as StoredVideo,
            ...(recommendedVideos as StoredVideo[])
          ]);
        } else {
          setVideos(recommendedVideos as StoredVideo[]);
        }
      } else {
        setVideos(recommendedVideos as StoredVideo[]);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeos",
        description: error.message || "Não foi possível carregar os vídeos recomendados."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (video: StoredVideo) => {
    // Add like logic here
    toast({
      title: "Vídeo curtido",
      description: "O vídeo foi adicionado aos seus favoritos."
    });
  };

  const handleSkip = (video: StoredVideo) => {
    // Skip logic here
  };

  const handleVideoEnd = () => {
    toast({
      title: "Fim dos vídeos",
      description: "Você assistiu a todos os vídeos disponíveis.",
    });
  };

  // Create a callback for handling carousel selection
  const handleCarouselSelect = useCallback((index: number) => {
    setCurrentVideoIndex(index);
  }, []);

  return {
    videos,
    loading,
    currentVideoIndex,
    setCurrentVideoIndex,
    handleLike,
    handleSkip,
    handleVideoEnd,
    handleCarouselSelect
  };
};
