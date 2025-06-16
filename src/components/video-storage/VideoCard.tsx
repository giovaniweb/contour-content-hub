
import React from 'react';
import { Play, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import VideoActionMenu from './VideoActionMenu';

interface Video {
  id: string;
  titulo: string;
  data_upload: string;
  downloads_count?: number;
  url_video?: string;
  thumbnail_url?: string;
}

interface VideoCardProps {
  video: Video;
  viewMode: 'grid' | 'list';
  onPlay: (video: Video) => void;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
  onDownload: (video: Video) => void;
  onStatistics: (video: Video) => void;
  onCopyLink: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  viewMode,
  onPlay,
  onEdit,
  onDelete,
  onDownload,
  onStatistics,
  onCopyLink
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <div className="relative w-24 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
              {video.thumbnail_url ? (
                <img 
                  src={video.thumbnail_url} 
                  alt={video.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <Play className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              {/* Download count */}
              <div className="absolute top-1 left-1">
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  {video.downloads_count || 0}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm mb-1 truncate">{video.titulo}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(video.data_upload)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <VideoActionMenu
                video={video}
                onEdit={() => onEdit(video)}
                onDelete={() => onDelete(video)}
                onDownload={() => onDownload(video)}
                onStatistics={() => onStatistics(video)}
                onCopyLink={() => onCopyLink(video)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {video.thumbnail_url ? (
          <img 
            src={video.thumbnail_url} 
            alt={video.titulo}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onPlay(video)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 cursor-pointer" onClick={() => onPlay(video)}>
            <Play className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        {/* Download count */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {video.downloads_count || 0}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3">
        {/* Título */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{video.titulo}</h3>

        {/* Data e Ações */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(video.data_upload)}</span>
          </div>
          
          <VideoActionMenu
            video={video}
            onEdit={() => onEdit(video)}
            onDelete={() => onDelete(video)}
            onDownload={() => onDownload(video)}
            onStatistics={() => onStatistics(video)}
            onCopyLink={() => onCopyLink(video)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
