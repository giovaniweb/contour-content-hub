
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ThumbsUp, ThumbsDown, Share2, Download } from 'lucide-react';
import { StoredVideo } from '@/types/video-storage';
import { VideoProgressBar } from './VideoProgressBar';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { cn } from '@/lib/utils';
import { useVideoControls } from '@/hooks/use-video-controls';
import { VideoPlayerControls } from './VideoPlayerControls';
import { VideoInfoOverlay } from './VideoInfoOverlay';

interface VideoPlayerModalProps {
  video: StoredVideo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  open,
  onOpenChange,
  onNext,
  onPrevious,
  showNavigation = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    videoRef,
    isPlaying,
    progress,
    duration,
    currentTime,
    volume,
    isMuted,
    isBuffering,
    showControls,
    togglePlay,
    handleTimeUpdate,
    handleVideoEnded,
    handleLoadedMetadata,
    handleVolumeChange,
    toggleMute,
    handleSeek,
    handleVideoError,
    toggleFullscreen,
    handleContainerClick,
    isFullscreen
  } = useVideoControls();

  // Reset state when video changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Auto-play when modal opens
    if (open && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play was prevented, do nothing
      });
    }
    
    // Auto-pause when modal closes
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [video, open]);

  // Handle controls visibility
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      if (isPlaying) {
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
          if (isPlaying) {
            // This would normally update showControls state
            // but we're handling it in the useVideoControls hook now
          }
        }, 3000);
      }
    };
    
    if (open) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isPlaying, open]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "max-w-5xl w-[90vw] p-0 gap-0 overflow-hidden", 
          isFullscreen ? "fixed inset-0 w-full max-w-none h-full rounded-none" : ""
        )}
      >
        <div 
          className={cn(
            "video-player-container relative bg-black overflow-hidden",
            isFullscreen ? "h-full w-full" : "aspect-video"
          )}
          onMouseEnter={handleContainerClick}
          onMouseLeave={() => {}}
          onClick={handleContainerClick}
        >
          {/* Close button - always visible */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 bg-black/50 text-white hover:bg-black/70"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Video element */}
          <video
            ref={videoRef}
            src={video.url || video.file_urls?.original || video.file_urls?.hd || video.file_urls?.sd}
            className="w-full h-full object-contain"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            onCanPlay={() => setIsLoading(false)}
            poster={video.thumbnail_url || undefined}
            playsInline
          />
          
          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <LoadingSpinner size="lg" />
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white flex-col gap-4 p-4">
              <p className="text-lg font-medium">Erro ao carregar o vídeo</p>
              <p className="text-sm text-gray-400">{error}</p>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          )}
          
          {/* Video info overlay - visible when paused */}
          {!isPlaying && !isLoading && !error && (
            <VideoInfoOverlay
              video={video}
              isVisible={!isPlaying && showControls}
            />
          )}
          
          {/* Video controls */}
          {showControls && !error && !isLoading && (
            <VideoPlayerControls
              isPlaying={isPlaying}
              isMuted={isMuted}
              showControls={showControls}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
              onToggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
              onNext={onNext}
              onPrevious={onPrevious}
            />
          )}
          
          {/* Progress bar - always visible when not in loading/error state */}
          {!isLoading && !error && (
            <div className={cn(
              "absolute bottom-0 left-0 right-0 transition-opacity duration-300",
              showControls ? "opacity-100" : "opacity-0"
            )}>
              <VideoProgressBar
                progress={progress}
                onSeek={handleSeek}
              />
            </div>
          )}
        </div>
        
        {/* Video info and actions */}
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-medium line-clamp-2">
                {video.title || "Vídeo sem título"}
              </DialogTitle>
              {video.description && (
                <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
                  {video.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span className="hidden sm:inline">Gostei</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ThumbsDown className="h-4 w-4" />
              <span className="hidden sm:inline">Não gostei</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
            {video.downloadable !== false && (
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
