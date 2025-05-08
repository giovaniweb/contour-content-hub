
import { StoredVideo } from '@/types/video-storage';
import { useVideosFetch } from './video-swipe/use-videos-fetch';
import { useSwipeActions } from './video-swipe/use-swipe-actions';
import { useSwipeAnimations } from './video-swipe/use-swipe-animations';

export function useVideoSwipe() {
  // Use smaller, focused hooks
  const { videos, loading, setVideos, fetchVideos } = useVideosFetch();
  const { currentIndex, direction, handleLike, handleSkip, handleDelete } = useSwipeActions(videos, setVideos);
  const { variants } = useSwipeAnimations();

  // Compute current video based on index
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
