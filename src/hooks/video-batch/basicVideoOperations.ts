
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { VideoMetadata, StoredVideo, VideoStatus } from '@/types/video-storage';
import { loadVideosData } from './videoBatchOperations';

// Re-export loadVideosData for backward compatibility
export { loadVideosData };

// The original fetchVideos function
export const fetchVideos = async (): Promise<StoredVideo[]> => {
  try {
    const { data, error } = await supabase
      .from('videos_storage')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Convert the data to StoredVideo type, ensuring status is a valid VideoStatus
    return data.map(video => ({
      id: video.id,
      title: video.title || '',
      description: video.description || '',
      file_urls: video.file_urls as StoredVideo['file_urls'],
      thumbnail_url: video.thumbnail_url,
      created_at: video.created_at,
      updated_at: video.updated_at,
      status: (video.status as VideoStatus) || 'processing',
      metadata: video.metadata,
      tags: video.tags || [],
      public: video.public,
      duration: video.duration,
      size: video.size
    })) || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

export const updateVideoTitle = async (
  videoId: string, 
  title: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('videos_storage')
      .update({ title })
      .eq('id', videoId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating video title:', error);
    return false;
  }
};

export const updateVideoMetadata = async (
  videoId: string, 
  metadata: VideoMetadata
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('videos_storage')
      .update({ 
        metadata: metadata as any // Type assertion to satisfy the Json type
      })
      .eq('id', videoId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating video metadata:', error);
    return false;
  }
};

export const deleteVideo = async (videoId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('videos_storage')
      .delete()
      .eq('id', videoId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    toast({
      variant: 'destructive',
      title: 'Error deleting video',
      description: 'The video could not be deleted.',
    });
    return false;
  }
};

export const updateVideoTags = async (
  videoId: string,
  tags: string[]
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('videos_storage')
      .update({ tags })
      .eq('id', videoId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating video tags:', error);
    return false;
  }
};
