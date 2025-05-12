
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader, AlertCircle, Check, Upload } from 'lucide-react';

interface VideoStatusBadgeProps {
  status?: string;
  className?: string;
  timeout?: boolean;
}

const VideoStatusBadge: React.FC<VideoStatusBadgeProps> = ({ 
  status, 
  className = "",
  timeout = false
}) => {
  const getVariantAndIcon = () => {
    if (timeout && status === 'processing') {
      return {
        variant: 'destructive',
        label: 'Stuck',
        icon: <AlertCircle className="h-3 w-3 mr-1" />
      };
    }
    
    switch(status) {
      case 'ready':
        return {
          variant: 'success',
          label: 'Ready',
          icon: <Check className="h-3 w-3 mr-1" />
        };
      case 'processing':
        return {
          variant: 'default',
          label: 'Processing',
          icon: <Loader className="h-3 w-3 mr-1 animate-spin" />
        };
      case 'uploading':
        return {
          variant: 'secondary',
          label: 'Uploading',
          icon: <Upload className="h-3 w-3 mr-1" />
        };
      case 'error':
      case 'failed':
        return {
          variant: 'destructive',
          label: 'Error',
          icon: <AlertCircle className="h-3 w-3 mr-1" />
        };
      default:
        return {
          variant: 'outline',
          label: status || 'Unknown',
          icon: null
        };
    }
  };
  
  const { variant, label, icon } = getVariantAndIcon();

  return (
    <Badge 
      variant={variant as any} 
      className={`flex items-center ${className}`}
    >
      {icon}
      {label}
    </Badge>
  );
};

export default VideoStatusBadge;
