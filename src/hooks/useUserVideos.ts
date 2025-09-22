
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

interface UseUserVideosOptions {
  page?: number;
  itemsPerPage?: number;
}

export const useUserVideos = (options: UseUserVideosOptions = {}) => {
  const { page = 1, itemsPerPage = 20 } = options;
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadVideos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🎬 Carregando vídeos...');
      
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .order('data_upload', { ascending: false })
        .range(from, to);
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('✅ Vídeos carregados:', data?.length || 0, 'de', count || 0);
      setVideos(data || []);
      setTotal(count || 0);
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
  }, [page, itemsPerPage]);

  return {
    videos,
    isLoading,
    error,
    total,
    loadVideos
  };
};
