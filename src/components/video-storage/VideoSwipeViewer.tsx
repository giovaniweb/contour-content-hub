
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { StoredVideo } from '@/types/video-storage';
import { VideoPlayerControls } from '@/components/video-player/VideoPlayerControls';

interface VideoSwipeViewerProps {
  videos: StoredVideo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const VideoSwipeViewer: React.FC<VideoSwipeViewerProps> = ({
  videos,
  currentIndex,
  onClose,
  onNext,
  onPrevious
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentVideo = videos[currentIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoRef.current.addEventListener('play', () => setIsPlaying(true));
      videoRef.current.addEventListener('pause', () => setIsPlaying(false));
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [videoRef.current]);
  
  useEffect(() => {
    resetControlsTimeout();
    if (videoRef.current) {
      setIsPlaying(false);
    }
  }, [currentIndex]);
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };
  
  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  const handleSeek = (percent: number) => {
    if (videoRef.current && duration) {
      const seekTime = duration * percent;
      videoRef.current.currentTime = seekTime;
    }
  };
  
  const resetControlsTimeout = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };
  
  const handleMouseMove = () => {
    resetControlsTimeout();
  };
  
  const videoUrl = currentVideo?.file_urls?.web_optimized || '';
  
  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      <div className="flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
        <h3 className="text-white text-lg font-medium truncate">{currentVideo?.title}</h3>
        <Button 
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        {videoUrl ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              onClick={handleTogglePlay}
              playsInline
              autoPlay={false}
            />
            
            <VideoPlayerControls 
              isPlaying={isPlaying}
              isMuted={isMuted}
              showControls={showControls}
              isFullscreen={isFullscreen}
              duration={duration}
              currentTime={currentTime}
              onTogglePlay={handleTogglePlay}
              onToggleMute={handleToggleMute}
              onToggleFullscreen={handleToggleFullscreen}
              onNext={onNext}
              onPrevious={onPrevious}
              onSeek={handleSeek}
              currentVideo={currentIndex}
              totalVideos={videos.length}
            />
          </div>
        ) : (
          <Card className="w-full max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <p>O vídeo não pode ser carregado. URL inválida ou acesso restrito.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VideoSwipeViewer;
