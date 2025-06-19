import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/services/videoStorage/videoService';
import { VideoFilterOptions } from '@/types/video-storage';

export interface VideoStatistics {
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
  averageRating: number;
  uploadDate: string;
  fileSize?: string;
  duration?: string;
}

interface VideoManagementResult {
  success: boolean;
  error?: string;
  videos?: Video[];
  total?: number;
}

interface VideoStatsResult {
  success: boolean;
  error?: string;
  statistics?: VideoStatistics;
}

interface BulkUpdateResult {
  success: boolean;
  error?: string;
}

export const getVideos = async (
  filters: VideoFilterOptions = {},
  page: number = 1,
  limit: number = 20
): Promise<VideoManagementResult> => {
  try {
    console.log('[videoManagementService] getVideos chamado com:', { filters, page, limit });
    
    let query = supabase
      .from('videos')
      .select('*', { count: 'exact' })
      .order('data_upload', { ascending: false });

    // Apply filters
    if (filters.search) {
      query = query.or(`titulo.ilike.%${filters.search}%,descricao_curta.ilike.%${filters.search}%,descricao_detalhada.ilike.%${filters.search}%`);
    }

    if (filters.equipment && filters.equipment.length > 0) {
      query = query.overlaps('equipamentos', filters.equipment);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    
    console.log('[videoManagementService] Resultado da query:', { data, error, count });
    
    if (error) {
      console.error('[videoManagementService] Erro na query:', error);
      throw error;
    }

    const videos: Video[] = (data || []).map(item => ({
      id: item.id,
      titulo: item.titulo || '',
      descricao_curta: item.descricao_curta,
      descricao_detalhada: item.descricao_detalhada,
      tipo_video: item.tipo_video as 'video_pronto' | 'take',
      categoria: item.categoria,
      equipamentos: item.equipamentos || [],
      tags: item.tags || [],
      url_video: item.url_video || '',
      preview_url: item.preview_url,
      thumbnail_url: item.thumbnail_url,
      duracao: item.duracao,
      area_corpo: item.area_corpo,
      finalidade: item.finalidade || [],
      downloads_count: item.downloads_count || 0,
      favoritos_count: item.favoritos_count || 0,
      curtidas: item.curtidas || 0,
      compartilhamentos: item.compartilhamentos || 0,
      data_upload: item.data_upload || new Date().toISOString(),
      created_at: item.data_upload,
      updated_at: item.data_upload
    }));

    return {
      success: true,
      videos,
      total: count || 0
    };
  } catch (error) {
    console.error('[videoManagementService] Erro em getVideos:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar vídeos'
    };
  }
};

export const getVideoStatistics = async (videoId: string): Promise<VideoStatsResult> => {
  try {
    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (error) throw error;

    const statistics: VideoStatistics = {
      totalViews: 0, // This would come from analytics if implemented
      totalDownloads: video.downloads_count || 0,
      totalShares: video.compartilhamentos || 0,
      averageRating: 0, // This would come from ratings if implemented
      uploadDate: video.data_upload || new Date().toISOString(),
      duration: video.duracao,
      fileSize: undefined // This would need to be calculated or stored
    };

    return {
      success: true,
      statistics
    };
  } catch (error) {
    console.error('[videoManagementService] Erro ao buscar estatísticas:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar estatísticas do vídeo'
    };
  }
};

export const deleteVideo = async (videoId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (error) {
      console.error('[videoManagementService] Erro ao excluir vídeo:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('[videoManagementService] Erro capturado em deleteVideo:', error);
    return {
      success: false,
      error: error.message || 'Erro ao excluir o vídeo'
    };
  }
};

export const deleteVideos = async (videoIds: string[]): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .in('id', videoIds);

    if (error) {
      console.error('[videoManagementService] Erro ao excluir vídeos em massa:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('[videoManagementService] Erro capturado em deleteVideos:', error);
    return {
      success: false,
      error: error.message || 'Erro ao excluir os vídeos em massa'
    };
  }
};

export const updateVideos = async (videoIds: string[], updates: Partial<Video>): Promise<BulkUpdateResult> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .in('id', videoIds);

    if (error) {
      console.error('[videoManagementService] Erro ao atualizar vídeos em massa:', error);
      return { success: false, error: error.message || 'Erro ao atualizar vídeos' };
    }

    return { success: true };
  } catch (error) {
    console.error('[videoManagementService] Erro capturado em updateVideos:', error);
    return { success: false, error: error.message || 'Erro ao atualizar vídeos' };
  }
};

export const removeMockupVideos = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Assuming there's a way to identify mockup videos, e.g., through a specific tag or naming convention
    const { data, error } = await supabase
      .from('videos')
      .delete()
      .like('titulo', 'Mockup%'); // Example: delete videos with titles starting with "Mockup"

    if (error) {
      console.error('[videoManagementService] Erro ao remover vídeos mockup:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('[videoManagementService] Erro capturado em removeMockupVideos:', error);
    return {
      success: false,
      error: error.message || 'Erro ao remover vídeos mockup'
    };
  }
};
