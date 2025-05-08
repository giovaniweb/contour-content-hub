
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { VideoStatus } from '@/types/video-storage';
import { Loader, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoStatusBadgeProps {
  status: VideoStatus;
  className?: string;
  timeout?: boolean;
}

const VideoStatusBadge: React.FC<VideoStatusBadgeProps> = ({ 
  status, 
  className,
  timeout = false
}) => {
  switch (status) {
    case 'uploading':
      return (
        <Badge variant="outline" className={cn("bg-muted text-muted-foreground", className)}>
          <Loader className="h-3 w-3 mr-1 animate-spin" /> 
          {timeout ? "Upload demorado" : "Enviando"}
        </Badge>
      );
    
    case 'processing':
      return (
        <Badge variant={timeout ? "destructive" : "secondary"} className={className}>
          {timeout ? (
            <AlertTriangle className="h-3 w-3 mr-1" />
          ) : (
            <Loader className="h-3 w-3 mr-1 animate-spin" />
          )}
          {timeout ? "Processamento lento" : "Processando"}
        </Badge>
      );
    
    case 'ready':
      return (
        <Badge variant="default" className={className}>
          <CheckCircle className="h-3 w-3 mr-1" />
          Pronto
        </Badge>
      );
    
    case 'error':
      return (
        <Badge variant="destructive" className={className}>
          <AlertCircle className="h-3 w-3 mr-1" />
          Erro
        </Badge>
      );
    
    default:
      return null;
  }
};

export default VideoStatusBadge;
