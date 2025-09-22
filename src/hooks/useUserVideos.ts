
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { equipmentService } from '@/services/equipmentService';

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
  searchTerm?: string;
  selectedEquipment?: string;
}

export const useUserVideos = (options: UseUserVideosOptions = {}) => {
  const { page = 1, itemsPerPage = 20, searchTerm = '', selectedEquipment = '' } = options;
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [equipments, setEquipments] = useState<any[]>([]);

  const loadVideos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🎬 Carregando vídeos...');
      
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      // Build query with filters
      let query = supabase
        .from('videos')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (searchTerm) {
        query = query.or(`titulo.ilike.%${searchTerm}%,descricao_curta.ilike.%${searchTerm}%`);
      }

      // Apply equipment filter
      if (selectedEquipment) {
        // Find equipment ID by name
        const equipment = equipments.find(eq => eq.nome === selectedEquipment);
        const equipmentId = equipment?.id;
        
        if (equipmentId) {
          // Filter by equipment ID in the equipamentos array or categoria
          query = query.or(`categoria.eq.${selectedEquipment},equipamentos.cs.{${equipmentId}}`);
        } else {
          // Fallback to search by name
          query = query.or(`categoria.eq.${selectedEquipment},equipamentos.cs.{${selectedEquipment}}`);
        }
      }

      // Apply sorting and pagination
      const { data, error, count } = await query
        .order('data_upload', { ascending: false })
        .range(from, to);
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('✅ Vídeos carregados:', data?.length || 0, 'de', count || 0);
      console.log('📈 Total count from query:', count);
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
    const loadEquipmentsAndVideos = async () => {
      // Load equipments first if not loaded
      if (equipments.length === 0) {
        const equipmentResult = await equipmentService.getAllEquipments();
        if (!equipmentResult.error) {
          setEquipments(equipmentResult.data || []);
        }
      }
      await loadVideos();
    };
    
    loadEquipmentsAndVideos();
  }, [page, itemsPerPage, searchTerm, selectedEquipment]);

  return {
    videos,
    isLoading,
    error,
    total,
    loadVideos
  };
};
