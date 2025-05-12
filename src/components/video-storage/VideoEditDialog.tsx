
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { StoredVideo } from '@/types/video-storage';
import { updateVideo } from '@/services/videoStorage/videoManagementService';

interface VideoEditDialogProps {
  video: StoredVideo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onUpdate: () => void;
}

const VideoEditDialog: React.FC<VideoEditDialogProps> = ({
  video,
  open,
  onOpenChange,
  onClose,
  onUpdate,
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(video.title || '');
  const [description, setDescription] = useState(video.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setTitle(video.title || '');
      setDescription(video.description || '');
    }
  }, [open, video]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { success, error } = await updateVideo(video.id, {
        title,
        description
      });
      
      if (!success) {
        throw new Error(error || 'Failed to update video');
      }
      
      toast({
        title: "Video updated",
        description: "Video details have been updated successfully."
      });
      
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating video:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating this video. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Video description"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VideoEditDialog;
