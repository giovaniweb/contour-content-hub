
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getVideos } from '@/services/videoStorageService';

interface Video {
  id: string;
  titulo: string;
  descricao_curta?: string;
  descricao_detalhada?: string;
  thumbnail_url?: string;
  url_video?: string;
  categoria?: string;
  tags?: string[];
  downloads_count?: number;
  data_upload: string;
  duracao?: string;
}

export const useUserVideos = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getVideos(
        {}, // sem filtros específicos
        { field: 'data_upload', direction: 'desc' },
        1,
        50 // carregar mais vídeos para usuários
      );
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setVideos(result.videos || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar vídeos';
      setError(errorMessage);
      console.error('Erro ao carregar vídeos:', error);
      
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os vídeos. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return {
    videos,
    isLoading,
    error,
    loadVideos
  };
};
