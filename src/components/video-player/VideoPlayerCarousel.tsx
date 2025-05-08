
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { StoredVideo } from '@/types/video-storage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { type CarouselApi } from '@/components/ui/carousel';

interface VideoPlayerCarouselProps {
  videos: StoredVideo[];
  currentVideoIndex: number;
  onLike: (video: StoredVideo) => void;
  onSelect: (index: number) => void;
}

export const VideoPlayerCarousel: React.FC<VideoPlayerCarouselProps> = ({
  videos,
  currentVideoIndex,
  onLike,
  onSelect
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  
  // When the carousel API is available, set up a listener for changes
  React.useEffect(() => {
    if (!api) return;
    
    const handleSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      onSelect(selectedIndex);
    };
    
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, onSelect]);

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
            setApi={setApi}
            opts={{ 
              startIndex: currentVideoIndex 
            }}
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
                        onClick={() => onLike(video)}
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
