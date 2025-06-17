
import { supabase } from '@/integrations/supabase/client';

/**
 * Log a video download event and trigger automatic download
 */
export async function downloadVideo(videoId: string, quality: string = 'original'): Promise<{ 
  success: boolean; 
  downloadUrl?: string;
  error?: string 
}> {
  try {
    console.log('📥 Iniciando download do vídeo:', videoId);
    
    // Get video details
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .maybeSingle();
    
    if (videoError || !video) {
      throw new Error(videoError?.message || 'Vídeo não encontrado');
    }
    
    if (!video.url_video) {
      throw new Error('URL do vídeo não disponível');
    }
    
    // Get current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Log the download attempt
    const { error: logError } = await supabase
      .from('video_downloads')
      .insert({
        video_id: videoId,
        quality: quality,
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
        user_agent: navigator.userAgent,
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

/**
 * Generate a download URL for a video
 */
export async function generateDownloadUrl(videoId: string): Promise<{ 
  url?: string; 
  filename?: string; 
  error?: string 
}> {
  try {
    // Get the video details first
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .maybeSingle();
    
    if (videoError || !video) {
      throw new Error(videoError?.message || 'Video not found');
    }
    
    const downloadUrl = video.url_video;
    
    if (!downloadUrl) {
      throw new Error('No download URL available for this video');
    }
    
    // Create a filename from the video title or use a default
    const filename = `${video.titulo || 'video'}-${Date.now()}.mp4`;
    
    // Log the download
    await downloadVideo(videoId, 'download');
    
    return { 
      url: downloadUrl, 
      filename 
    };
  } catch (error) {
    console.error('Error generating download URL:', error);
    return { error: error.message || 'Failed to generate download URL' };
  }
}
