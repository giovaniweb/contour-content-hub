
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StoredVideo } from '@/types/video-storage';

interface VideoCardDeleteDialogProps {
  video: StoredVideo;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isDeleting?: boolean;
  videoId?: string;      // Added for backward compatibility
  videoTitle?: string;   // Added for backward compatibility
}

const VideoCardDeleteDialog: React.FC<VideoCardDeleteDialogProps> = ({
  video,
  isOpen,
  onOpenChange,
  onDelete,
  isDeleting = false,
  videoId,
  videoTitle
}) => {
  // Use video object properties if available, otherwise fall back to direct props
  const title = videoTitle || video?.title || 'Vídeo sem título';
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir vídeo</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o vídeo "{title}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VideoCardDeleteDialog;
