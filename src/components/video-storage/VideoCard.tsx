
import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Loader, 
  AlertTriangle
} from 'lucide-react';
import { StoredVideo } from '@/types/video-storage';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VideoStatusBadge from '@/components/video-storage/VideoStatusBadge';
import VideoPlayer from '@/components/video-storage/VideoPlayer';
import VideoEditDialog from '@/components/video-storage/VideoEditDialog';
import { formatFileSize } from '@/utils/format';

interface VideoCardProps {
  video: StoredVideo;
  onRefresh: () => void;
  onDownload?: () => void;
  processingTimeout?: boolean;
  timeSinceUpload?: string;
  onReprocess?: () => void;
  isReprocessing?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onRefresh,
  onDownload,
  processingTimeout = false,
  timeSinceUpload,
  onReprocess,
  isReprocessing = false
}) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Format duration if available
  const formattedDuration = video.duration || "Unknown";
  
  // Format file size
  const formattedSize = video.size ? formatFileSize(video.size) : "Unknown";
  
  // Default thumbnail if none exists
  const thumbnailUrl = video.thumbnail_url || 'https://placehold.co/640x360/333/FFF?text=No+Thumbnail';
  
  // Handle callbacks
  const handleEditSave = () => {
    setIsEditDialogOpen(false);
    onRefresh();
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Video thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button 
            variant="glass"
            size="icon"
            className="rounded-full"
            onClick={() => setIsPlayerOpen(true)}
          >
            <Play className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <VideoStatusBadge status={video.status} timeout={processingTimeout} />
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1 line-clamp-1">
          {video.title || 'Untitled Video'}
        </h3>
        
        <div className="text-sm text-muted-foreground space-y-1">
          {video.description && (
            <p className="line-clamp-2">{video.description}</p>
          )}
          
          <div className="flex items-center gap-x-4 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
              {formattedDuration}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
              {formattedSize}
            </span>
          </div>
          
          {timeSinceUpload && (
            <p className="text-xs mt-1">
              Uploaded {timeSinceUpload}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={!onDownload}
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-1" /> Download
        </Button>
        
        {onReprocess && (
          <Button
            variant={processingTimeout ? "destructive" : "outline"}
            size="sm"
            className="flex-1"
            onClick={onReprocess}
            disabled={isReprocessing}
          >
            {isReprocessing ? (
              <Loader className="h-4 w-4 mr-1 animate-spin" /> 
            ) : processingTimeout ? (
              <AlertTriangle className="h-4 w-4 mr-1" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            {processingTimeout ? "Retry" : "Process"}
          </Button>
        )}
      </CardFooter>
      
      {/* Video Player Dialog */}
      {isPlayerOpen && (
        <VideoPlayer
          open={isPlayerOpen}
          onOpenChange={setIsPlayerOpen}
          video={video}
        />
      )}
      
      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <VideoEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          video={video}
          onClose={() => setIsEditDialogOpen(false)}
          onUpdate={handleEditSave}
        />
      )}
    </Card>
  );
};

export default VideoCard;
