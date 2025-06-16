
// Export all relevant video storage services
export {
  downloadVideo,
  generateDownloadUrl
} from './videoStorage/videoDownloadService';

export {
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo
} from './videoStorage/videoManagementService';

export {
  uploadVideo,
  batchUploadVideos
} from './videoStorage/videoUploadService';

import { supabase } from '@/integrations/supabase/client';

/**
 * Process or reprocess a video
 */
export async function processVideo(videoId: string, fileName: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔄 Iniciando processamento do vídeo:', videoId, fileName);
    
    // Call the edge function to process the video
    const { error } = await supabase.functions.invoke('process-video', {
      body: { videoId, fileName }
    });

    if (error) {
      console.error('❌ Erro na função process-video:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Processamento iniciado com sucesso');
    return { success: true };
    
  } catch (error) {
    console.error('💥 Erro no processamento:', error);
    return { success: false, error: 'Erro desconhecido no processamento' };
  }
}

/**
 * Play a video by its ID
 */
export async function playVideo(id: string): Promise<{ url: string | null; error?: string }> {
  try {
    // Get video from the videos table instead of videos_storage
    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !video) {
      throw new Error(error?.message || 'Video not found');
    }
    
    // Get video URL - use url_video field from videos table
    const playUrl = video.url_video;
    
    if (!playUrl) {
      throw new Error('No playable URL found for this video');
    }
    
    return { url: playUrl };
  } catch (error) {
    console.error(`Error preparing video ${id} for playback:`, error);
    return { 
      url: null, 
      error: 'Failed to load video for playback. Please try again.' 
    };
  }
}
