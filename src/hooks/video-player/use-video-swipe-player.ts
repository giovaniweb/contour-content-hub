
import { useEffect } from 'react';
import { StoredVideo } from '@/types/video-storage';
import { VideoPlayerOptions } from './types';
import { useVideoControls } from './use-video-controls';
import { useNavigation } from './use-navigation';
import { useLikes } from './use-likes';

export const useVideoSwipePlayer = (videos: StoredVideo[], options: VideoPlayerOptions = {}) => {
  const videoControls = useVideoControls();
  const navigation = useNavigation(videos, options);
  const { saveLike } = useLikes();
  
  const {
    videoRef,
    isPlaying,
    isMuted,
    progress,
    showControls,
    handleTimeUpdate,
    handleVideoEnded,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    handleContainerClick,
    setState
  } = videoControls;
  
  const {
    currentIndex,
    currentVideo,
    handleSkip,
    setCurrentIndex
  } = navigation;
  
  // Reset player when video changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setState(prev => ({ ...prev, progress: 0 }));
      
      // Auto-play when video changes
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          // Auto-play was prevented
          setState(prev => ({ ...prev, isPlaying: false }));
        });
      }
    }
  }, [currentIndex, setState, videoRef]);
  
  const handleLike = async () => {
    if (!currentVideo) return;
    
    setState(prev => ({ ...prev, showControls: true }));
    
    try {
      const success = await saveLike(currentVideo.id);
      
      if (success) {
        if (options.onLike) {
          options.onLike(currentVideo);
        }
      }
      
      navigation.handleLike();
    } catch (error) {
      console.error("Error liking video:", error);
    }
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
