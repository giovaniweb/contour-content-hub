
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from 'lucide-react';
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
  onPrevious
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col justify-between p-4 transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Top controls - empty for now */}
      <div></div>
      
      {/* Center controls */}
      <div className="flex items-center justify-center gap-8">
        {/* Show previous button if navigation is enabled */}
        {onPrevious && (
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
          >
            <SkipBack className="h-6 w-6" />
          </Button>
        )}
        
        {/* Play/Pause button */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 text-white hover:bg-black/50 rounded-full h-16 w-16"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8" />
          )}
        </Button>
        
        {/* Show next button if navigation is enabled */}
        {onNext && (
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <SkipForward className="h-6 w-6" />
          </Button>
        )}
      </div>
      
      {/* Bottom controls */}
      <div className="flex justify-between items-center">
        {/* Mute/Unmute button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-black/20"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
        
        {/* Fullscreen button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-black/20"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFullscreen();
          }}
        >
          <Maximize className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
