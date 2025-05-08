
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

interface VideoPlayerActionButtonsProps {
  onSkip: () => void;
  onLike: () => void;
}

export const VideoPlayerActionButtons: React.FC<VideoPlayerActionButtonsProps> = ({ onSkip, onLike }) => {
  return (
    <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-4 z-10">
      <Button 
        variant="secondary" 
        size="lg"
        className="rounded-full h-14 w-14 p-0 bg-white shadow-lg"
        onClick={onSkip}
      >
        <ThumbsDown className="h-6 w-6 text-red-500" />
      </Button>
      
      <Button 
        variant="secondary" 
        size="lg"
        className="rounded-full h-14 w-14 p-0 bg-white shadow-lg"
        onClick={onLike}
      >
        <ThumbsUp className="h-6 w-6 text-green-500" />
      </Button>
    </div>
  );
};
