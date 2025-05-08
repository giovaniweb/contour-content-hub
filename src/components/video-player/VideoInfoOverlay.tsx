
import React from 'react';
import { StoredVideo } from '@/types/video-storage';

interface VideoInfoOverlayProps {
  video: StoredVideo;
}

export const VideoInfoOverlay: React.FC<VideoInfoOverlayProps> = ({ video }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
      <h3 className="text-white text-xl font-bold">{video.title}</h3>
      {video.description && (
        <p className="text-white/80 line-clamp-2">{video.description}</p>
      )}
    </div>
  );
};
