
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { VideoCardBaseProps } from './types';
import { usePermissions } from '@/hooks/use-permissions';

const VideoCardContent: React.FC<VideoCardBaseProps> = ({ 
  video, 
  processingTimeout,
  timeSinceUpload 
}) => {
  const { isAdmin } = usePermissions();

  return (
    <CardContent className="flex-grow p-4">
      <div className="mb-1 flex justify-between items-start">
        <h3 className="font-medium line-clamp-2" title={video.title}>{video.title}</h3>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2">
        {timeSinceUpload} 
      </div>
      
      {/* Equipment Name - Destacado */}
      {video.metadata?.equipment_id && (
        <div className="mb-2">
          <span className="text-cyan-400 text-sm font-semibold">
            {video.metadata.equipment_id}
          </span>
        </div>
      )}
      
      {video.description && (
        <p className="text-sm text-muted-foreground line-clamp-2" title={video.description}>
          {video.description}
        </p>
      )}
      
      {video.tags && video.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {video.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              {tag}
            </span>
          ))}
          {video.tags.length > 3 && (
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold text-muted-foreground">
              +{video.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Informações de debug para administradores */}
      {isAdmin() && processingTimeout && (
        <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
          <p>Status: {video.status}</p>
          <p>Arquivo: {Boolean(video.file_urls?.original) ? "✅" : "❌"}</p>
          {video.metadata?.processing_progress && (
            <p>Progresso: {typeof video.metadata.processing_progress === 'string' ? video.metadata.processing_progress : JSON.stringify(video.metadata.processing_progress)}</p>
          )}
        </div>
      )}
    </CardContent>
  );
};

export default VideoCardContent;
