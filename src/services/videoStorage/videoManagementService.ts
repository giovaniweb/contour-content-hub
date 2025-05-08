
import { supabase } from '@/integrations/supabase/client';
import { 
  StoredVideo, 
  VideoFilterOptions, 
  VideoSortOptions, 
  VideoStatus 
} from '@/types/video-storage';

/**
 * Fetch videos with optional filtering and sorting
 */
export async function getVideos(
  filter?: VideoFilterOptions,
  sort?: VideoSortOptions,
  page: number = 1,
  pageSize: number = 20
): Promise<{ videos: StoredVideo[]; total: number; error?: string }> {
  try {
    let query = supabase.from('videos_storage').select('*', { count: 'exact' });

    // Aplicar filtros
    if (filter) {
      if (filter.search) {
        query = query.ilike('title', `%${filter.search}%`);
      }
      
      if (filter.tags && filter.tags.length > 0) {
        query = query.contains('tags', filter.tags);
      }
      
      if (filter.status && filter.status.length > 0) {
        query = query.in('status', filter.status);
      }
      
      if (filter.startDate) {
        query = query.gte('created_at', filter.startDate.toISOString());
      }
      
      if (filter.endDate) {
        query = query.lte('created_at', filter.endDate.toISOString());
      }
      
      if (filter.owner) {
        query = query.eq('owner_id', filter.owner);
      }
    }

    // Aplicar ordenação
    if (sort) {
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Paginação
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar vídeos:', error);
      return { videos: [], total: 0, error: 'Falha ao carregar vídeos.' };
    }

    return { 
      videos: data as unknown as StoredVideo[], 
      total: count || 0 
    };
    
  } catch (error) {
    console.error('Erro ao carregar vídeos:', error);
    return { videos: [], total: 0, error: 'Ocorreu um erro inesperado. Por favor, tente novamente.' };
  }
}

/**
 * Fetch videos owned by the current user
 */
export async function getMyVideos(
  filter?: VideoFilterOptions,
  sort?: VideoSortOptions,
  page: number = 1,
  pageSize: number = 20
): Promise<{ videos: StoredVideo[]; total: number; error?: string }> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  if (!userId) {
    return { videos: [], total: 0, error: 'Usuário não autenticado.' };
  }
  
  return getVideos(
    { ...filter, owner: userId },
    sort,
    page,
    pageSize
  );
}

/**
 * Fetch a single video by ID
 */
export async function getVideoById(videoId: string): Promise<{ video?: StoredVideo; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('videos_storage')
      .select('*')
      .eq('id', videoId)
      .single();

    if (error) {
      console.error('Erro ao buscar vídeo:', error);
      return { error: 'Vídeo não encontrado.' };
    }

    return { video: data as unknown as StoredVideo };
    
  } catch (error) {
    console.error('Erro ao carregar detalhes do vídeo:', error);
    return { error: 'Ocorreu um erro inesperado. Por favor, tente novamente.' };
  }
}

/**
 * Update a video's metadata
 */
export async function updateVideo(
  videoId: string, 
  data: {
    title?: string;
    description?: string;
    tags?: string[];
    public?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!userId) {
      return { success: false, error: 'Usuário não autenticado.' };
    }

    // Verificar se o vídeo existe e pertence ao usuário
    const { data: video, error: videoError } = await supabase
      .from('videos_storage')
      .select('*')
      .eq('id', videoId)
      .eq('owner_id', userId)
      .single();

    if (videoError || !video) {
      return { success: false, error: 'Vídeo não encontrado ou você não tem permissão para editá-lo.' };
    }

    // Atualizar dados
    const { error: updateError } = await supabase
      .from('videos_storage')
      .update({
        title: data.title,
        description: data.description,
        tags: data.tags,
        public: data.public,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId);

    if (updateError) {
      console.error('Erro ao atualizar vídeo:', updateError);
      return { success: false, error: 'Erro ao atualizar vídeo. Tente novamente.' };
    }

    return { success: true };
    
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    return { success: false, error: 'Ocorreu um erro inesperado. Por favor, tente novamente.' };
  }
}

/**
 * Delete a video and its associated files
 */
export async function deleteVideo(videoId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!userId) {
      return { success: false, error: 'Usuário não autenticado.' };
    }

    // 1. Verificar se o vídeo existe e pertence ao usuário
    const { data: video, error: videoError } = await supabase
      .from('videos_storage')
      .select('*')
      .eq('id', videoId)
      .eq('owner_id', userId)
      .single();

    if (videoError || !video) {
      return { success: false, error: 'Vídeo não encontrado ou você não tem permissão para excluí-lo.' };
    }

    // 2. Excluir arquivos do storage
    const { data: files, error: listError } = await supabase.storage
      .from('videos')
      .list(videoId);

    if (!listError && files && files.length > 0) {
      const filePaths = files.map(file => `${videoId}/${file.name}`);
      await supabase.storage.from('videos').remove(filePaths);
    }

    // 3. Excluir registro do banco de dados
    const { error: deleteError } = await supabase
      .from('videos_storage')
      .delete()
      .eq('id', videoId);

    if (deleteError) {
      console.error('Erro ao excluir vídeo do banco:', deleteError);
      return { success: false, error: 'Erro ao excluir vídeo. Tente novamente.' };
    }

    return { success: true };
    
  } catch (error) {
    console.error('Erro ao excluir vídeo:', error);
    return { success: false, error: 'Ocorreu um erro inesperado. Por favor, tente novamente.' };
  }
}
