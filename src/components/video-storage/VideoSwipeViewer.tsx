
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Heart, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { StoredVideo } from '@/types/video-storage';

export interface VideoSwipeViewerProps {
  videos: StoredVideo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  customHandlers?: {
    onLike?: (video: StoredVideo) => void;
    onSkip?: (video: StoredVideo) => void;
  };
}

const VideoSwipeViewer: React.FC<VideoSwipeViewerProps> = ({
  videos,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
  customHandlers
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Reset loading state when video changes
  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);
  
  // Handle like action
  const handleLike = () => {
    if (customHandlers?.onLike && currentIndex < videos.length) {
      customHandlers.onLike(videos[currentIndex]);
      onNext(); // Auto advance after liking
    }
  };
  
  // Handle skip action
  const handleSkip = () => {
    if (customHandlers?.onSkip && currentIndex < videos.length) {
      customHandlers.onSkip(videos[currentIndex]);
      onNext(); // Auto advance after skipping
    } else {
      onNext(); // Just advance if no skip handler
    }
  };
  
  // Handle video loaded
  const handleVideoLoaded = () => {
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
  };
  
  // Get current video
  const currentVideo = videos[currentIndex];
  
  if (!currentVideo) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        <p>Nenhum vídeo disponível</p>
      </div>
    );
  }
  
  // Extract video URL safely from file_urls
  const getVideoUrl = (video: StoredVideo): string => {
    if (!video.file_urls) return '';
    
    // Handle both string and object formats
    if (typeof video.file_urls === 'object') {
      // Updated to handle the case where web_optimized doesn't exist
      const fileUrls = video.file_urls as Record<string, string>;
      return fileUrls.web_optimized || fileUrls.hd || fileUrls.original || fileUrls.sd || '';
    }
    
    return '';
  };
  
  return (
    <div className="relative h-full w-full bg-black flex flex-col">
      {/* Video Container */}
      <div className="relative flex-grow overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        )}
        
        <video
          ref={videoRef}
          src={getVideoUrl(currentVideo)}
          className="w-full h-full object-contain"
          controls
          playsInline
          onLoadedData={handleVideoLoaded}
          onError={() => setIsLoading(false)} // Handle errors
        />
      </div>
      
      {/* Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
        <Button variant="ghost" size="icon" className="text-white bg-black/50 rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        
        <div className="flex space-x-2">
          {currentIndex > 0 && (
            <Button variant="ghost" size="icon" className="text-white bg-black/50 rounded-full" onClick={onPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {currentIndex < videos.length - 1 && (
            <Button variant="ghost" size="icon" className="text-white bg-black/50 rounded-full" onClick={onNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Video Info and Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white font-medium text-lg">{currentVideo.title}</h3>
        <p className="text-white/80 text-sm mb-4">{currentVideo.description}</p>
        
        {/* Action Buttons - Only show like/skip if handlers exist */}
        {(customHandlers?.onLike || customHandlers?.onSkip) && (
          <div className="flex justify-center space-x-4">
            {customHandlers.onSkip && (
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={handleSkip}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Pular
              </Button>
            )}
            {customHandlers.onLike && (
              <Button 
                variant="default"
                className="bg-pink-500 hover:bg-pink-600 text-white"
                onClick={handleLike}
              >
                <Heart className="mr-2 h-4 w-4" />
                Curtir
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSwipeViewer;
