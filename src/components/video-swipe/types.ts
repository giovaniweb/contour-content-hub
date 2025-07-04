
import { VideoCardBaseProps } from '@/components/video-storage/types';
import { StoredVideo } from '@/types/video-storage';
import { VideoPlayerOptions, VideoPlayerState } from '@/hooks/video-player/types';
import { SwipeAnimationVariants } from '@/hooks/video-swipe/use-swipe-animations';

export interface VideoSwipeProps extends VideoCardBaseProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onVideoEnd?: () => void;
  isCurrent: boolean;
}

export interface VideoSwipeViewerProps {
  videos: StoredVideo[];
  onLike?: (video: StoredVideo) => void;
  onSkip?: (video: StoredVideo) => void;
  onEnd?: () => void;
  className?: string;
}

export interface VideoSwipeState {
  currentIndex: number;
  direction: 'left' | 'right' | null;
  isPlaying: boolean;
}

export type { VideoPlayerState, VideoPlayerOptions, SwipeAnimationVariants };
