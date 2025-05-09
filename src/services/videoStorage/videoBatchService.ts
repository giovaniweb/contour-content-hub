
import { supabase } from '@/integrations/supabase/client';
import { VideoQueueItem } from '@/types/video-storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload multiple videos in sequence
 * @param queue Array of video queue items
 * @param onProgress Callback for progress updates
 * @param onComplete Callback when a video upload completes
 */
export const batchUploadVideos = async (
  queue: VideoQueueItem[],
  onProgress: (index: number, progress: number) => void,
  onComplete: (index: number, success: boolean, videoId?: string, error?: string) => void
) => {
  // Process each video in sequence
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    
    try {
      // Skip items that are already processed
      if (item.status === 'complete' || item.status === 'error') {
        continue;
      }
      
      // Generate unique ID for the video if not provided
      const videoId = item.id || uuidv4();
      const file = item.file;
      const title = item.title || file.name.replace(/\.[^/.]+$/, "");
      const metadata: any = {};
      
      // Add equipment info if available
      if (item.equipmentId && item.equipmentId !== 'none') {
        const { data: equipment } = await supabase
          .from('equipamentos')
          .select('nome')
          .eq('id', item.equipmentId)
          .single();
        
        if (equipment) {
          metadata.equipment_id = item.equipmentId;
          metadata.equipment_name = equipment.nome;
        }
      }
      
      // File path in storage
      const filePath = `${videoId}/original_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      // Add file info to metadata
      metadata.original_filename = file.name;
      metadata.fileSize = file.size;
      
      // Create the video record first
      const { error: createError } = await supabase
        .from('videos_storage')
        .insert({
          id: videoId,
          title: title,
          description: item.description || '',
          status: 'uploading',
          public: true,
          size: file.size,
          owner_id: (await supabase.auth.getUser()).data.user?.id,
          tags: item.tags || [],
          metadata
        });
      
      if (createError) {
        throw new Error(`Error creating video: ${createError.message}`);
      }
      
      // Upload the file with progress tracking
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: ({ loaded, total }) => {
            const progress = (loaded / total) * 100;
            onProgress(i, progress);
          },
        });
      
      if (uploadError) {
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }
      
      // Get URL to the uploaded file
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);
      
      // Update video record with file URL
      const { error: updateError } = await supabase
        .from('videos_storage')
        .update({
          file_urls: {
            original: urlData.publicUrl
          },
          status: 'processing'
        })
        .eq('id', videoId);
      
      if (updateError) {
        throw new Error(`Error updating video: ${updateError.message}`);
      }
      
      // Trigger processing function (if your app has one)
      try {
        await supabase.functions.invoke('process-video', {
          body: { videoId, fileName: filePath }
        });
      } catch (error) {
        console.warn('Error invoking process function:', error);
        // Continue even if processing function fails
        // The video is still uploaded and can be manually processed later
      }
      
      // Call success callback
      onComplete(i, true, videoId);
      
    } catch (error) {
      console.error('Error in batchUploadVideos:', error);
      onComplete(i, false, undefined, error.message);
    }
  }
};
