
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume?: number;
  currentTime?: number;
  duration?: number;
  progress?: number;
  isBuffering?: boolean;
  showControls?: boolean;
  isFullscreen?: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onVolumeChange?: (volume: number) => void;
  onSeek?: (position: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying,
  isMuted,
  showControls = true,
  isFullscreen = false,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onNext,
  onPrevious
}) => {
  return (
    <div className={cn(
      "absolute top-0 left-0 right-0 bottom-0 transition-opacity duration-300",
      showControls ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onToggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onToggleFullscreen}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {onPrevious && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          {onNext && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Center play/pause button */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white bg-black/30 rounded-full w-16 h-16 hover:bg-black/50"
          onClick={onTogglePlay}
        >
          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
        </Button>
      </div>
    </div>
  );
};
