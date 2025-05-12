
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';
import VideoPlayerModal from '@/components/video-player/VideoPlayerModal';
import { useVideoFeatured } from '@/hooks/use-video-featured';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const FeaturedVideo: React.FC = () => {
  const { videos, isLoading, error } = useVideoFeatured(1); // Buscar apenas 1 vídeo em destaque
  const [open, setOpen] = useState(false);
  
  // Se estiver carregando ou houver erro, renderiza um placeholder
  if (isLoading || videos.length === 0) {
    return (
      <Card className="aspect-video bg-white/80 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }
  
  const featuredVideo = videos[0];
  const videoUrl = featuredVideo.file_urls?.web_optimized || '';
  
  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="relative aspect-video bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${featuredVideo.thumbnail_url})`,
            filter: 'brightness(0.85)'
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70 flex flex-col justify-end p-8 z-10">
          <h2 className="text-2xl font-light text-white mb-2">{featuredVideo.title}</h2>
          
          <p className="text-white/90 mb-6 line-clamp-2 max-w-lg">
            {featuredVideo.description || 'Assista a este conteúdo exclusivo'}
          </p>
          
          <Button 
            variant="default"
            className="group flex items-center gap-3 w-fit hover-glow bg-white text-gray-800 hover:bg-white"
            onClick={() => setOpen(true)}
          >
            <div className="bg-fluida-blue text-white rounded-full p-1 transition-transform duration-300 group-hover:scale-110">
              <Play className="h-4 w-4" />
            </div>
            Assistir agora
          </Button>
        </div>
      </motion.div>
      
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
