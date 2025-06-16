
import { supabase } from '@/integrations/supabase/client';

export interface Video {
  id: string;
  titulo: string;
  descricao_curta?: string;
  descricao_detalhada?: string;
  url_video?: string;
  preview_url?: string;
  thumbnail_url?: string;
  tipo_video: string;
  equipamentos?: string[];
  tags?: string[];
  data_upload: string;
  downloads_count?: number;
  equipment_id?: string;
}

export interface VideoFilters {
  search?: string;
  equipment?: string;
  tags?: string[];
  tipo_video?: string;
}

/**
 * Buscar vídeos com filtros
 */
export async function getVideos(
  filters: VideoFilters = {},
  page: number = 1,
  pageSize: number = 20
): Promise<{ videos: Video[]; total: number; error?: string }> {
  try {
    let query = supabase
      .from('videos')
      .select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters.search) {
      query = query.or(`titulo.ilike.%${filters.search}%,descricao_curta.ilike.%${filters.search}%`);
    }

    if (filters.equipment) {
      query = query.contains('equipamentos', [filters.equipment]);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters.tipo_video) {
      query = query.eq('tipo_video', filters.tipo_video);
    }

    // Ordenação
    query = query.order('data_upload', { ascending: false });

    // Paginação
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return {
      videos: data as Video[],
      total: count || 0
    };
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    return {
      videos: [],
      total: 0,
      error: 'Erro ao carregar vídeos'
    };
  }
}

/**
 * Buscar vídeo por ID
 */
export async function getVideoById(id: string): Promise<{ video: Video | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { video: data as Video };
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
    return {
      video: null,
      error: 'Vídeo não encontrado'
    };
  }
}

/**
 * Atualizar vídeo
 */
export async function updateVideo(id: string, updates: Partial<Video>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    return {
      success: false,
      error: 'Erro ao atualizar vídeo'
    };
  }
}

/**
 * Excluir vídeo
 */
export async function deleteVideo(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Primeiro buscar o vídeo para obter a URL e excluir o arquivo do storage
    const { data: video } = await supabase
      .from('videos')
      .select('url_video')
      .eq('id', id)
      .single();

    if (video?.url_video) {
      // Extrair o caminho do arquivo da URL
      const url = new URL(video.url_video);
      const filePath = url.pathname.split('/storage/v1/object/public/videos/')[1];
      
      if (filePath) {
        console.log('🗑️ Excluindo arquivo do storage:', filePath);
        await supabase.storage
          .from('videos')
          .remove([filePath]);
      }
    }

    // Excluir registro da tabela
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir vídeo:', error);
    return {
      success: false,
      error: 'Erro ao excluir vídeo'
    };
  }
}

/**
 * Excluir múltiplos vídeos
 */
export async function deleteVideos(ids: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar URLs dos vídeos para excluir arquivos do storage
    const { data: videos } = await supabase
      .from('videos')
      .select('url_video')
      .in('id', ids);

    if (videos && videos.length > 0) {
      const filePaths = videos
        .filter(video => video.url_video)
        .map(video => {
          const url = new URL(video.url_video);
          return url.pathname.split('/storage/v1/object/public/videos/')[1];
        })
        .filter(Boolean);

      if (filePaths.length > 0) {
        console.log('🗑️ Excluindo arquivos do storage:', filePaths);
        await supabase.storage
          .from('videos')
          .remove(filePaths);
      }
    }

    // Excluir registros da tabela
    const { error } = await supabase
      .from('videos')
      .delete()
      .in('id', ids);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir vídeos:', error);
    return {
      success: false,
      error: 'Erro ao excluir vídeos'
    };
  }
}

/**
 * Atualizar múltiplos vídeos
 */
export async function updateVideos(ids: string[], updates: Partial<Video>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('videos')
      .update(updates)
      .in('id', ids);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar vídeos:', error);
    return {
      success: false,
      error: 'Erro ao atualizar vídeos'
    };
  }
}

/**
 * Remover vídeos de mockup
 */
export async function removeMockupVideos(): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar vídeos que parecem ser mockup (baseado em títulos ou URLs)
    const { data: mockupVideos, error: fetchError } = await supabase
      .from('videos')
      .select('id, titulo, url_video')
      .or('titulo.ilike.%mockup%,titulo.ilike.%test%,titulo.ilike.%exemplo%');

    if (fetchError) throw fetchError;

    if (mockupVideos && mockupVideos.length > 0) {
      const mockupIds = mockupVideos.map(v => v.id);
      const result = await deleteVideos(mockupIds);
      
      if (result.success) {
        console.log(`🧹 Removidos ${mockupVideos.length} vídeos de mockup`);
      }
      
      return result;
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao remover vídeos mockup:', error);
    return {
      success: false,
      error: 'Erro ao remover vídeos mockup'
    };
  }
}
