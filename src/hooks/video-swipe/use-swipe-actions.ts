
import { useState } from 'react';
import { StoredVideo } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';
import { deleteVideo } from '@/services/videoStorageService';
import { VideoSwipeState } from '@/components/video-swipe/types';

export function useSwipeActions(videos: StoredVideo[], setVideos: (videos: StoredVideo[]) => void) {
  const [state, setState] = useState<VideoSwipeState>({
    currentIndex: 0,
    direction: null,
    isPlaying: false
  });
  const { toast } = useToast();

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
    setState(prev => ({ ...prev, direction }));
    
    setTimeout(() => {
      setState(prev => {
        const currentIndex = prev.currentIndex < videos.length - 1 
          ? prev.currentIndex + 1 
          : 0;
          
        if (currentIndex === 0 && prev.currentIndex === videos.length - 1) {
          toast({
            title: "Fim dos vídeos",
            description: "Você visualizou todos os vídeos disponíveis."
          });
        }
        
        return { ...prev, currentIndex, direction: null };
      });
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
      
      if (state.currentIndex >= videos.length - 1) {
        setState(prev => ({ ...prev, currentIndex: 0 }));
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir vídeo",
        description: error.message || "Não foi possível excluir o vídeo."
      });
    }
  };

  return {
    currentIndex: state.currentIndex,
    direction: state.direction,
    handleLike,
    handleSkip,
    handleDelete
  };
}
