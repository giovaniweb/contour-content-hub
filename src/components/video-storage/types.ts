
import { StoredVideo } from '@/types/video-storage';

export interface VideoCardBaseProps {
  video: StoredVideo;
  processingTimeout?: boolean;
  timeSinceUpload: string;
}

export interface VideoCardProps extends VideoCardBaseProps {
  onRefresh: () => void;
  onDownload: () => void;
  onReprocess?: () => void;
  isReprocessing?: boolean;
}
