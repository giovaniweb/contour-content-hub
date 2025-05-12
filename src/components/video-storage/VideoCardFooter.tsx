
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import VideoCardDeleteDialog from './VideoCardDeleteDialog';
import VideoEditDialog from './VideoEditDialog';
import VideoDownloadDialog from './VideoDownloadDialog';
import VideoDownloadMenu from './VideoDownloadMenu';
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

  // Não mostrar botão de download para vídeos em processamento
  const showDownloadButton = !isProcessing && hasFileUrl;

  // Prepare download options if we have URLs available
  const downloadOptions = [];
  
  // Verificar se temos download_files disponíveis
  if (video.download_files && Array.isArray(video.download_files)) {
    video.download_files.forEach(file => {
      if (file.quality && file.link) {
        downloadOptions.push({
          quality: file.quality,
          link: file.link
        });
      }
    });
  }
  // Compatibilidade com a estrutura antiga file_urls (caso ainda exista)
  else if (video.file_urls && typeof video.file_urls === 'object') {
    if (video.file_urls.original) {
      downloadOptions.push({
        quality: "Original",
        link: video.file_urls.original
      });
    }
    if (video.file_urls.hd) {
      downloadOptions.push({
        quality: "HD (720p)",
        link: video.file_urls.hd
      });
    }
    if (video.file_urls.sd) {
      downloadOptions.push({
        quality: "SD (480p)",
        link: video.file_urls.sd
      });
    }
    if (video.file_urls.web_optimized) {
      downloadOptions.push({
        quality: "Web (Otimizado)",
        link: video.file_urls.web_optimized
      });
    }
  }

  const hasDownloadOptions = downloadOptions.length > 0;

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
            hasDownloadOptions ? (
              <VideoDownloadMenu downloads={downloadOptions} />
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1"
                onClick={handleOpenDownload}
              >
                <span>Download</span>
              </Button>
            )
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
