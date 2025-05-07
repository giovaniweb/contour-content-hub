
import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import { StoredVideo } from '@/types/video-storage';
import { getVideos, getMyVideos } from '@/services/videoStorageService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import VideoListSkeleton from './VideoListSkeleton';
import VideoPreviewDialog from './VideoPreviewDialog';

interface VideoListProps {
  onlyMine?: boolean;
  emptyStateMessage?: React.ReactNode;
}

const VideoList: React.FC<VideoListProps> = ({ onlyMine = false, emptyStateMessage }) => {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<StoredVideo | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVideos();
  }, [onlyMine]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      
      const fetchFunction = onlyMine ? getMyVideos : getVideos;
      const { videos, error } = await fetchFunction();
      
      if (error) {
        throw new Error(error);
      }
      
      setVideos(videos);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeos",
        description: error.message || "Ocorreu um erro ao carregar a lista de vídeos."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoDeleted = (videoId: string) => {
    setVideos(videos.filter(v => v.id !== videoId));
    if (selectedVideo?.id === videoId) {
      setSelectedVideo(null);
      setPreviewOpen(false);
    }
  };

  const handlePreviewClick = (video: StoredVideo) => {
    setSelectedVideo(video);
    setPreviewOpen(true);
  };

  if (loading) {
    return <VideoListSkeleton />;
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        {typeof emptyStateMessage === 'string' ? (
          <p className="text-muted-foreground">{emptyStateMessage}</p>
        ) : (
          emptyStateMessage || (
            <p className="text-muted-foreground">Nenhum vídeo encontrado.</p>
          )
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={loadVideos}
          className="flex items-center gap-1"
        >
          <RefreshCcw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onVideoDeleted={handleVideoDeleted}
            onPreviewClick={handlePreviewClick}
          />
        ))}
      </div>

      <VideoPreviewDialog 
        video={selectedVideo}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
};

export default VideoList;
