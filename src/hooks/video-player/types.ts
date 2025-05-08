
import { StoredVideo } from '@/types/video-storage';

export interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  showControls: boolean;
}

export interface VideoPlayerOptions {
  onLike?: (video: StoredVideo) => void;
  onSkip?: (video: StoredVideo) => void;
  onEnd?: () => void;
  initialVideo?: StoredVideo;
  autoPlay?: boolean;
}
