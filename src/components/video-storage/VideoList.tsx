
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import VideoCard from '@/components/video-storage/VideoCard';
import VideoDownloadDialog from '@/components/video-storage/VideoDownloadDialog';
import VideoPlayer from '@/components/video-storage/VideoPlayer';
import { StoredVideo, VideoFilterOptions } from '@/types/video-storage';
import { Video } from '@/services/videoStorage/videoService';
import { getVideos } from '@/services/videoStorageService';
import { timeAgo } from '@/utils/time';

interface VideoListProps {
  filters: VideoFilterOptions;
  page: number;
  pageSize: number;
  viewMode: 'grid' | 'list';
  onPageChange: (page: number) => void;
}

const VideoList: React.FC<VideoListProps> = ({
  filters,
  page,
  pageSize,
  viewMode,
  onPageChange
}) => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<StoredVideo | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Load videos
  useEffect(() => {
    loadVideos();
  }, [filters, page, pageSize]);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const { videos, total, error } = await getVideos(
        filters,
        { field: 'created_at', direction: 'desc' },
        page,
        pageSize
      );
      
      if (error) {
        throw new Error(error);
      }
      
      setVideos(videos);
      setTotalVideos(total);
    } catch (error) {
      console.error('Failed to load videos:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load videos. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle video preview
  const handlePreviewVideo = (video: StoredVideo) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  // Handle video download
  const handleDownloadVideo = (video: StoredVideo) => {
    setSelectedVideo(video);
    setIsDownloadOpen(true);
  };

  // Convert StoredVideo to Video for compatibility with VideoCard
  const convertToVideo = (storedVideo: StoredVideo): Video => {
    return {
      id: storedVideo.id,
      titulo: storedVideo.title || 'Sem título',
      data_upload: storedVideo.created_at || new Date().toISOString(),
      downloads_count: 0,
      favoritos_count: 0,
      curtidas: 0,
      compartilhamentos: 0,
      url_video: storedVideo.url || '',
      preview_url: storedVideo.url,
      thumbnail_url: storedVideo.thumbnail_url,
      descricao_curta: storedVideo.description,
      descricao_detalhada: storedVideo.description,
      tipo_video: 'video_pronto',
      equipamentos: [],
      tags: storedVideo.tags || []
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading videos...</p>
      </div>
    );
  }

  // No videos found
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No videos found matching your criteria.</p>
        <Button 
          variant="outline" 
          onClick={loadVideos} 
          className="mt-4"
        >
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Videos grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'grid-cols-1'}`}>
        {videos.map((video) => {
          const convertedVideo = convertToVideo(video);
          
          return (
            <VideoCard
              key={video.id}
              video={convertedVideo}
              viewMode={viewMode}
              onPlay={() => handlePreviewVideo(video)}
              onEdit={() => {}} // Handled by VideoActionMenu
              onDelete={() => {}} // Handled by VideoActionMenu
              onDownload={() => handleDownloadVideo(video)}
              onStatistics={() => {}} // Handled by VideoActionMenu
              onCopyLink={() => {}} // Handled by VideoActionMenu
              onRefresh={loadVideos}
            />
          );
        })}
      </div>
      
      {/* Pagination */}
      {totalVideos > pageSize && (
        <Pagination
          totalItems={totalVideos}
          itemsPerPage={pageSize}
          currentPage={page}
          onPageChange={onPageChange}
        />
      )}
      
      {/* Video Player Dialog */}
      {selectedVideo && (
        <VideoPlayer
          open={isPlayerOpen}
          onOpenChange={setIsPlayerOpen}
          video={convertToVideo(selectedVideo)}
        />
      )}
      
      {/* Download Dialog */}
      {selectedVideo && (
        <VideoDownloadDialog
          open={isDownloadOpen}
          onOpenChange={setIsDownloadOpen}
          video={selectedVideo}
        />
      )}
    </div>
  );
};

export default VideoList;
