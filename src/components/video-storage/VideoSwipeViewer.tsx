import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { StoredVideo } from '@/types/video-storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ThumbsUp, ThumbsDown, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface VideoSwipeViewerProps {
  videos: StoredVideo[];
  onLike?: (video: StoredVideo) => void;
  onSkip?: (video: StoredVideo) => void;
  onEnd?: () => void;
  className?: string;
}

const VideoSwipeViewer: React.FC<VideoSwipeViewerProps> = ({
  videos,
  onLike,
  onSkip,
  onEnd,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controls = useAnimation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
      
      // We need to adjust this to use a table that exists in our database
      // Instead of 'video_likes', we'll use 'favoritos' which serves the same purpose
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
      
      goToNextVideo("right");
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
    
    goToNextVideo("left");
  };
  
  const goToNextVideo = (direction: "left" | "right") => {
    // Animate the swipe
    controls.start({
      x: direction === "left" ? -window.innerWidth : window.innerWidth,
      opacity: 0,
      transition: { duration: 0.3 }
    }).then(() => {
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
      
      // Reset animation
      controls.set({ x: 0, opacity: 1 });
    });
  };
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100; // minimum distance to trigger swipe
    
    if (info.offset.x < -threshold) {
      // Swiped left - Skip
      handleSkip();
    } else if (info.offset.x > threshold) {
      // Swiped right - Like
      handleLike();
    } else {
      // Not enough swipe - reset position
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.2 }
      });
    }
  };
  
  const handleContainerClick = () => {
    setShowControls(true);
  };
  
  if (!videos.length) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-screen bg-black", className)}>
        <p className="text-white text-xl">Nenhum vídeo disponível</p>
      </div>
    );
  }
  
  if (!currentVideo) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-screen bg-black", className)}>
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }
  
  const videoUrl = currentVideo.file_urls?.original || 
                   currentVideo.file_urls?.hd || 
                   currentVideo.file_urls?.sd;
  
  if (!videoUrl) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-screen bg-black", className)}>
        <p className="text-white text-xl">URL do vídeo não encontrada</p>
      </div>
    );
  }
  
  return (
    <div 
      className={cn("relative h-full w-full bg-black overflow-hidden", className)}
      onClick={handleContainerClick}
    >
      <motion.div
        className="absolute w-full h-full"
        animate={controls}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleVideoEnded}
          muted={isMuted}
          playsInline
          onClick={togglePlay}
        />
        
        {/* Video title and description overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white text-xl font-bold">{currentVideo.title}</h3>
          {currentVideo.description && (
            <p className="text-white/80 line-clamp-2">{currentVideo.description}</p>
          )}
        </div>
        
        {/* Video progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        
        {/* Video controls - show/hide based on user interaction */}
        <div className={cn(
          "absolute top-0 left-0 right-0 bottom-0 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          {/* Top controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX /> : <Volume2 />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize />
              </Button>
            </div>
            
            <div className="flex items-center">
              <span className="text-white text-sm">
                {currentIndex + 1}/{videos.length}
              </span>
            </div>
          </div>
          
          {/* Center play/pause button */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/30 rounded-full w-16 h-16 hover:bg-black/50"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Action buttons */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-4 z-10">
        <Button 
          variant="secondary" 
          size="lg"
          className="rounded-full h-14 w-14 p-0 bg-white shadow-lg"
          onClick={handleSkip}
        >
          <ThumbsDown className="h-6 w-6 text-red-500" />
        </Button>
        
        <Button 
          variant="secondary" 
          size="lg"
          className="rounded-full h-14 w-14 p-0 bg-white shadow-lg"
          onClick={handleLike}
        >
          <ThumbsUp className="h-6 w-6 text-green-500" />
        </Button>
      </div>
    </div>
  );
};

export default VideoSwipeViewer;
