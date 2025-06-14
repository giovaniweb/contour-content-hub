// Export all relevant video storage services
export {
  downloadVideo,
  generateDownloadUrl
} from './videoStorage/videoDownloadService';

export {
  getVideos,
  getMyVideos,
  getVideoById,
  updateVideo,
  deleteVideo
} from './videoStorage/videoManagementService';

export {
  uploadVideo,
  batchUploadVideos
} from './videoStorage/videoUploadService';

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
 * Play a video by its ID
 */
export async function playVideo(id: string): Promise<{ url: string | null; error?: string }> {
  try {
    const { video, error } = await getVideoById(id);
    
    if (error || !video) {
      throw new Error(error || 'Video not found');
    }
    
    // Get video URL based on available formats
    const fileUrls = video.file_urls || {};
    const playUrl = fileUrls.web_optimized || fileUrls.sd || fileUrls.hd || '';
    
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

// Import Supabase client for the functions above
import { supabase } from '@/integrations/supabase/client';
import { StoredVideo } from '@/types/video-storage';
import { getVideoById } from './videoStorage/videoManagementService';
