
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Video {
  id: string;
  titulo: string;
  descricao_curta?: string;
  descricao_detalhada?: string;
  thumbnail_url?: string;
  url_video?: string;
  categoria?: string;
  equipamentos?: string[];
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
      console.log('🎬 Carregando vídeos...');
      
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('data_upload', { ascending: false })
        .limit(50);
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('✅ Vídeos carregados:', data?.length || 0);
      setVideos(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar vídeos';
      setError(errorMessage);
      console.error('❌ Erro ao carregar vídeos:', error);
      
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
