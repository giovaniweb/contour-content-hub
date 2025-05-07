
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StoredVideo } from '@/types/video-storage';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp, Trash, ArrowRight, ArrowLeft } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import VideoListSkeleton from '@/components/video-storage/VideoListSkeleton';
import { deleteVideo } from '@/services/videoStorageService';

const VideoSwipe: React.FC = () => {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const { toast } = useToast();
  const { isAdmin } = usePermissions();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      const { data: fetchedVideos, error } = await supabase
        .from('videos_storage')
        .select('*')
        .eq('status', 'ready')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Explicitly convert the fetched videos to the StoredVideo type
      const typedVideos: StoredVideo[] = fetchedVideos as StoredVideo[];
      setVideos(typedVideos);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeos",
        description: error.message || "Não foi possível carregar os vídeos."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    handleSwipe('right');
    toast({
      title: "Vídeo curtido",
      description: "Este vídeo foi adicionado aos seus favoritos."
    });
    // Here you could add logic to save the like to the database
  };

  const handleSkip = () => {
    handleSwipe('left');
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setDirection(direction);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < videos.length - 1) {
          return prevIndex + 1;
        }
        // If we've reached the end, restart or show a message
        toast({
          title: "Fim dos vídeos",
          description: "Você visualizou todos os vídeos disponíveis."
        });
        return 0;
      });
      setDirection(null);
    }, 300);
  };

  const handleDelete = async (videoId: string) => {
    if (!isAdmin()) {
      toast({
        variant: "destructive",
        title: "Acesso restrito",
        description: "Apenas administradores podem excluir vídeos."
      });
      return;
    }

    try {
      const { success, error } = await deleteVideo(videoId);
      
      if (!success) {
        throw new Error(error);
      }

      setVideos(videos.filter((video) => video.id !== videoId));
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi removido com sucesso."
      });
      
      if (currentIndex >= videos.length - 1) {
        setCurrentIndex(0);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir vídeo",
        description: error.message || "Não foi possível excluir o vídeo."
      });
    }
  };

  const currentVideo = videos[currentIndex];

  const variants = {
    enter: (direction: 'left' | 'right' | null) => {
      return {
        x: direction === 'right' ? 1000 : direction === 'left' ? -1000 : 0,
        opacity: 0
      };
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right' | null) => {
      return {
        x: direction === 'left' ? 1000 : direction === 'right' ? -1000 : 0,
        opacity: 0
      };
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Descobrir Vídeos</h1>
          <VideoListSkeleton count={1} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Descobrir Vídeos</h1>
        
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum vídeo disponível no momento.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchVideos}
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          <div className="relative h-[70vh] w-full max-w-3xl mx-auto overflow-hidden bg-black rounded-xl">
            <AnimatePresence initial={false} custom={direction}>
              {currentVideo && (
                <motion.div
                  key={currentVideo.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute w-full h-full"
                >
                  <video
                    src={currentVideo.file_urls?.original}
                    className="w-full h-full object-contain bg-black"
                    autoPlay
                    muted
                    controls
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white text-xl font-bold">{currentVideo.title}</h3>
                    <p className="text-white/80 line-clamp-2">{currentVideo.description || "Sem descrição"}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
              <Button 
                variant="secondary" 
                size="lg"
                className="rounded-full h-14 w-14 p-0 bg-white shadow-lg"
                onClick={handleSkip}
              >
                <ArrowLeft className="h-6 w-6 text-red-500" />
              </Button>
              
              <Button 
                variant="secondary" 
                size="lg"
                className="rounded-full h-14 w-14 p-0 bg-white shadow-lg"
                onClick={handleLike}
              >
                <ThumbsUp className="h-6 w-6 text-green-500" />
              </Button>
              
              {isAdmin() && (
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="rounded-full h-14 w-14 p-0 bg-white shadow-lg"
                  onClick={() => currentVideo && handleDelete(currentVideo.id)}
                >
                  <Trash className="h-6 w-6 text-red-500" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VideoSwipe;
