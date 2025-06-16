
import { supabase } from '@/integrations/supabase/client';

export interface Video {
  id: string;
  titulo: string;
  descricao_curta?: string;
  descricao_detalhada?: string;
  url_video?: string;
  preview_url?: string;
  tipo_video: string;
  equipamentos?: string[];
  tags?: string[];
  data_upload: string;
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
 * Upload de vídeo
 */
export async function uploadVideo(
  file: File,
  metadata: {
    titulo: string;
    descricao_curta?: string;
    equipamentos?: string[];
    tags?: string[];
  }
): Promise<{ success: boolean; videoId?: string; error?: string }> {
  try {
    console.log('🚀 Iniciando upload do vídeo:', file.name);
    
    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const fileName = `video_${timestamp}_${random}.${file.name.split('.').pop()}`;
    
    // Upload do arquivo para o Storage
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    // Criar registro na tabela videos
    const { data: video, error: insertError } = await supabase
      .from('videos')
      .insert({
        titulo: metadata.titulo,
        descricao_curta: metadata.descricao_curta,
        url_video: publicUrlData.publicUrl,
        preview_url: publicUrlData.publicUrl, // Por enquanto usa a mesma URL
        tipo_video: 'video_pronto',
        equipamentos: metadata.equipamentos || [],
        tags: metadata.tags || [],
        data_upload: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log('✅ Upload concluído com sucesso');
    return { success: true, videoId: video.id };
  } catch (error) {
    console.error('💥 Erro no upload:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido no upload'
    };
  }
}
