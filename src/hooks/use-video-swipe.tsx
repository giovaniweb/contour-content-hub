
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StoredVideo } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';
import { deleteVideo } from '@/services/videoStorageService';

export function useVideoSwipe() {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

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

  const handleLike = () => {
    handleSwipe('right');
    toast({
      title: "Vídeo curtido",
      description: "Este vídeo foi adicionado aos seus favoritos."
    });
    // Here you could add logic to save the like to the database
  };

  const handleSkip = () => {
    handleSwipe('left');
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setDirection(direction);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < videos.length - 1) {
          return prevIndex + 1;
        }
        // If we've reached the end, restart or show a message
        toast({
          title: "Fim dos vídeos",
          description: "Você visualizou todos os vídeos disponíveis."
        });
        return 0;
      });
      setDirection(null);
    }, 300);
  };

  const handleDelete = async (videoId: string) => {
    try {
      const { success, error } = await deleteVideo(videoId);
      
      if (!success) {
        throw new Error(error);
      }

      setVideos(videos.filter((video) => video.id !== videoId));
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi removido com sucesso."
      });
      
      if (currentIndex >= videos.length - 1) {
        setCurrentIndex(0);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir vídeo",
        description: error.message || "Não foi possível excluir o vídeo."
      });
    }
  };

  // Create animation variants for the swipe effect
  const variants = {
    enter: (direction: 'left' | 'right' | null) => {
      return {
        x: direction === 'right' ? 1000 : direction === 'left' ? -1000 : 0,
        opacity: 0
      };
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right' | null) => {
      return {
        x: direction === 'left' ? 1000 : direction === 'right' ? -1000 : 0,
        opacity: 0
      };
    }
  };

  const currentVideo = videos[currentIndex];

  return {
    videos,
    currentVideo,
    loading,
    direction,
    currentIndex,
    variants,
    fetchVideos,
    handleLike,
    handleSkip,
    handleDelete
  };
}
