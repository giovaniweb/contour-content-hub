
import React, { useRef } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { StoredVideo } from '@/types/video-storage';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useVideoSwipePlayer } from '@/hooks/use-video-swipe-player';
import { VideoPlayerControls } from '@/components/video-player/VideoPlayerControls';
import { VideoPlayerActionButtons } from '@/components/video-player/VideoPlayerActionButtons';
import { VideoInfoOverlay } from '@/components/video-player/VideoInfoOverlay';
import { VideoProgressBar } from '@/components/video-player/VideoProgressBar';

interface VideoSwipeViewerProps {
  videos: StoredVideo[];
  onLike?: (video: StoredVideo) => void;
  onSkip?: (video: StoredVideo) => void;
  onEnd?: () => void;
  className?: string;
}

const VideoSwipeViewer: React.FC<VideoSwipeViewerProps> = ({
  videos,
  onLike,
  onSkip,
  onEnd,
  className
}) => {
  const isMobile = useIsMobile();
  const controls = useAnimation();
  
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
  } = useVideoSwipePlayer(videos, { onLike, onSkip, onEnd });
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100; // minimum distance to trigger swipe
    
    if (info.offset.x < -threshold) {
      // Swiped left - Skip
      handleSkip();
    } else if (info.offset.x > threshold) {
      // Swiped right - Like
      handleLike();
    } else {
      // Not enough swipe - reset position
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.2 }
      });
    }
  };
  
  if (!videos.length) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-screen bg-black", className)}>
        <p className="text-white text-xl">Nenhum vídeo disponível</p>
      </div>
    );
  }
  
  if (!currentVideo) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-screen bg-black", className)}>
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }
  
  const videoUrl = currentVideo.file_urls?.original || 
                   currentVideo.file_urls?.hd || 
                   currentVideo.file_urls?.sd;
  
  if (!videoUrl) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-screen bg-black", className)}>
        <p className="text-white text-xl">URL do vídeo não encontrada</p>
      </div>
    );
  }
  
  return (
    <div 
      className={cn("relative h-full w-full bg-black overflow-hidden", className)}
      onClick={handleContainerClick}
    >
      <motion.div
        className="absolute w-full h-full"
        animate={controls}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => isPlaying}
          onPause={() => !isPlaying}
          onEnded={handleVideoEnded}
          muted={isMuted}
          playsInline
          onClick={togglePlay}
        />
        
        {/* Video Information Overlay */}
        <VideoInfoOverlay video={currentVideo} />
        
        {/* Video Progress Bar */}
        <VideoProgressBar progress={progress} />
        
        {/* Video Controls */}
        <VideoPlayerControls 
          isPlaying={isPlaying}
          isMuted={isMuted}
          showControls={showControls}
          currentVideo={currentIndex}
          totalVideos={videos.length}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
        />
      </motion.div>
      
      {/* Action Buttons */}
      <VideoPlayerActionButtons 
        onSkip={handleSkip}
        onLike={handleLike}
      />
    </div>
  );
};

export default VideoSwipeViewer;
