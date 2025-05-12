import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DownloadCloud, Eye, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import VideoCardDeleteDialog from './VideoCardDeleteDialog';
import VideoEditDialog from './VideoEditDialog';
import VideoDownloadDialog from './VideoDownloadDialog';
import { StoredVideo } from '@/types/video-storage';

interface VideoCardFooterProps {
  video: StoredVideo;
  onRefresh: () => void;
  onPreview?: () => void;
  onDownload?: () => void;
  onOpenDeleteDialog?: () => void;  
  isProcessing?: boolean;           
  hasFileUrl?: boolean;             
  onViewVideo?: () => void;         
}

export const VideoCardFooter: React.FC<VideoCardFooterProps> = ({
  video,
  onRefresh,
  onPreview,
  onDownload,
  onOpenDeleteDialog,
  onViewVideo,
  isProcessing,
  hasFileUrl,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  
  const handleOpenDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      setIsDownloadDialogOpen(true);
    }
  };

  const handlePreview = () => {
    if (onViewVideo) {
      onViewVideo();
    } else if (onPreview) {
      onPreview();
    }
  };

  const handleOpenDeleteDialog = () => {
    if (onOpenDeleteDialog) {
      onOpenDeleteDialog();
    } else {
      setIsDeleteDialogOpen(true);
    }
  };

  // Don't show download button for processing videos
  const showDownloadButton = !isProcessing && hasFileUrl;

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={handlePreview}
          disabled={isProcessing || !hasFileUrl}
        >
          <Eye size={16} />
          <span>Preview</span>
        </Button>

        <div className="flex space-x-1">
          {showDownloadButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={handleOpenDownload}
            >
              <DownloadCloud size={16} />
              <span>Download</span>
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenDeleteDialog}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Fixed: Added the required 'video' prop */}
      <VideoCardDeleteDialog
        video={video}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        videoId={video.id}
        videoTitle={video.title || 'Vídeo sem título'}
        onDelete={onRefresh}
      />
      
      <VideoEditDialog 
        video={video}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdate={onRefresh}
      />
      
      <VideoDownloadDialog
        open={isDownloadDialogOpen}
        onOpenChange={setIsDownloadDialogOpen}
        videoTitle={video.title || 'Vídeo sem título'}
        videoUrl={video.url || ''}
        existingDownloadLinks={video.file_urls}
      />
    </>
  );
};
