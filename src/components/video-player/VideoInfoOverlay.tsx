
import React from 'react';
import { StoredVideo } from '@/types/video-storage';
import { cn } from '@/lib/utils';

interface VideoInfoOverlayProps {
  video: StoredVideo;
  isVisible?: boolean;
}

export const VideoInfoOverlay: React.FC<VideoInfoOverlayProps> = ({ video, isVisible = true }) => {
  return (
    <div className={cn(
      "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      <h3 className="text-white text-xl font-bold">{video.title}</h3>
      {video.description && (
        <p className="text-white/80 line-clamp-2">{video.description}</p>
      )}
    </div>
  );
};
