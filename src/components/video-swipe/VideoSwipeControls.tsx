
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp, Trash, ArrowRight, ArrowLeft } from 'lucide-react';
import { StoredVideo } from '@/types/video-storage';

interface VideoSwipeControlsProps {
  onLike: () => void;
  onSkip: () => void;
  onDelete?: (videoId: string) => void;
  currentVideo?: StoredVideo;
  isAdmin: boolean;
}

const VideoSwipeControls: React.FC<VideoSwipeControlsProps> = ({
  onLike,
  onSkip,
  onDelete,
  currentVideo,
  isAdmin
}) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
      <Button 
        variant="secondary" 
        size="lg"
        className="rounded-full h-14 w-14 p-0 bg-white shadow-lg"
        onClick={onSkip}
      >
        <ArrowLeft className="h-6 w-6 text-red-500" />
      </Button>
      
      <Button 
        variant="secondary" 
        size="lg"
        className="rounded-full h-14 w-14 p-0 bg-white shadow-lg"
        onClick={onLike}
      >
        <ThumbsUp className="h-6 w-6 text-green-500" />
      </Button>
      
      {isAdmin && onDelete && currentVideo && (
        <Button 
          variant="secondary" 
          size="lg"
          className="rounded-full h-14 w-14 p-0 bg-white shadow-lg"
          onClick={() => currentVideo && onDelete(currentVideo.id)}
        >
          <Trash className="h-6 w-6 text-red-500" />
        </Button>
      )}
    </div>
  );
};

export default VideoSwipeControls;
