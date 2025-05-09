
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from 'lucide-react';
import { VideoProgressBar } from './VideoProgressBar';

export interface VideoPlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  showControls: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  isFullscreen?: boolean;
  duration?: number;
  currentTime?: number;
  onSeek?: (time: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentVideo?: number;
  totalVideos?: number;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying,
  isMuted,
  showControls,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  isFullscreen = false,
  duration,
  currentTime,
  onSeek,
  onNext,
  onPrevious,
  currentVideo,
  totalVideos
}) => {
  if (!showControls) return null;
  
  return (
    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4">
      {/* Optional Progress Bar */}
      {typeof currentTime !== 'undefined' && typeof duration !== 'undefined' && onSeek && (
        <VideoProgressBar
          currentTime={currentTime}
          duration={duration}
          progress={(currentTime / duration) * 100}
          onSeek={(percent) => onSeek((percent / 100) * duration)}
        />
      )}
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={onTogglePlay}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={onToggleMute}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          
          {/* Navigation controls for swipe viewer */}
          {onPrevious && onNext && (
            <div className="flex items-center space-x-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={onPrevious}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              {currentVideo !== undefined && totalVideos !== undefined && (
                <span className="text-xs text-white">
                  {currentVideo + 1}/{totalVideos}
                </span>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={onNext}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
        
        <div>
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

// Export as default for backward compatibility
export default VideoPlayerControls;
