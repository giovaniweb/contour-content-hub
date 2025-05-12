
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';
import VideoPlayerModal from '@/components/video-player/VideoPlayerModal';
import { useVideoFeatured } from '@/hooks/use-video-featured';
import { Card } from '@/components/ui/card';

const FeaturedVideo: React.FC = () => {
  const { videos, isLoading, error } = useVideoFeatured(1); // Buscar apenas 1 vídeo em destaque
  const [open, setOpen] = useState(false);
  
  // Se estiver carregando ou houver erro, renderiza um placeholder
  if (isLoading || videos.length === 0) {
    return (
      <Card className="aspect-video bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-md rounded-xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 bg-white/20 rounded-full mb-4"></div>
            <div className="h-5 w-48 bg-white/20 rounded mb-2"></div>
            <div className="h-4 w-24 bg-white/20 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }
  
  const featuredVideo = videos[0];
  const videoUrl = featuredVideo.file_urls?.web_optimized || '';
  
  return (
    <>
      <Card className="relative aspect-video bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border-white/10">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${featuredVideo.thumbnail_url})`,
            filter: 'blur(2px) brightness(0.5)'
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/80 flex flex-col justify-end p-6 z-10">
          <h2 className="text-2xl font-bold text-white mb-2">{featuredVideo.title}</h2>
          
          <p className="text-white/80 mb-4 line-clamp-2 max-w-lg">
            {featuredVideo.description || 'Assista a este conteúdo exclusivo'}
          </p>
          
          <Button 
            variant="glass"
            className="group flex items-center gap-2 w-fit"
            onClick={() => setOpen(true)}
          >
            <div className="bg-white text-black rounded-full p-1 group-hover:scale-110 transition-transform">
              <Play className="h-4 w-4" />
            </div>
            Assistir agora
          </Button>
        </div>
      </Card>
      
      <VideoPlayerModal 
        open={open} 
        onOpenChange={setOpen} 
        videoUrl={videoUrl} 
        title={featuredVideo.title || ''} 
      />
    </>
  );
};

export default FeaturedVideo;
