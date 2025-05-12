
import { supabase } from '@/integrations/supabase/client';
import { getVideos, getMyVideos, getVideoById, updateVideo, deleteVideo } from './videoStorage';

// Re-export from other services
export {
  getVideos,
  getMyVideos,
  getVideoById,
  updateVideo,
  deleteVideo
};

/**
 * Log a video download event
 */
export async function downloadVideo(videoId: string, quality: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('video_downloads')
      .insert({
        video_id: videoId,
        quality: quality,
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
 * Process or reprocess a video
 */
export async function processVideo(videoId: string, fileName: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Call the edge function to process the video
    const { error } = await supabase.functions.invoke('process-video', {
      body: { videoId, fileName }
    });

    if (error) {
      console.error('Error processing video:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
    
  } catch (error) {
    console.error('Error processing video:', error);
    return { success: false, error: 'Unknown error occurred' };
  }
}

/**
 * Reimport video metadata from Vimeo (if it exists)
 */
export async function reimportFromVimeo(videoId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the video first to check if it has a vimeo_id
    const { video, error: getError } = await getVideoById(videoId);
    
    if (getError || !video) {
      return { success: false, error: getError || 'Video not found' };
    }
    
    // Check if this video has a vimeo_id in its metadata
    const vimeoId = video.metadata?.vimeo_id;
    
    if (!vimeoId) {
      return { success: false, error: 'This video is not linked to Vimeo' };
    }
    
    // Call the edge function to reimport the video metadata
    const { error } = await supabase.functions.invoke('vimeo-reimport', {
      body: { videoId, vimeoId }
    });

    if (error) {
      console.error('Error reimporting from Vimeo:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
    
  } catch (error) {
    console.error('Error reimporting from Vimeo:', error);
    return { success: false, error: 'Unknown error occurred' };
  }
}
