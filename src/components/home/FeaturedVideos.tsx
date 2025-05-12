
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { StoredVideo } from '@/types/video-storage';
import { loadVideosData } from '@/hooks/video-batch/videoBatchOperations';
import VideoPlayerModal from '@/components/video-player/VideoPlayerModal';

interface FeaturedVideosProps {
  className?: string;
}

const FeaturedVideos: React.FC<FeaturedVideosProps> = ({ className }) => {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      const result = await loadVideosData();
      if (result.success && result.data) {
        // Safely cast the data to StoredVideo[]
        const typedVideos = result.data as unknown as StoredVideo[];
        setVideos(typedVideos);
      } else {
        console.error("Failed to load videos:", result.error);
      }
    };

    fetchVideos();
  }, []);

  const getVideoUrl = (video: StoredVideo): string => {
    if (!video.file_urls) return '';
    
    // Handle both string and object formats
    if (typeof video.file_urls === 'object') {
      const fileUrls = video.file_urls as Record<string, string>;
      return fileUrls.web_optimized || '';
    }
    
    return '';
  };

  const handleOpenVideo = (video: StoredVideo) => {
    setSelectedVideoUrl(getVideoUrl(video));
    setSelectedVideoTitle(video.title || null);
    setCurrentVideoIndex(videos.indexOf(video));
    setOpen(true);
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    const nextVideo = videos[(currentVideoIndex + 1) % videos.length];
    setSelectedVideoUrl(getVideoUrl(nextVideo));
    setSelectedVideoTitle(nextVideo.title || null);
  };

  const handlePreviousVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    const prevVideo = videos[(currentVideoIndex - 1 + videos.length) % videos.length];
    setSelectedVideoUrl(getVideoUrl(prevVideo));
    setSelectedVideoTitle(prevVideo.title || null);
  };

  return (
    <div className={className}>
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
          <CardTitle className="text-lg font-semibold flex items-center text-contourline-darkBlue">
            Vídeos em Destaque
          </CardTitle>
          <Link to={ROUTES.VIDEOS.ROOT}>
            <Button variant="ghost" size="sm" className="text-contourline-mediumBlue">
              Ver todos
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pl-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.slice(0, 3).map((video) => (
              <div key={video.id} className="relative">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={video.thumbnail_url || ''}
                    alt={video.title || 'Video thumbnail'}
                    className="object-cover rounded-md cursor-pointer"
                    onClick={() => handleOpenVideo(video)}
                  />
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <h4 className="text-sm font-medium text-white truncate">{video.title}</h4>
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => handleOpenVideo(video)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <VideoPlayerModal
        open={open}
        onOpenChange={setOpen}
        videoUrl={selectedVideoUrl || ''}
        title={selectedVideoTitle || ''}
        onNext={videos.length > 1 ? handleNextVideo : undefined}
        onPrevious={videos.length > 1 ? handlePreviousVideo : undefined}
        currentVideo={currentVideoIndex}
        totalVideos={videos.length}
      />
    </div>
  );
};

export default FeaturedVideos;
