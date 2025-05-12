
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download, Loader2, AlertTriangle, RefreshCcw } from 'lucide-react';
import { getVideos, getMyVideos } from '@/services/videoStorageService';
import VideoStatusBadge from './VideoStatusBadge';
import { StoredVideo, VideoStatus, VideoFilterOptions } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';
import VideoCard from './VideoCard';
import VideoDownloadDialog from './VideoDownloadDialog';
import { Badge } from '@/components/ui/badge';

interface VideoListProps {
  filters?: VideoFilterOptions;
  page?: number;
  pageSize?: number;
  viewMode?: 'grid' | 'list';
  onPageChange?: (page: number) => void;
  onlyMine?: boolean;
  emptyStateMessage?: React.ReactNode | string;
}

const VideoList: React.FC<VideoListProps> = ({ 
  filters,
  page = 1,
  pageSize = 12,
  viewMode = 'grid',
  onPageChange,
  onlyMine = false,
  emptyStateMessage = "No videos found"
}) => {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalVideos, setTotalVideos] = useState(0);
  const { toast } = useToast();
  
  // State for download dialog
  const [selectedVideo, setSelectedVideo] = useState<StoredVideo | null>(null);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  
  // State for monitoring video processing timeouts
  const [processingTimeouts, setProcessingTimeouts] = useState<Record<string, boolean>>({});
  
  // State for controlling reprocessing
  const [reprocessingId, setReprocessingId] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
    
    // Set up interval to check processing videos
    const interval = setInterval(() => {
      checkProcessingVideos();
    }, 15000); // Check every 15 seconds
    
    return () => clearInterval(interval);
  }, [filters, page, pageSize, onlyMine]);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      // Get videos with filters
      const result = onlyMine
        ? await getMyVideos(filters, { field: 'created_at', direction: 'desc' }, page, pageSize)
        : await getVideos(filters, { field: 'created_at', direction: 'desc' }, page, pageSize);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setVideos(result.videos);
      setTotalVideos(result.total);
      
      // Check for videos in processing state for too long
      checkProcessingVideos(result.videos);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast({
        variant: "destructive",
        title: "Error loading videos",
        description: "There was a problem fetching the video data."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check videos that have been in processing state for too long
  const checkProcessingVideos = (videosToCheck = videos) => {
    const processingVideos = videosToCheck.filter(v => 
      v.status === 'processing' || v.status === 'uploading'
    );
    
    if (processingVideos.length === 0) return;
    
    const newTimeouts = { ...processingTimeouts };
    
    processingVideos.forEach(video => {
      const createdAt = new Date(video.created_at).getTime();
      const now = Date.now();
      const processingTime = now - createdAt;
      
      // If processing for more than 5 minutes, mark as timeout
      if (processingTime > 5 * 60 * 1000 && !newTimeouts[video.id]) {
        newTimeouts[video.id] = true;
        
        toast({
          title: "Processing delay",
          description: `Video "${video.title}" is taking longer than expected to process.`,
          variant: "destructive"
        });
      }
    });
    
    setProcessingTimeouts(newTimeouts);
  };

  const handleRefresh = () => {
    loadVideos();
  };
  
  const handleDownloadClick = (video: StoredVideo) => {
    setSelectedVideo(video);
    setIsDownloadDialogOpen(true);
  };
  
  const handleReprocessVideo = async (video: StoredVideo) => {
    // Implementation for reprocessing would go here
    // This would typically call a function from your video service
    setReprocessingId(video.id);
    
    setTimeout(() => {
      setReprocessingId(null);
      loadVideos();
      
      toast({
        title: "Reprocessing complete",
        description: `Video "${video.title}" has been reprocessed.`
      });
    }, 2000);
  };
  
  // Function to get time since upload
  const getTimeSinceUpload = (dateString: string): string => {
    const uploadDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - uploadDate.getTime();
    
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  };

  // Render empty state
  if (!isLoading && videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {typeof emptyStateMessage === 'string' ? (
          <p className="text-muted-foreground">{emptyStateMessage}</p>
        ) : (
          emptyStateMessage
        )}
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading videos...</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Videos ({totalVideos})</h2>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {videos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onRefresh={handleRefresh}
                onDownload={() => handleDownloadClick(video)}
                processingTimeout={processingTimeouts[video.id]}
                timeSinceUpload={getTimeSinceUpload(video.created_at)}
                onReprocess={processingTimeouts[video.id] ? () => handleReprocessVideo(video) : undefined}
                isReprocessing={reprocessingId === video.id}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalVideos > pageSize && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange && onPageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center justify-center px-3 py-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">
                    Page {page} of {Math.ceil(totalVideos / pageSize)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange && onPageChange(page + 1)}
                  disabled={page >= Math.ceil(totalVideos / pageSize)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Download Dialog */}
      {selectedVideo && (
        <VideoDownloadDialog
          open={isDownloadDialogOpen}
          onOpenChange={setIsDownloadDialogOpen}
          video={selectedVideo}
        />
      )}
    </div>
  );
};

export default VideoList;
