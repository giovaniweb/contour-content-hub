
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StoredVideo } from '@/types/video-storage';
import { supabase } from '@/integrations/supabase/client';

interface UseVideoSwipePlayerOptions {
  onLike?: (video: StoredVideo) => void;
  onSkip?: (video: StoredVideo) => void;
  onEnd?: () => void;
  initialVideo?: StoredVideo;
}

export const useVideoSwipePlayer = (videos: StoredVideo[], options: UseVideoSwipePlayerOptions = {}) => {
  const { onLike, onSkip, onEnd } = options;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  const currentVideo = videos[currentIndex];
  const isLastVideo = currentIndex === videos.length - 1;
  
  // Control visibility of player controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isPlaying) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isPlaying, showControls]);
  
  // Reset player when video changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setProgress(0);
      
      // Auto-play when video changes
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          // Auto-play was prevented
          setIsPlaying(false);
        });
      }
    }
  }, [currentIndex]);
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };
  
  const handleVideoEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          toast({
            title: "Reprodução bloqueada",
            description: "O navegador bloqueou a reprodução automática. Clique para iniciar.",
            variant: "destructive"
          });
        });
      }
      setIsPlaying(!isPlaying);
      setShowControls(true);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setShowControls(true);
    }
  };
  
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
      setShowControls(true);
    }
  };
  
  const saveLike = async (videoId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user || !user.user) {
        toast({
          title: "Erro ao curtir vídeo",
          description: "Você precisa estar logado para curtir vídeos.",
          variant: "destructive"
        });
        return false;
      }
      
      const { data, error } = await supabase
        .from('favoritos')
        .insert({ 
          video_id: videoId, 
          usuario_id: user.user.id 
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving like:', error);
      return false;
    }
  };
  
  const handleLike = async () => {
    if (!currentVideo) return;
    
    setShowControls(true);
    
    try {
      const success = await saveLike(currentVideo.id);
      
      if (success) {
        toast({
          title: "Vídeo curtido!",
          description: "Este vídeo foi adicionado aos seus favoritos.",
        });
      }
      
      if (onLike) {
        onLike(currentVideo);
      }
      
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
    
    setShowControls(true);
    
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
  
  const handleContainerClick = () => {
    setShowControls(true);
  };
  
  return {
    currentIndex,
    currentVideo,
    isPlaying,
    isMuted,
    progress,
    showControls,
    videoRef,
    handleTimeUpdate,
    handleVideoEnded,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    handleLike,
    handleSkip,
    handleContainerClick
  };
};
