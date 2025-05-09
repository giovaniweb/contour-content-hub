
import React from 'react';
import { cn } from '@/lib/utils';

export interface VideoProgressBarProps {
  progress: number;
  onSeek?: (percent: number) => void;
}

export const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ progress, onSeek }) => {
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onSeek && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentClicked = (clickX / rect.width) * 100;
      onSeek(Math.max(0, Math.min(100, percentClicked)));
    }
  };

  return (
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
  );
};
