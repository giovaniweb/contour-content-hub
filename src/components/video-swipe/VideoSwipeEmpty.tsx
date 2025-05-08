
import React from 'react';
import { Button } from '@/components/ui/button';

interface VideoSwipeEmptyProps {
  onRefresh: () => void;
}

const VideoSwipeEmpty: React.FC<VideoSwipeEmptyProps> = ({ onRefresh }) => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground text-lg">Nenhum vídeo disponível no momento.</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onRefresh}
      >
        Tentar novamente
      </Button>
    </div>
  );
};

export default VideoSwipeEmpty;
