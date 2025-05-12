
import React from 'react';
import { Download, FileDown } from 'lucide-react';
import { StoredVideo } from '@/types/video-storage';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/utils/format';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { downloadVideo } from '@/services/videoStorage/videoDownloadService';
import { useToast } from '@/hooks/use-toast';

interface VideoDownloadDialogProps {
  video: StoredVideo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoDownloadDialog: React.FC<VideoDownloadDialogProps> = ({
  video,
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  
  // Define download qualities with labels
  const downloadQualities = [
    { key: 'original', label: 'Original Quality', icon: <Download className="h-4 w-4 mr-2" /> },
    { key: 'hd', label: 'HD (1080p)', icon: <Download className="h-4 w-4 mr-2" /> },
    { key: 'sd', label: 'SD (720p)', icon: <Download className="h-4 w-4 mr-2" /> },
    { key: 'web_optimized', label: 'Web Optimized', icon: <Download className="h-4 w-4 mr-2" /> },
  ];
  
  // Filter only available qualities
  const availableQualities = downloadQualities.filter(
    q => video.file_urls && video.file_urls[q.key]
  );
  
  // Handle download
  const handleDownload = async (qualityKey: string) => {
    try {
      // Get the URL for the selected quality
      const url = video.file_urls[qualityKey];
      
      if (!url) {
        throw new Error(`No download URL found for ${qualityKey} quality`);
      }
      
      // Log download attempt
      await downloadVideo(video.id, qualityKey);
      
      // Open the URL in a new tab or trigger download
      window.open(url, '_blank');
      
      // Notify user
      toast({
        title: "Download started",
        description: `Your video is downloading in ${qualityKey} quality.`
      });
      
    } catch (error) {
      console.error('Error downloading video:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was a problem downloading this video. Please try again."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Video</DialogTitle>
          <DialogDescription>
            Select quality to download "{video.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {availableQualities.length > 0 ? (
            <div className="space-y-2">
              {availableQualities.map((quality) => (
                <Button 
                  key={quality.key}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleDownload(quality.key)}
                >
                  {quality.icon}
                  {quality.label}
                  {video.size && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {formatFileSize(video.size)}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center p-4">
              <FileDown className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No download options available</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This video does not have any downloadable versions.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDownloadDialog;
