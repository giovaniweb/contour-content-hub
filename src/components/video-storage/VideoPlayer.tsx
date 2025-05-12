
import React from 'react';
import { StoredVideo } from '@/types/video-storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface VideoPlayerProps {
  video: StoredVideo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, open, onOpenChange }) => {
  // Get video source URL
  const videoUrl = video.file_urls?.original || 
                  video.file_urls?.hd || 
                  video.file_urls?.sd || 
                  video.file_urls?.web_optimized;
  
  const videoTitle = video.title || 'Video Player';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{videoTitle}</DialogTitle>
          {video.description && (
            <DialogDescription>
              {video.description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="aspect-video w-full bg-black overflow-hidden rounded-md">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              No video source available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
