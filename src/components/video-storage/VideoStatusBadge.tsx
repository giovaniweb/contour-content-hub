
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { VideoStatus } from '@/types/video-storage';
import { Loader } from 'lucide-react';

interface VideoStatusBadgeProps {
  status: VideoStatus;
  className?: string;
}

const VideoStatusBadge: React.FC<VideoStatusBadgeProps> = ({ status, className }) => {
  switch (status) {
    case 'uploading':
      return (
        <Badge variant="secondary" className={className}>
          <Loader className="h-3 w-3 mr-1 animate-spin" /> Enviando
        </Badge>
      );
    
    case 'processing':
      return (
        <Badge variant="secondary" className={className}>
          <Loader className="h-3 w-3 mr-1 animate-spin" /> Processando
        </Badge>
      );
    
    case 'ready':
      return (
        <Badge variant="default" className={className}>
          Pronto
        </Badge>
      );
    
    case 'error':
      return (
        <Badge variant="destructive" className={className}>
          Erro
        </Badge>
      );
    
    default:
      return null;
  }
};

export default VideoStatusBadge;
