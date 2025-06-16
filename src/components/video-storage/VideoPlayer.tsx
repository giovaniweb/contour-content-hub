
import React from 'react';
import { Video } from '@/services/videoStorage/videoService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface VideoPlayerProps {
  video: Video;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, open, onOpenChange }) => {
  // Get video source URL - CORRIGIDO para usar a interface Video correta
  const videoUrl = video.url_video || video.preview_url;
  const videoTitle = video.titulo || 'Video Player';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{videoTitle}</DialogTitle>
          {video.descricao_curta && (
            <DialogDescription>
              {video.descricao_curta}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="aspect-video w-full bg-black overflow-hidden rounded-md">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls
              className="w-full h-full object-contain"
              poster={video.thumbnail_url}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-lg mb-2">No video source available</div>
                <div className="text-sm opacity-70">
                  URL: {video.url_video || 'Não disponível'}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Informações adicionais do vídeo */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {video.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
