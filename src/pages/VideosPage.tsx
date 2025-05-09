
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadVideosData } from '@/hooks/video-batch/videoBatchOperations';
import { StoredVideo } from '@/types/video-storage';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoSwipeViewer from '@/components/video-storage/VideoSwipeViewer';

// Fix the import from named to default
import VideoPlayerModal from '@/components/video-player/VideoPlayerModal';

const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      
      const result = await loadVideosData();
      
      if (result.success) {
        setVideos(result.data as unknown as StoredVideo[]);
      } else {
        setError(result.error || 'Failed to load videos.');
      }
      
      setLoading(false);
    };
    
    fetchVideos();
  }, []);
  
  const handleVideoClick = (index: number) => {
    setSelectedVideoIndex(index);
  };
  
  const handleCloseViewer = () => {
    setSelectedVideoIndex(null);
  };
  
  const handleNextVideo = () => {
    if (selectedVideoIndex !== null) {
      setSelectedVideoIndex((prevIndex) => (prevIndex! + 1) % videos.length);
    }
  };
  
  const handlePreviousVideo = () => {
    if (selectedVideoIndex !== null) {
      setSelectedVideoIndex((prevIndex) => (prevIndex! - 1 + videos.length) % videos.length);
    }
  };

  const getVideoUrl = (video: StoredVideo) => {
    if (!video.file_urls) return '';
    
    // Handle both string and object formats
    if (typeof video.file_urls === 'object') {
      const fileUrls = video.file_urls as Record<string, string>;
      return fileUrls.web_optimized || '';
    }
    
    return '';
  };
  
  return (
    <Layout title="Vídeos">
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Vídeos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading && <p>Carregando vídeos...</p>}
              {error && <p className="text-red-500">Erro: {error}</p>}
              {videos.map((video, index) => (
                <div 
                  key={video.id} 
                  className="relative cursor-pointer"
                  onClick={() => handleVideoClick(index)}
                >
                  <img 
                    src={video.thumbnail_url || getVideoUrl(video)} 
                    alt={video.title || 'Vídeo'} 
                    className="w-full rounded-md aspect-video object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white p-2">
                    <h4 className="font-semibold">{video.title}</h4>
                    <p className="text-sm">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedVideoIndex !== null && (
              <VideoSwipeViewer
                videos={videos}
                currentIndex={selectedVideoIndex}
                onClose={handleCloseViewer}
                onNext={handleNextVideo}
                onPrevious={handlePreviousVideo}
              />
            )}
          </CardContent>
        </Card>
        
        <div className="mt-4 flex justify-end space-x-2">
          <Link to="/video-storage/upload">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Novo vídeo
            </Button>
          </Link>
          <Link to="/video-batch">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Gerenciar vídeos
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default VideosPage;
