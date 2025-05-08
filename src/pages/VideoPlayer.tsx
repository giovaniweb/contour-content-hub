
import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StoredVideo } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import VideoSwipeViewer from '@/components/video-storage/VideoSwipeViewer';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

const VideoPlayer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('id');
  const mode = searchParams.get('mode') || 'single';
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    if (mode === 'swipe') {
      fetchRecommendedVideos();
    } else if (videoId) {
      fetchSingleVideo(videoId);
    }
  }, [videoId, mode]);

  const fetchSingleVideo = async (id: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('videos_storage')
        .select('*')
        .eq('id', id)
        .eq('status', 'ready')
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setVideos([data as StoredVideo]);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeo",
        description: error.message || "Não foi possível carregar o vídeo solicitado."
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedVideos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('videos_storage')
        .select('*')
        .eq('status', 'ready')
        .order('created_at', { ascending: false });
      
      // If we have a specific video ID, start with that one
      if (videoId) {
        const { data: featuredVideo, error: featuredError } = await supabase
          .from('videos_storage')
          .select('*')
          .eq('id', videoId)
          .single();
          
        if (!featuredError && featuredVideo) {
          // Exclude the featured video from the main query
          query = query.neq('id', videoId);
        }
      }
      
      const { data: recommendedVideos, error } = await query.limit(20);

      if (error) {
        throw error;
      }

      // If we have a featured video, put it first
      if (videoId) {
        const { data: featuredVideo, error: featuredError } = await supabase
          .from('videos_storage')
          .select('*')
          .eq('id', videoId)
          .single();
          
        if (!featuredError && featuredVideo) {
          setVideos([
            featuredVideo as StoredVideo,
            ...(recommendedVideos as StoredVideo[])
          ]);
        } else {
          setVideos(recommendedVideos as StoredVideo[]);
        }
      } else {
        setVideos(recommendedVideos as StoredVideo[]);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeos",
        description: error.message || "Não foi possível carregar os vídeos recomendados."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (video: StoredVideo) => {
    // Add like logic here
    toast({
      title: "Vídeo curtido",
      description: "O vídeo foi adicionado aos seus favoritos."
    });
  };

  const handleSkip = (video: StoredVideo) => {
    // Skip logic here
  };

  const handleVideoEnd = () => {
    toast({
      title: "Fim dos vídeos",
      description: "Você assistiu a todos os vídeos disponíveis.",
    });
  };

  // Create a callback for handling carousel selection
  const handleCarouselSelect = useCallback((index: number) => {
    setCurrentVideoIndex(index);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Player de Vídeo</h1>
          </div>
          <div className="h-[70vh] w-full flex items-center justify-center bg-muted rounded-lg">
            <div className="animate-pulse">Carregando...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (videos.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Player de Vídeo</h1>
            <Button variant="outline" onClick={() => window.history.back()}>
              Voltar
            </Button>
          </div>
          <div className="h-[70vh] w-full flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-xl font-medium mb-4">Nenhum vídeo encontrado</p>
              <Button variant="default" onClick={() => window.history.back()}>
                Voltar para a galeria
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show swipe mode
  if (mode === 'swipe') {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Descobrir vídeos</h1>
            <Button variant="outline" onClick={() => window.history.back()}>
              Voltar
            </Button>
          </div>
          
          <div className="h-[70vh] w-full max-w-3xl mx-auto overflow-hidden bg-black rounded-xl">
            <VideoSwipeViewer 
              videos={videos}
              onLike={handleLike}
              onSkip={handleSkip}
              onEnd={handleVideoEnd}
            />
          </div>
        </div>
      </Layout>
    );
  }

  // Show carousel mode
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{videos[currentVideoIndex]?.title || "Player de Vídeo"}</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
        </div>
        
        <div className="h-[70vh] w-full max-w-4xl mx-auto overflow-hidden">
          <Carousel
            className="w-full"
            opts={{ 
              startIndex: currentVideoIndex 
            }}
            onSelect={handleCarouselSelect}
          >
            <CarouselContent>
              {videos.map((video, index) => (
                <CarouselItem key={video.id}>
                  <div className="h-[60vh] w-full bg-black rounded-lg overflow-hidden">
                    <video
                      src={video.file_urls?.original || video.file_urls?.hd || video.file_urls?.sd}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay={index === currentVideoIndex}
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold">{video.title}</h3>
                    {video.description && (
                      <p className="text-muted-foreground">{video.description}</p>
                    )}
                    <div className="mt-2 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleLike(video)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" /> Curtir
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </Layout>
  );
};

export default VideoPlayer;
