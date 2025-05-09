
import React from 'react';
import { StoredVideo } from '@/types/video-storage';
import { Button } from '@/components/ui/button';
import { ThumbsUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoInfoOverlayProps {
  video: StoredVideo;
  onLike?: () => void;
  show: boolean;
}

const VideoInfoOverlay: React.FC<VideoInfoOverlayProps> = ({ 
  video, 
  onLike,
  show
}) => {
  if (!show) return null;

  return (
    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 text-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg md:text-xl line-clamp-1">
            {video.title || 'Sem título'}
          </h3>
          {video.description && (
            <p className="text-sm line-clamp-2 opacity-80 mt-1">
              {video.description}
            </p>
          )}
          
          {video.tags && video.tags.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-1 mt-2">
              {video.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-white/20 text-xs px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {onLike && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLike}
              className="mt-2 text-white hover:bg-white/20 p-2"
            >
              <ThumbsUp className="h-4 w-4 mr-2" /> 
              Curtir vídeo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoInfoOverlay;
