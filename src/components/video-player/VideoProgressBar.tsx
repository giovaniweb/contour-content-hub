
import React from 'react';

interface VideoProgressBarProps {
  progress: number;
  onSeek?: (position: number) => void;
}

export const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ progress, onSeek }) => {
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const position = Math.max(0, Math.min(1, clickPosition)) * 100;
    
    onSeek(position);
  };
  
  return (
    <div 
      className="absolute bottom-0 left-0 w-full h-1 bg-gray-800 cursor-pointer" 
      onClick={handleSeek}
    >
      <div 
        className="h-full bg-primary" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
};
