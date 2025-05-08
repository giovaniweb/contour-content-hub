
import { useState, useEffect } from 'react';
import { StoredVideo } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';
import { VideoPlayerOptions } from './types';

export function useNavigation(videos: StoredVideo[], options: VideoPlayerOptions) {
  const { onLike, onSkip, onEnd } = options;
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  const currentVideo = videos[currentIndex];
  const isLastVideo = currentIndex === videos.length - 1;
  
  // Reset player when video changes
  useEffect(() => {
    // Any video change logic can go here
  }, [currentIndex]);

  const handleLike = async () => {
    if (!currentVideo) return;
    
    try {
      if (onLike) {
        onLike(currentVideo);
      }
      
      toast({
        title: "Vídeo curtido!",
        description: "Este vídeo foi adicionado aos seus favoritos.",
      });
      
      goToNextVideo();
    } catch (error) {
      toast({
        title: "Erro ao curtir vídeo",
        description: "Não foi possível salvar sua preferência.",
        variant: "destructive"
      });
    }
  };
  
  const handleSkip = () => {
    if (!currentVideo) return;
    
    if (onSkip) {
      onSkip(currentVideo);
    }
    
    goToNextVideo();
  };
  
  const goToNextVideo = () => {
    if (isLastVideo) {
      if (onEnd) {
        onEnd();
      } else {
        toast({
          title: "Fim dos vídeos",
          description: "Você viu todos os vídeos disponíveis.",
        });
        // Reset to first video
        setCurrentIndex(0);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  return {
    currentIndex,
    currentVideo,
    handleLike,
    handleSkip,
    setCurrentIndex
  };
}
