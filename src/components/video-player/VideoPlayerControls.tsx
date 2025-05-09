
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack, 
  SkipForward 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VideoPlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  showControls: boolean;
  isFullscreen?: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying,
  isMuted,
  showControls,
  isFullscreen = false,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onNext,
  onPrevious,
}) => {
  return (
    <div className={cn(
      "absolute bottom-12 left-0 right-0 p-4 transition-opacity duration-300",
      showControls ? "opacity-100" : "opacity-0",
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/70 text-white hover:bg-black/90"
            onClick={onTogglePlay}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/70 text-white hover:bg-black/90"
            onClick={onToggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {onPrevious && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/70 text-white hover:bg-black/90"
              onClick={onPrevious}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
          )}
          
          {onNext && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/70 text-white hover:bg-black/90"
              onClick={onNext}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/70 text-white hover:bg-black/90"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
