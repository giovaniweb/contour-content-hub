
// This file now re-exports the refactored hook for backwards compatibility
import { useVideoSwipePlayer as useRefactoredVideoSwipePlayer } from './video-player/use-video-swipe-player';
import { StoredVideo } from '@/types/video-storage';
import { VideoPlayerOptions } from './video-player/types';

export const useVideoSwipePlayer = (videos: StoredVideo[], options: VideoPlayerOptions = {}) => {
  return useRefactoredVideoSwipePlayer(videos, options);
};
