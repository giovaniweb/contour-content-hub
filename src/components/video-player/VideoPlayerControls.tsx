
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from 'lucide-react';
import { VideoProgressBar } from './VideoProgressBar';

export interface VideoPlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  showControls: boolean;
  isFullscreen: boolean;
  duration?: number;
  currentTime?: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSeek?: (percent: number) => void;
  currentVideo?: number;
  totalVideos?: number;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({ 
  isPlaying,
  isMuted,
  showControls,
  isFullscreen,
  duration,
  currentTime,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onNext,
  onPrevious,
  onSeek,
  currentVideo,
  totalVideos
}) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
      <VideoProgressBar 
        progress={(currentTime && duration) ? (currentTime / duration) * 100 : 0}
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          {onPrevious && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={onPrevious}
              disabled={!onPrevious || (currentVideo !== undefined && currentVideo <= 0)}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={onTogglePlay}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </Button>
          
          {onNext && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={onNext}
              disabled={!onNext || (currentVideo !== undefined && totalVideos !== undefined && currentVideo >= totalVideos - 1)}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          )}
          
          {currentVideo !== undefined && totalVideos !== undefined && totalVideos > 0 && (
            <span className="text-xs text-white/80">
              {currentVideo + 1}/{totalVideos}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={onToggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={onToggleFullscreen}
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
