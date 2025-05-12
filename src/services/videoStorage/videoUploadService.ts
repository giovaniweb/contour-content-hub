
import { supabase } from '@/integrations/supabase/client';
import { VideoQueueItem } from '@/types/video-storage';

export async function uploadVideo(
  file: File,
  metadata: {
    title?: string;
    description?: string;
    equipmentId?: string;
    tags?: string[];
  } = {}
): Promise<{
  success: boolean;
  videoId?: string;
  error?: string;
}> {
  try {
    // Get authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    // Create the record in videos_storage first
    const { data: videoData, error: videoError } = await supabase
      .from('videos_storage')
      .insert({
        title: metadata.title || file.name,
        description: metadata.description || '',
        status: 'uploading',
        owner_id: userData.user.id,
        tags: metadata.tags || [],
        metadata: {
          equipment_id: metadata.equipmentId,
          original_filename: file.name
        },
        size: file.size,
      })
      .select()
      .single();
    
    if (videoError || !videoData) {
      throw new Error(videoError?.message || 'Failed to create video record');
    }
    
    const videoId = videoData.id;
    
    // Generate a unique filename for storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${videoId}.${fileExt}`;
    const filePath = `videos/${videoId}/${fileName}`;
    
    // Upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from('video-storage')
      .upload(filePath, file);
    
    if (uploadError) {
      // If upload fails, update the status to error
      await supabase
        .from('videos_storage')
        .update({ status: 'error' })
        .eq('id', videoId);
      
      throw new Error(uploadError.message);
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('video-storage')
      .getPublicUrl(filePath);
    
    // Update the record with the file URL
    await supabase
      .from('videos_storage')
      .update({
        file_urls: { original: publicUrlData.publicUrl },
        status: 'processing' // Change to processing since the file is uploaded
      })
      .eq('id', videoId);
    
    // At this point, additional processing would typically be triggered via a webhook or edge function
    
    return { success: true, videoId };
  } catch (error) {
    console.error('Video upload error:', error);
    return { success: false, error: error.message || 'Unknown upload error' };
  }
}

export async function batchUploadVideos(
  queue: VideoQueueItem[],
  onProgress: (index: number, progress: number) => void,
  onComplete: (index: number, success: boolean, videoId?: string, error?: string) => void
): Promise<{
  success: boolean;
  completed: number;
  failed: number;
}> {
  let completed = 0;
  let failed = 0;
  
  // Process videos one by one
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    try {
      // Report start
      onProgress(i, 0);
      
      // Upload file
      const { success, videoId, error } = await uploadVideo(item.file, {
        title: item.title,
        description: item.description,
        equipmentId: item.equipmentId,
        tags: item.tags
      });
      
      // Update status
      if (success && videoId) {
        completed++;
        onComplete(i, true, videoId);
      } else {
        failed++;
        onComplete(i, false, undefined, error);
      }
      
      // Report completion
      onProgress(i, 100);
    } catch (error) {
      failed++;
      onComplete(i, false, undefined, error.message);
    }
    
    // Small delay between uploads to avoid API rate limits
    if (i < queue.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return {
    success: failed === 0,
    completed,
    failed
  };
}
