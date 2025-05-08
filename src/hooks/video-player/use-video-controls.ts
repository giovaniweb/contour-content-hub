
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VideoPlayerState } from './types';

export function useVideoControls() {
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    isMuted: false,
    progress: 0,
    showControls: true
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  // Control visibility of player controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (state.isPlaying) {
      timeout = setTimeout(() => {
        setState(prev => ({ ...prev, showControls: false }));
      }, 3000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [state.isPlaying, state.showControls]);
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setState(prev => ({ ...prev, progress }));
    }
  };
  
  const handleVideoEnded = () => {
    setState(prev => ({ ...prev, isPlaying: false, progress: 100 }));
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (state.isPlaying) {
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
      setState(prev => ({ 
        ...prev, 
        isPlaying: !prev.isPlaying,
        showControls: true 
      }));
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !state.isMuted;
      setState(prev => ({ 
        ...prev, 
        isMuted: !prev.isMuted,
        showControls: true 
      }));
    }
  };
  
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
      setState(prev => ({ ...prev, showControls: true }));
    }
  };
  
  const handleContainerClick = () => {
    setState(prev => ({ ...prev, showControls: true }));
  };
  
  return {
    videoRef,
    isPlaying: state.isPlaying,
    isMuted: state.isMuted,
    progress: state.progress,
    showControls: state.showControls,
    handleTimeUpdate,
    handleVideoEnded,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    handleContainerClick,
    setState
  };
}
