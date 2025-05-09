
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThumbsUp, X } from 'lucide-react';
import { StoredVideo } from '@/types/video-storage';
import { useVideoSwipePlayer } from '@/hooks/use-video-swipe-player';
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
                  currentVideo={currentIndex}
                  totalVideos={videos.length}
                  onTogglePlay={togglePlay}
                  onToggleMute={toggleMute}
                  onToggleFullscreen={toggleFullscreen}
                  onNext={() => handleSkip(currentVideo)}
                  onPrevious={() => {
                    if (currentIndex > 0) {
                      // Logic to go to previous video would be here
                    }
                  }}
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
