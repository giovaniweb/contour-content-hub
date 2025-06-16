
import { supabase } from '@/integrations/supabase/client';
import { Video, VideoFilterOptions, VideoSortOptions } from '@/types/video-storage';

export interface VideoStatistics {
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
  averageRating: number;
  uploadDate: string;
  fileSize?: string;
  duration?: string;
}

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
    if (video.url_video) {
      const url = new URL(video.url_video);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.indexOf('videos');
      
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        filesToDelete.push(filePath);
      }
    }
    
    // Extract thumbnail path if exists
    if (video.thumbnail_url) {
      const thumbnailUrl = new URL(video.thumbnail_url);
      const thumbnailParts = thumbnailUrl.pathname.split('/');
      const bucketIndex = thumbnailParts.indexOf('videos');
      
      if (bucketIndex !== -1 && bucketIndex < thumbnailParts.length - 1) {
        const thumbnailPath = thumbnailParts.slice(bucketIndex + 1).join('/');
        filesToDelete.push(thumbnailPath);
      }
    }
    
    // Delete files from storage
    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove(filesToDelete);
      
      if (storageError) {
        console.warn('⚠️ Erro ao deletar arquivos do storage:', storageError);
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
    
    // Apply sorting
    const validSortFields = ['data_upload', 'titulo', 'downloads_count', 'favoritos_count', 'curtidas'];
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
    console.log('📊 Buscando estatísticas do vídeo:', videoId);
    
    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .maybeSingle();
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!video) {
      throw new Error('Vídeo não encontrado');
    }
    
    // Get download count from video_downloads table
    const { data: downloads, error: downloadError } = await supabase
      .from('video_downloads')
      .select('id')
      .eq('video_id', videoId);
    
    const totalDownloads = downloads?.length || video.downloads_count || 0;
    
    const statistics: VideoStatistics = {
      totalViews: 0, // Not implemented yet - could be added later
      totalDownloads,
      totalShares: video.compartilhamentos || 0,
      averageRating: 0, // Could calculate from avaliacoes table if needed
      uploadDate: video.data_upload,
      duration: video.duracao
    };
    
    console.log('✅ Estatísticas obtidas:', statistics);
    
    return {
      success: true,
      statistics
    };
    
  } catch (error) {
    console.error('💥 Erro ao buscar estatísticas:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar estatísticas'
    };
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
    console.log('🧹 Removendo vídeos mockup...');
    
    const { error } = await supabase
      .from('videos')
      .delete()
      .or('titulo.ilike.%mock%,titulo.ilike.%test%,titulo.ilike.%exemplo%,url_video.like.%placeholder%,url_video.like.%via.placeholder%');
    
    if (error) {
      throw new Error(error.message);
    }
    
    console.log('✅ Vídeos mockup removidos');
    return { success: true };
    
  } catch (error) {
    console.error('💥 Erro ao remover vídeos mockup:', error);
    return {
      success: false,
      error: error.message || 'Erro ao remover vídeos mockup'
    };
  }
}
