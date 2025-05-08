
import { StoredVideo } from '@/types/video-storage';

export interface VideoPlayerBaseProps {
  videoId?: string | null;
  mode?: string;
}

export interface VideoCarouselProps {
  videos: StoredVideo[];
  currentVideoIndex: number;
  onVideoChange: (index: number) => void;
  onLike: (video: StoredVideo) => void;
}

export interface VideoSwipeViewProps {
  videos: StoredVideo[];
  onLike: (video: StoredVideo) => void;
  onSkip: (video: StoredVideo) => void;
  onEnd: () => void;
}
