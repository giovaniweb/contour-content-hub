import React, { useState, useRef, useEffect } from 'react';
import { StoredVideo } from '@/types/video-storage';
import { cn } from '@/lib/utils';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoPlayerControls } from '@/components/video-player/VideoPlayerControls';

interface VideoSwipeViewerProps {
  videos: StoredVideo[];
  onLike?: (video: StoredVideo) => void;
  onSkip?: (video: StoredVideo) => void;
  onEnd?: () => void;
}

const VideoSwipeViewer: React.FC<VideoSwipeViewerProps> = ({ 
  videos, 
  onLike, 
  onSkip,
  onEnd
}) => {
  const {
    currentIndex,
    currentVideo,
    isPlaying,
    isMuted,
    progress,
    showControls,
    videoRef,
    containerRef,
    handleTimeUpdate,
    handleVideoEnded,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    handleLike,
    handleSkip,
    handleContainerClick
  } = useVideoSwipePlayer(videos, {
    onLike,
    onSkip,
    onEnd,
    autoPlay: true
  });

  if (!videos.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p>Nenhum vídeo disponível.</p>
      </div>
    );
  }

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    
    // Need to update the isFullscreen state based on document.fullscreenElement
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative bg-black">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            onClick={index === currentIndex ? handleContainerClick : undefined}
          >
            <div className="relative w-full h-full">
              <video
                ref={index === currentIndex ? videoRef : undefined}
                src={video.file_urls?.original || video.file_urls?.hd || video.file_urls?.sd}
                className="w-full h-full object-contain"
                poster={video.thumbnail_url}
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
              />
              
              {index === currentIndex && (
                <VideoPlayerControls 
                  isPlaying={isPlaying}
                  isMuted={isMuted}
                  showControls={showControls}
                  isFullscreen={isFullscreen}
                  onTogglePlay={handleTogglePlay}
                  onToggleMute={handleToggleMute}
                  onToggleFullscreen={handleToggleFullscreen}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {currentVideo && (
        <Card className="p-4 mt-4">
          <h2 className="font-bold text-xl">{currentVideo.title}</h2>
          <p className="text-muted-foreground mt-1">{currentVideo.description || "Sem descrição."}</p>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="default" 
              onClick={() => handleLike(currentVideo)}
              className="flex-1"
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Curtir
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleSkip(currentVideo)}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Pular
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VideoSwipeViewer;
