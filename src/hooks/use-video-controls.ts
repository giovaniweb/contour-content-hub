
import { useState, useRef, useCallback, useEffect } from 'react';

export interface VideoControlsState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
  duration: number;
  currentTime: number;
  isFullscreen: boolean;
  showControls: boolean;
  isBuffering: boolean;
}

export const useVideoControls = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<VideoControlsState>({
    isPlaying: false,
    isMuted: false,
    volume: 1,
    progress: 0,
    duration: 0,
    currentTime: 0,
    isFullscreen: false,
    showControls: true,
    isBuffering: false,
  });
  
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play()
        .then(() => {
          setState(prev => ({ ...prev, isPlaying: true }));
        })
        .catch(() => {
          setState(prev => ({ ...prev, isPlaying: false }));
        });
    } else {
      video.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);
  
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const newMutedState = !video.muted;
    video.muted = newMutedState;
    setState(prev => ({ ...prev, isMuted: newMutedState }));
  }, []);
  
  const handleVolumeChange = useCallback((volume: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    const clampedVolume = Math.max(0, Math.min(1, volume));
    video.volume = clampedVolume;
    video.muted = clampedVolume === 0;
    
    setState(prev => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0 || video.muted,
    }));
  }, []);
  
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const progress = (video.currentTime / video.duration) * 100;
    
    setState(prev => ({
      ...prev,
      currentTime: video.currentTime,
      progress: isNaN(progress) ? 0 : progress,
    }));
  }, []);
  
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setState(prev => ({
      ...prev,
      duration: video.duration,
      isBuffering: false,
    }));
  }, []);
  
  const handleVideoEnded = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false, progress: 100 }));
  }, []);
  
  const handleSeek = useCallback((percent: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    const seekTime = (video.duration * percent) / 100;
    video.currentTime = seekTime;
    
    setState(prev => ({
      ...prev,
      currentTime: seekTime,
      progress: percent,
    }));
  }, []);
  
  const handleVideoError = useCallback((event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", event);
    setState(prev => ({ ...prev, isBuffering: false, isPlaying: false }));
  }, []);
  
  const toggleFullscreen = useCallback(() => {
    const container = document.querySelector('.video-player-container');
    if (!container) return;
    
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);
  
  const handleContainerClick = useCallback(() => {
    setState(prev => ({ ...prev, showControls: !prev.showControls }));
  }, []);
  
  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setState(prev => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement,
      }));
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  return {
    videoRef,
    ...state,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleVideoEnded,
    handleSeek,
    handleVideoError,
    toggleFullscreen,
    handleContainerClick,
    setState,
  };
};
