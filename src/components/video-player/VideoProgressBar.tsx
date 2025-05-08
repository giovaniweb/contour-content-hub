
import React from 'react';

interface VideoProgressBarProps {
  progress: number;
}

export const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ progress }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
      <div 
        className="h-full bg-primary" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
};
