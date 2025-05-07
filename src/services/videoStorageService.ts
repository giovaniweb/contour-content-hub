
import { supabase } from '@/integrations/supabase/client';
import { StoredVideo, VideoFilterOptions, VideoQuality, VideoSortOptions, VideoStatus } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';

// Tamanho máximo de arquivo (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];

export async function uploadVideo(
  file: File,
  title: string,
  description: string,
  tags: string[],
  onProgress?: (progress: number) => void,
  isPublic: boolean = false
): Promise<{ success: boolean; videoId?: string; error?: string }> {
  try {
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: `O arquivo excede o tamanho máximo permitido (100MB)` };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { success: false, error: 'Formato de arquivo não suportado. Use MP4, MOV, AVI ou MKV.' };
    }

    // 1. Criar entrada no banco para o vídeo com status 'uploading'
    const { data: videoData, error: dbError } = await supabase
      .from('videos_storage')
      .insert({
        title,
        description,
        owner_id: (await supabase.auth.getUser()).data.user?.id,
        status: 'uploading' as VideoStatus,
        size: file.size,
        tags,
        public: isPublic
      })
      .select()
      .single();

    if (dbError || !videoData) {
      console.error('Erro ao criar registro do vídeo:', dbError);
      return { success: false, error: 'Erro ao iniciar upload. Por favor, tente novamente.' };
    }

    // 2. Upload do arquivo para o Storage
    const fileName = `${videoData.id}/original_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      
      // Atualizar status para erro em caso de falha
      await supabase
        .from('videos_storage')
        .update({ status: 'error' as VideoStatus })
        .eq('id', videoData.id);
      
      return { success: false, error: 'Falha no upload do arquivo.' };
    }

    // 3. Iniciar processamento de video (thumbnail e codificação)
    const { error: processingError } = await supabase.functions.invoke('process-video', {
      body: { videoId: videoData.id, fileName }
    });

    if (processingError) {
      console.error('Erro ao iniciar processamento:', processingError);
    }

    // 4. Atualizar status para 'processing'
    await supabase
      .from('videos_storage')
      .update({ 
        status: 'processing' as VideoStatus,
        file_urls: { original: supabase.storage.from('videos').getPublicUrl(fileName).data.publicUrl }
      })
      .eq('id', videoData.id);

    return { success: true, videoId: videoData.id };
    
  } catch (error) {
    console.error('Erro no processo de upload:', error);
    return { success: false, error: 'Ocorreu um erro inesperado. Por favor, tente novamente.' };
  }
}

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

export async function generateDownloadUrl(
  videoId: string, 
  quality: VideoQuality = 'original'
): Promise<{ url?: string; filename?: string; error?: string }> {
  try {
    // 1. Verificar se o vídeo existe e o usuário tem acesso
    const { data: video, error: videoError } = await supabase
      .from('videos_storage')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      return { error: 'Vídeo não encontrado ou acesso negado.' };
    }

    // 2. Determinar o path do arquivo baseado na qualidade
    const fileUrls = video.file_urls as Record<VideoQuality, string>;
    const qualityUrl = fileUrls[quality];
    
    if (!qualityUrl) {
      return { error: `Versão ${quality} do vídeo não está disponível.` };
    }

    // Extrair o path do storage a partir da URL pública
    const storageUrl = supabase.storage.from('videos').getPublicUrl('').data.publicUrl;
    const path = qualityUrl.replace(storageUrl, '');

    // 3. Gerar URL assinada para download
    const { data: signedUrlData, error: signUrlError } = await supabase.storage
      .from('videos')
      .createSignedUrl(path, 60, {
        download: video.title
      });

    if (signUrlError) {
      console.error('Erro ao gerar URL assinada:', signUrlError);
      return { error: 'Não foi possível gerar o link de download.' };
    }

    // 4. Registrar log de download
    await supabase.from('video_downloads').insert({
      video_id: videoId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      quality: quality,
      user_agent: navigator.userAgent
    });

    return { 
      url: signedUrlData.signedUrl,
      filename: `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}_${quality}.mp4`
    };
    
  } catch (error) {
    console.error('Erro ao gerar URL de download:', error);
    return { error: 'Ocorreu um erro inesperado. Por favor, tente novamente.' };
  }
}

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
