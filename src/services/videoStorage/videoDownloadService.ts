
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/types/supabase';

/**
 * Log a video download event
 */
export async function downloadVideo(videoId: string, quality: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('video_downloads')
      .insert({
        video_id: videoId,
        quality: quality,
        user_id: user?.id || '00000000-0000-0000-0000-000000000000', // Anonymous user ID for non-logged in users
        user_agent: navigator.userAgent,
      });

    if (error) {
      console.error('Error logging download:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error logging download:', error);
    return { success: false, error: 'Unknown error occurred' };
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
      .from('videos_storage')
      .select('*')
      .eq('id', videoId)
      .single();
    
    if (videoError || !video) {
      throw new Error(videoError?.message || 'Video not found');
    }
    
    // Get the highest quality URL available
    const fileUrls = video.file_urls as Record<string, string> || {};
    
    const downloadUrl = fileUrls.original || 
                        fileUrls.hd || 
                        fileUrls.sd || 
                        fileUrls.web_optimized;
    
    if (!downloadUrl) {
      throw new Error('No download URL available for this video');
    }
    
    // Create a filename from the video title or use a default
    const filename = `${video.title || 'video'}-${Date.now()}.mp4`;
    
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
