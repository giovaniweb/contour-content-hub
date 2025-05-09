
import React from 'react';
import { StoredVideo } from '@/types/video-storage';

export interface VideoInfoOverlayProps {
  video: StoredVideo;
  isVisible?: boolean;
}

export const VideoInfoOverlay: React.FC<VideoInfoOverlayProps> = ({ 
  video,
  isVisible = true
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
      <div className="space-y-2">
        <h3 className="text-white text-xl font-medium drop-shadow-md line-clamp-2">
          {video.title || "Sem título"}
        </h3>
        
        {video.description && (
          <p className="text-gray-200 text-sm drop-shadow-md line-clamp-3">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
};
