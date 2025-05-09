
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { StoredVideo } from '@/types/video-storage';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import VideoInfoOverlay from './VideoInfoOverlay';
import { VideoPlayerControls } from './VideoPlayerControls';

interface VideoPlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: StoredVideo | null;
  autoPlay?: boolean;
  onLike?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex?: number;
  totalVideos?: number;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  open,
  onOpenChange,
  video,
  autoPlay = true,
  onLike,
  onNext,
  onPrevious,
  currentIndex,
  totalVideos
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Timer for hiding controls
  const controlsTimerRef = useRef<number | null>(null);
  
  // Reset state when video changes
  useEffect(() => {
    if (open && videoRef.current) {
      setIsLoading(true);
      setProgress(0);
      
      if (autoPlay) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
      
      // Show controls initially
      setShowControls(true);
      startControlsTimer();
    }
  }, [open, video, autoPlay]);
  
  // Set up event listeners for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  
  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (controlsTimerRef.current !== null) {
        window.clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);
  
  const startControlsTimer = () => {
    if (controlsTimerRef.current !== null) {
      window.clearTimeout(controlsTimerRef.current);
    }
    
    if (isPlaying) {
      controlsTimerRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isNaN(progress) ? 0 : progress);
    }
  };
  
  const handleLoadedData = () => {
    setIsLoading(false);
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          console.error('Playback failed');
        });
      }
      setIsPlaying(!isPlaying);
    }
    
    // Reset controls timer
    setShowControls(true);
    startControlsTimer();
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
    
    // Reset controls timer
    setShowControls(true);
    startControlsTimer();
  };
  
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    
    // Reset controls timer
    setShowControls(true);
    startControlsTimer();
  };
  
  const handleContainerClick = () => {
    setShowControls(!showControls);
    if (showControls) {
      if (controlsTimerRef.current !== null) {
        window.clearTimeout(controlsTimerRef.current);
        controlsTimerRef.current = null;
      }
    } else {
      startControlsTimer();
    }
  };
  
  const handleSeek = (percent: number) => {
    if (videoRef.current) {
      const seekTime = (percent / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
    }
    
    // Reset controls timer
    setShowControls(true);
    startControlsTimer();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "p-0 max-w-5xl w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
        isFullscreen ? "fixed inset-0 z-50 max-w-none max-h-none w-screen h-screen" : ""
      )}>
        <div 
          ref={containerRef}
          className={cn(
            "relative w-full h-full bg-black overflow-hidden",
            isFullscreen ? "aspect-auto" : "aspect-video"
          )}
          onClick={handleContainerClick}
        >
          {isLoading && video && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          
          {video ? (
            <video
              ref={videoRef}
              src={video.file_urls?.original || video.file_urls?.hd || video.file_urls?.sd}
              className="w-full h-full"
              autoPlay={autoPlay}
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedData={handleLoadedData}
              onEnded={() => {
                if (onNext) {
                  onNext();
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-white">Nenhum vídeo selecionado</p>
            </div>
          )}
          
          {!isLoading && video && (
            <>
              <VideoInfoOverlay 
                video={video} 
                onLike={onLike} 
                show={showControls} 
              />
              
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
                currentVideo={currentIndex}
                totalVideos={totalVideos}
                duration={videoRef.current?.duration}
                currentTime={videoRef.current?.currentTime}
                onSeek={handleSeek}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
