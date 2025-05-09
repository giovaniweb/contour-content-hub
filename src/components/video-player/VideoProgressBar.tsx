
import React from 'react';

interface VideoProgressBarProps {
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
  const formatTime = (timeInSeconds?: number) => {
    if (timeInSeconds == null) return '00:00';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(percent);
  };
  
  return (
    <div className="w-full">
      <div 
        className="h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <div 
          className="h-full bg-white" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {currentTime != null && duration != null && (
        <div className="flex justify-between text-xs text-white mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};
