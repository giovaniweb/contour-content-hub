
import React from 'react';
import { cn } from '@/lib/utils';

export interface VideoProgressBarProps {
  progress: number;
  currentTime?: number;
  duration?: number;
  onSeek?: (percent: number) => void;
}

export const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ 
  progress, 
  currentTime, 
  duration, 
  onSeek 
}) => {
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onSeek && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentClicked = (clickX / rect.width) * 100;
      onSeek(Math.max(0, Math.min(100, percentClicked)));
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <div 
        className="w-full h-1 bg-gray-600 cursor-pointer group" 
        onClick={handleProgressClick}
        ref={progressBarRef}
      >
        <div 
          className="h-full bg-red-500 relative group-hover:h-2 transition-all duration-150"
          style={{ width: `${progress}%` }}
        >
          <div className={cn(
            "absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100",
            progress > 98 ? "-right-1.5" : ""
          )} />
        </div>
      </div>
      
      {currentTime !== undefined && duration !== undefined && (
        <div className="flex justify-between text-xs text-white mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};

// Export as default also for backward compatibility
export default VideoProgressBar;
