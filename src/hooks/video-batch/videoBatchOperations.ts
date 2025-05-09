
import { supabase } from '@/integrations/supabase/client';
import { StoredVideo } from '@/types/video-storage';

/**
 * Load videos data from storage
 */
export const loadVideosData = async (): Promise<{
  success: boolean;
  data?: StoredVideo[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('videos_storage')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return {
        success: false,
        error: error.message || 'Failed to load videos'
      };
    }

    // Process the video data to ensure it matches StoredVideo type
    const processedVideos: StoredVideo[] = data.map(video => ({
      id: video.id,
      title: video.title || '',
      description: video.description || '',
      thumbnail_url: video.thumbnail_url,
      status: video.status,
      created_at: video.created_at,
      updated_at: video.updated_at,
      file_urls: video.file_urls as unknown as StoredVideo['file_urls'],
      metadata: video.metadata,
      tags: video.tags || [],
      public: video.public,
      duration: video.duration,
      size: video.size
    }));

    return {
      success: true,
      data: processedVideos
    };
  } catch (error: any) {
    console.error('Error in loadVideosData:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred while loading videos'
    };
  }
};

export * from './basicVideoOperations';
export * from './videoOperations';
export * from './equipmentOperations';
