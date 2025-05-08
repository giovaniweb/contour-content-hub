
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoStatusBadge from './VideoStatusBadge';
import { VideoCardBaseProps } from './types';

interface VideoCardThumbnailProps extends VideoCardBaseProps {
  onReprocess?: () => void;
  isReprocessing?: boolean;
}

const VideoCardThumbnail: React.FC<VideoCardThumbnailProps> = ({ 
  video, 
  processingTimeout = false, 
  onReprocess,
  isReprocessing = false 
}) => {
  const isProcessing = video.status === 'processing' || video.status === 'uploading';

  return (
    <div className="relative aspect-video">
      {video.thumbnail_url ? (
        <img 
          src={video.thumbnail_url} 
          alt={video.title} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          {isProcessing ? (
            <div className="text-center">
              <div className="flex justify-center">
                {processingTimeout ? (
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                ) : (
                  <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              <p className="mt-2 text-sm font-medium">Processando</p>
              {processingTimeout && (
                <p className="text-xs text-amber-500">Demorando mais que o normal</p>
              )}
              {processingTimeout && onReprocess && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  onClick={onReprocess}
                  disabled={isReprocessing}
                >
                  {isReprocessing ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Reprocessando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" /> Tentar novamente
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">Sem miniatura</span>
          )}
        </div>
      )}
      
      <div className="absolute top-2 right-2">
        <VideoStatusBadge 
          status={video.status} 
          timeout={processingTimeout}
        />
      </div>
    </div>
  );
};

export default VideoCardThumbnail;
