
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize, 
  ThumbsUp, X
} from 'lucide-react';

export interface VideoPlayerControlsProps {
  isPlaying?: boolean;
  isMuted?: boolean;
  progress?: number;
  volume?: number;
  duration?: number;
  currentTime?: number;
  isBuffering?: boolean;
  showControls?: boolean;
  currentVideo?: number;
  totalVideos?: number;
  onTogglePlay?: () => void;
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  onSeek?: (position: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onToggleFullscreen?: () => void;
  onLike?: () => void;
  onClose?: () => void;
  className?: string;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying = false,
  isMuted = false,
  progress = 0,
  volume = 1,
  duration = 0,
  currentTime = 0,
  isBuffering = false,
  showControls = true,
  currentVideo = 0,
  totalVideos = 0,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onSeek,
  onNext,
  onPrevious,
  onToggleFullscreen,
  onLike,
  onClose,
  className
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!showControls) return null;

  return (
    <div className={cn(
      "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transition-opacity",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 p-1 h-auto w-auto" 
            onClick={onTogglePlay}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          {totalVideos > 1 && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20 p-1 h-auto w-auto" 
                onClick={onPrevious}
                disabled={currentVideo === 0}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20 p-1 h-auto w-auto" 
                onClick={onNext}
                disabled={currentVideo === totalVideos - 1}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              
              {totalVideos > 0 && (
                <span className="text-xs">
                  {currentVideo + 1}/{totalVideos}
                </span>
              )}
            </>
          )}
          
          <span className="text-xs ml-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {onLike && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 p-1 h-auto w-auto" 
              onClick={onLike}
            >
              <ThumbsUp className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 p-1 h-auto w-auto" 
            onClick={onToggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          
          {onVolumeChange && !isMuted && (
            <div className="w-20">
              <Slider 
                value={[volume * 100]} 
                min={0} 
                max={100}
                step={1}
                onValueChange={(values) => onVolumeChange(values[0] / 100)}
                className="h-1"
              />
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 p-1 h-auto w-auto" 
            onClick={onToggleFullscreen}
          >
            <Maximize className="h-5 w-5" />
          </Button>
          
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 p-1 h-auto w-auto" 
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      {onSeek && (
        <div className="mt-2">
          <Slider
            value={[progress]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={(values) => onSeek(values[0])}
            className="h-1"
          />
        </div>
      )}
    </div>
  );
};
