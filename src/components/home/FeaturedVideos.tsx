
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { StoredVideo } from '@/types/video-storage';
import { VideoPlayerModal } from '@/components/video-player/VideoPlayerModal';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useVideoFeatured } from '@/hooks/use-video-featured';

const FeaturedVideos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<StoredVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { videos, isLoading, error } = useVideoFeatured();
  const navigate = useNavigate();

  const handlePlayVideo = (video: StoredVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleViewAllVideos = () => {
    navigate('/videos');
  };

  if (isLoading) {
    return (
      <div className="container space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Vídeos em Destaque</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[220px] bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !videos || videos.length === 0) {
    return (
      <div className="container space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Vídeos em Destaque</h2>
          <Button variant="outline" onClick={handleViewAllVideos}>Ver todos</Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum vídeo em destaque disponível no momento.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vídeos em Destaque</h2>
        <Button variant="outline" onClick={handleViewAllVideos}>Ver todos</Button>
      </div>

      <Carousel
        opts={{ loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {videos.map((video) => (
            <CarouselItem key={video.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="overflow-hidden group cursor-pointer border-0 shadow-md hover:shadow-lg transition-all">
                  <div 
                    className="relative aspect-video bg-muted"
                    onClick={() => handlePlayVideo(video)}
                  >
                    <img 
                      src={video.thumbnail_url || '/assets/images/video-placeholder.jpg'} 
                      alt={video.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white h-12 w-12"
                      >
                        <Play className="h-6 w-6 fill-current" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{video.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {video.description || 'Sem descrição'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-2" />
        <CarouselNext className="hidden md:flex right-2" />
      </Carousel>

      {selectedVideo && (
        <VideoPlayerModal 
          video={selectedVideo}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default FeaturedVideos;
