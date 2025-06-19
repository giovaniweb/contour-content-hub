import { supabase } from '@/integrations/supabase/client';
import { Video, VideoFilterOptions, VideoSortOptions, VideoStatistics } from '@/types/video-storage';

export async function deleteVideo(videoId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('🗑️ Deletando vídeo:', videoId);
    
    // First get the video to find the file path
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('url_video, thumbnail_url')
      .eq('id', videoId)
      .single();
    
    if (fetchError) {
      throw new Error('Vídeo não encontrado');
    }
    
    const filesToDelete: string[] = [];
    
    // Extract file path from URL
    if (video.url_video && typeof video.url_video === 'string' && video.url_video.trim() !== '') {
      try {
        const url = new URL(video.url_video);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.indexOf('videos');

        if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
          const filePath = pathParts.slice(bucketIndex + 1).join('/');
          if (filePath.trim() !== '') { // Adicionar verificação para filePath não ser vazia
            filesToDelete.push(filePath);
          } else {
            console.warn(`Caminho do arquivo de vídeo extraído resultou em string vazia para videoId ${videoId} da URL: ${video.url_video}`);
          }
        } else {
          console.warn(`Não foi possível determinar o caminho do arquivo de vídeo no storage a partir da URL para videoId ${videoId}: ${video.url_video}`);
        }
      } catch (e) {
        console.warn(`Erro ao processar url_video para videoId ${videoId}: ${video.url_video}. Erro: ${e.message}`);
      }
    } else {
      console.warn(`URL de vídeo inválida ou ausente para videoId ${videoId}:`, video.url_video);
    }
    
    // Extract thumbnail path if exists
    if (video.thumbnail_url && typeof video.thumbnail_url === 'string' && video.thumbnail_url.trim() !== '') {
      try {
        const thumbnailUrlObj = new URL(video.thumbnail_url); // Renomeado para evitar conflito
        const thumbnailParts = thumbnailUrlObj.pathname.split('/');
        const bucketIndex = thumbnailParts.indexOf('videos'); // Assume que thumbnails também estão no bucket 'videos'

        if (bucketIndex !== -1 && bucketIndex < thumbnailParts.length - 1) {
          const thumbnailPath = thumbnailParts.slice(bucketIndex + 1).join('/');
          if (thumbnailPath.trim() !== '') { // Adicionar verificação para thumbnailPath não ser vazia
            filesToDelete.push(thumbnailPath);
          } else {
            console.warn(`Caminho da thumbnail extraído resultou em string vazia para videoId ${videoId} da URL: ${video.thumbnail_url}`);
          }
        } else {
          console.warn(`Não foi possível determinar o caminho da thumbnail no storage a partir da URL para videoId ${videoId}: ${video.thumbnail_url}`);
        }
      } catch (e) {
        console.warn(`Erro ao processar thumbnail_url para videoId ${videoId}: ${video.thumbnail_url}. Erro: ${e.message}`);
      }
    } else {
      console.warn(`URL de thumbnail inválida ou ausente para videoId ${videoId}:`, video.thumbnail_url);
    }
    
    // Delete files from storage
    if (filesToDelete.length === 0) {
      console.log('Nenhum arquivo associado encontrado no storage para deletar para o vídeo ID:', videoId);
    } else {
      console.log('Tentando deletar os seguintes arquivos do storage para o vídeo ID:', videoId, filesToDelete);
    }

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove(filesToDelete);
      
      if (storageError) {
        // Tornar o erro do storage crítico
        throw new Error(`Erro ao deletar arquivos do storage: ${storageError.message}`);
      } else {
        console.log('🗑️ Arquivos deletados do storage:', filesToDelete);
      }
    }
    
    // Delete related records first (foreign key constraints)
    await supabase.from('video_downloads').delete().eq('video_id', videoId);
    await supabase.from('favoritos').delete().eq('video_id', videoId);
    await supabase.from('avaliacoes').delete().eq('video_id', videoId);
    
    // Delete record from database
    const { error: dbError } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);
    
    if (dbError) {
      throw new Error(`Erro ao deletar registro: ${dbError.message}`);
    }
    
    console.log('✅ Vídeo deletado com sucesso:', videoId);
    return { success: true };
    
  } catch (error) {
    console.error('💥 Erro ao deletar vídeo:', error);
    return {
      success: false,
      error: error.message || 'Erro ao deletar vídeo'
    };
  }
}

// Add alias for VideoActionMenu compatibility
export const deleteVideoCompletely = deleteVideo;

export async function deleteVideos(videoIds: string[]): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('🗑️ Deletando vídeos em lote:', videoIds.length);
    
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    
    // Delete videos one by one to handle errors properly
    for (const videoId of videoIds) {
      const result = await deleteVideo(videoId);
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
        errors.push(`${videoId}: ${result.error}`);
      }
    }
    
    if (errorCount > 0) {
      console.warn(`⚠️ ${errorCount} vídeos falharam ao deletar:`, errors);
      return {
        success: false,
        error: `${successCount} vídeos deletados, ${errorCount} falharam. Erros: ${errors.join('; ')}`
      };
    }
    
    console.log(`✅ ${successCount} vídeos deletados com sucesso`);
    return { success: true };
    
  } catch (error) {
    console.error('💥 Erro ao deletar vídeos em lote:', error);
    return {
      success: false,
      error: error.message || 'Erro ao deletar vídeos'
    };
  }
}

export async function getVideos(
  filters: VideoFilterOptions = {},
  sortOptions: VideoSortOptions = { field: 'data_upload', direction: 'desc' },
  page: number = 1,
  pageSize: number = 20
): Promise<{
  success: boolean;
  videos: Video[];
  total: number;
  error?: string;
}> {
  try {
    console.log('📥 Buscando vídeos:', { filters, sortOptions, page, pageSize });
    
    let query = supabase.from('videos').select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.search) {
      query = query.or(`titulo.ilike.%${filters.search}%,descricao_curta.ilike.%${filters.search}%,descricao_detalhada.ilike.%${filters.search}%`);
    }
    
    if (filters.category) {
      query = query.eq('categoria', filters.category);
    }
    
    if (filters.equipment && filters.equipment.length > 0) {
      // For array columns, check if any equipment matches
      query = query.overlaps('equipamentos', filters.equipment);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }
    
    if (filters.startDate) {
      query = query.gte('data_upload', filters.startDate.toISOString());
    }
    
    if (filters.endDate) {
      query = query.lte('data_upload', filters.endDate.toISOString());
    }

    if (filters.status && filters.status.length > 0) {
      // Assumindo que a coluna de status no BD se chama 'status'
      // e que VideoStatus é um array de strings válidas para o status.
      query = query.in('status', filters.status);
    }
    
    // Apply sorting
    const validSortFields = ['data_upload', 'titulo', 'downloads_count', 'favoritos_count', 'curtidas', 'status']; // Adicionado 'status' se for um campo ordenável
    const sortField = validSortFields.includes(sortOptions.field) ? sortOptions.field : 'data_upload';
    query = query.order(sortField, { ascending: sortOptions.direction === 'asc' });
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    
    const { data: videos, error, count } = await query;
    
    if (error) {
      throw new Error(error.message);
    }
    
    console.log(`✅ ${videos?.length || 0} vídeos encontrados de ${count || 0} total`);
    
    // Type assertion to handle tipo_video string to literal type conversion
    const typedVideos: Video[] = (videos || []).map(video => ({
      ...video,
      tipo_video: (video.tipo_video === 'take' ? 'take' : 'video_pronto') as 'video_pronto' | 'take'
    }));
    
    return {
      success: true,
      videos: typedVideos,
      total: count || 0
    };
    
  } catch (error) {
    console.error('💥 Erro ao buscar vídeos:', error);
    return {
      success: false,
      videos: [],
      total: 0,
      error: error.message || 'Erro ao buscar vídeos'
    };
  }
}

export async function getVideoById(videoId: string): Promise<{
  success: boolean;
  video?: Video;
  error?: string;
}> {
  try {
    console.log('📥 Buscando vídeo por ID:', videoId);
    
    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .maybeSingle();
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!video) {
      return {
        success: false,
        error: 'Vídeo não encontrado'
      };
    }
    
    console.log('✅ Vídeo encontrado:', video.titulo);
    
    // Type assertion to handle tipo_video string to literal type conversion
    const typedVideo: Video = {
      ...video,
      tipo_video: (video.tipo_video === 'take' ? 'take' : 'video_pronto') as 'video_pronto' | 'take'
    };
    
    return {
      success: true,
      video: typedVideo
    };
    
  } catch (error) {
    console.error('💥 Erro ao buscar vídeo:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar vídeo'
    };
  }
}

export async function updateVideo(
  videoId: string,
  updates: Partial<Video>
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('📝 Atualizando vídeo:', videoId, updates);
    
    // Clean up the updates object - remove undefined and null values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
    );
    
    const { error } = await supabase
      .from('videos')
      .update(cleanUpdates)
      .eq('id', videoId);
    
    if (error) {
      throw new Error(`Erro ao atualizar vídeo: ${error.message}`);
    }
    
    console.log('✅ Vídeo atualizado com sucesso:', videoId);
    return { success: true };
    
  } catch (error) {
    console.error('💥 Erro ao atualizar vídeo:', error);
    return {
      success: false,
      error: error.message || 'Erro ao atualizar vídeo'
    };
  }
}

export async function updateVideos(
  videoIds: string[],
  updates: Partial<Video>
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('📝 Atualizando vídeos em lote:', videoIds.length, updates);
    
    // Clean up the updates object
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
    );
    
    const { error } = await supabase
      .from('videos')
      .update(cleanUpdates)
      .in('id', videoIds);
    
    if (error) {
      throw new Error(`Erro ao atualizar vídeos: ${error.message}`);
    }
    
    console.log(`✅ ${videoIds.length} vídeos atualizados com sucesso`);
    return { success: true };
    
  } catch (error) {
    console.error('💥 Erro ao atualizar vídeos:', error);
    return {
      success: false,
      error: error.message || 'Erro ao atualizar vídeos'
    };
  }
}

export async function downloadVideo(
  videoId: string,
  quality: string = 'original'
): Promise<{
  success: boolean;
  downloadUrl?: string;
  error?: string;
}> {
  try {
    console.log('📥 Iniciando download do vídeo:', videoId);
    
    // Get authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error('Usuário não autenticado');
    }
    
    // Get video details
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .maybeSingle();
    
    if (videoError) {
      throw new Error(videoError.message);
    }
    
    if (!video) {
      throw new Error('Vídeo não encontrado');
    }
    
    // Log download
    const { error: logError } = await supabase
      .from('video_downloads')
      .insert({
        video_id: videoId,
        user_id: userData.user.id,
        quality,
        downloaded_at: new Date().toISOString(),
        ip_address: null, // Will be populated by RLS if needed
        user_agent: navigator.userAgent
      });
    
    if (logError) {
      console.warn('⚠️ Erro ao registrar download:', logError);
    }
    
    // Update download count
    const { error: updateError } = await supabase
      .from('videos')
      .update({
        downloads_count: (video.downloads_count || 0) + 1
      })
      .eq('id', videoId);
    
    if (updateError) {
      console.warn('⚠️ Erro ao atualizar contador:', updateError);
    }
    
    console.log('✅ Download registrado com sucesso');
    
    return {
      success: true,
      downloadUrl: video.url_video
    };
    
  } catch (error) {
    console.error('💥 Erro no download:', error);
    return {
      success: false,
      error: error.message || 'Erro no download'
    };
  }
}

export async function getVideoStatistics(videoId: string): Promise<{
  success: boolean;
  statistics?: VideoStatistics;
  error?: string;
}> {
  try {
    // Get video data from the videos table
    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (error || !video) {
      return { success: false, error: 'Vídeo não encontrado' };
    }

    const statistics: VideoStatistics = {
      totalViews: 0, // Placeholder - implement view tracking if needed
      totalDownloads: video.downloads_count || 0,
      totalShares: video.compartilhamentos || 0,
      averageRating: 0, // Placeholder - implement rating system if needed
      uploadDate: video.data_upload || video.created_at,
      fileSize: video.duracao ? `${video.duracao}` : undefined,
      duration: video.duracao
    };

    return { success: true, statistics };
  } catch (error) {
    console.error('Erro ao buscar estatísticas do vídeo:', error);
    return { success: false, error: 'Erro ao buscar estatísticas' };
  }
}

export async function copyVideoLink(videoId: string): Promise<{
  success: boolean;
  link?: string;
  error?: string;
}> {
  try {
    const { data: video, error } = await supabase
      .from('videos')
      .select('url_video')
      .eq('id', videoId)
      .maybeSingle();
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!video || !video.url_video) {
      throw new Error('Vídeo ou URL não encontrado');
    }
    
    // Copy to clipboard
    await navigator.clipboard.writeText(video.url_video);
    
    return {
      success: true,
      link: video.url_video
    };
    
  } catch (error) {
    console.error('💥 Erro ao copiar link:', error);
    return {
      success: false,
      error: error.message || 'Erro ao copiar link'
    };
  }
}

// Remove mockup videos function
export async function removeMockupVideos(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('🧹 Iniciando remoção de vídeos mockup...');

    const { data: mockupVideos, error: fetchError } = await supabase
      .from('videos')
      .select('id') // Apenas o ID é necessário para chamar deleteVideo
      .or('titulo.ilike.%mock%,titulo.ilike.%test%,titulo.ilike.%exemplo%,url_video.like.%placeholder%,url_video.like.%via.placeholder%');

    if (fetchError) {
      console.error('💥 Erro ao buscar vídeos mockup:', fetchError);
      throw new Error(`Erro ao buscar vídeos mockup: ${fetchError.message}`);
    }

    if (!mockupVideos || mockupVideos.length === 0) {
      console.log('ℹ️ Nenhum vídeo mockup encontrado para remover.');
      return { success: true };
    }

    console.log(`🔎 Encontrados ${mockupVideos.length} vídeos mockup para remover.`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const video of mockupVideos) {
      if (video.id) { // Garantir que o ID existe
        console.log(`🗑️ Tentando remover vídeo mockup com ID: ${video.id}`);
        const result = await deleteVideo(video.id); // Reutiliza a função deleteVideo robusta
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          errors.push(`ID ${video.id}: ${result.error || 'Erro desconhecido'}`);
          console.warn(`⚠️ Falha ao remover vídeo mockup ID ${video.id}: ${result.error}`);
        }
      } else {
        console.warn('⚠️ Encontrado vídeo mockup sem ID, pulando:', video);
        // Opcionalmente, incrementar errorCount ou logar de forma diferente
      }
    }

    if (errorCount > 0) {
      const errorMessage = `${successCount} vídeos mockup removidos, ${errorCount} falharam. Erros: ${errors.join('; ')}`;
      console.warn(`🏁 Remoção de vídeos mockup concluída com falhas: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage
      };
    }

    console.log(`✅ ${successCount} vídeos mockup removidos com sucesso.`);
    return { success: true };

  } catch (error) {
    console.error('💥 Erro geral ao remover vídeos mockup:', error);
    return {
      success: false,
      error: error.message || 'Erro ao remover vídeos mockup'
    };
  }
}
