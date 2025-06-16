import { supabase } from '@/integrations/supabase/client';
import { Video } from './videoService';

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
    // First get the video to find the file path
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('url_video')
      .eq('id', videoId)
      .single();
    
    if (fetchError) {
      throw new Error('Vídeo não encontrado');
    }
    
    // Extract file path from URL
    if (video.url_video) {
      const url = new URL(video.url_video);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.indexOf('videos');
      
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        
        // Delete file from storage
        const { error: storageError } = await supabase.storage
          .from('videos')
          .remove([filePath]);
        
        if (storageError) {
          console.warn('Erro ao deletar arquivo do storage:', storageError);
        }
      }
    }
    
    // Delete record from database
    const { error: dbError } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);
    
    if (dbError) {
      throw new Error(`Erro ao deletar registro: ${dbError.message}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    return {
      success: false,
      error: error.message || 'Erro ao deletar vídeo'
    };
  }
}

export async function deleteVideoCompletely(videoId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  return deleteVideo(videoId);
}

export async function getVideos(
  filters: any = {},
  sortOptions: any = { field: 'created_at', direction: 'desc' },
  page: number = 1,
  pageSize: number = 20
): Promise<{
  success: boolean;
  videos: Video[];
  total: number;
  error?: string;
}> {
  try {
    let query = supabase.from('videos').select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.search) {
      query = query.ilike('titulo', `%${filters.search}%`);
    }
    
    // Apply sorting
    query = query.order(sortOptions.field, { ascending: sortOptions.direction === 'asc' });
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    
    const { data: videos, error, count } = await query;
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      success: true,
      videos: videos || [],
      total: count || 0
    };
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    return {
      success: false,
      videos: [],
      total: 0,
      error: error.message || 'Erro ao buscar vídeos'
    };
  }
}

export async function getMyVideos(
  userId: string,
  filters: any = {},
  page: number = 1,
  pageSize: number = 20
): Promise<{
  success: boolean;
  videos: Video[];
  total: number;
  error?: string;
}> {
  return getVideos({ ...filters, user_id: userId }, { field: 'created_at', direction: 'desc' }, page, pageSize);
}

export async function getVideoById(videoId: string): Promise<{
  success: boolean;
  video?: Video;
  error?: string;
}> {
  try {
    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();
    
    if (error || !video) {
      throw new Error('Vídeo não encontrado');
    }
    
    return {
      success: true,
      video
    };
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar vídeo'
    };
  }
}

export async function getVideoStatistics(videoId: string): Promise<{
  success: boolean;
  statistics?: VideoStatistics;
  error?: string;
}> {
  try {
    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();
    
    if (error || !video) {
      throw new Error('Vídeo não encontrado');
    }
    
    // Get download count from video_downloads table
    const { data: downloads, error: downloadError } = await supabase
      .from('video_downloads')
      .select('id')
      .eq('video_id', videoId);
    
    const totalDownloads = downloads?.length || video.downloads_count || 0;
    
    const statistics: VideoStatistics = {
      totalViews: 0, // Not implemented yet
      totalDownloads,
      totalShares: video.compartilhamentos || 0,
      averageRating: 0, // Calculate from avaliacoes table if needed
      uploadDate: video.data_upload,
      duration: video.duracao
    };
    
    return {
      success: true,
      statistics
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar estatísticas'
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
      .single();
    
    if (videoError || !video) {
      throw new Error('Vídeo não encontrado');
    }
    
    // Log download
    const { error: logError } = await supabase
      .from('video_downloads')
      .insert({
        video_id: videoId,
        user_id: userData.user.id,
        quality,
        downloaded_at: new Date().toISOString()
      });
    
    if (logError) {
      console.warn('Erro ao registrar download:', logError);
    }
    
    // Update download count
    const { error: updateError } = await supabase
      .from('videos')
      .update({
        downloads_count: (video.downloads_count || 0) + 1
      })
      .eq('id', videoId);
    
    if (updateError) {
      console.warn('Erro ao atualizar contador:', updateError);
    }
    
    return {
      success: true,
      downloadUrl: video.url_video
    };
  } catch (error) {
    console.error('Erro no download:', error);
    return {
      success: false,
      error: error.message || 'Erro no download'
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
      .single();
    
    if (error || !video) {
      throw new Error('Vídeo não encontrado');
    }
    
    if (!video.url_video) {
      throw new Error('URL do vídeo não disponível');
    }
    
    return {
      success: true,
      link: video.url_video
    };
  } catch (error) {
    console.error('Erro ao obter link:', error);
    return {
      success: false,
      error: error.message || 'Erro ao obter link'
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
    const { error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', videoId);
    
    if (error) {
      throw new Error(`Erro ao atualizar vídeo: ${error.message}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    return {
      success: false,
      error: error.message || 'Erro ao atualizar vídeo'
    };
  }
}
