
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { StoredVideo } from '@/types/video-storage';
import { deleteVideo } from '@/services/videoStorage/videoManagementService';

interface VideoCardDeleteDialogProps {
  video: StoredVideo;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
  videoTitle: string;
  onDelete: () => void;
}

const VideoCardDeleteDialog: React.FC<VideoCardDeleteDialogProps> = ({
  video,
  isOpen,
  onOpenChange,
  videoId,
  videoTitle,
  onDelete,
}) => {
  const { toast } = useToast();
  
  const handleDelete = async () => {
    try {
      const { success, error } = await deleteVideo(videoId);
      
      if (!success) {
        throw new Error(error || 'Failed to delete video');
      }
      
      toast({
        title: "Video deleted",
        description: `"${videoTitle}" has been deleted successfully.`
      });
      
      onDelete();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was a problem deleting this video. Please try again."
      });
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "{videoTitle}" and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VideoCardDeleteDialog;
