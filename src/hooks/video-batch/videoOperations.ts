
import { supabase } from '@/integrations/supabase/client';
import { getVideos, updateVideo, deleteVideo } from '@/services/videoStorage';
import { EditableVideo } from './types';
import { VideoMetadataSchema } from '@/types/video-storage';
import { Equipment } from '@/hooks/useEquipments';
import { transformToEditableVideos } from './transformUtils';

export const loadVideosData = async () => {
  const response = await getVideos();
  
  if (response.error) {
    throw new Error(response.error);
  }
  
  return transformToEditableVideos(response.videos);
};

export const saveVideoData = async (
  video: EditableVideo, 
  equipments: Equipment[]
): Promise<void> => {
  // Update video basic info
  const updateResult = await updateVideo(video.id, {
    title: video.editTitle,
    description: video.editDescription,
    tags: video.editTags,
  });
  
  if (!updateResult.success) {
    throw new Error(updateResult.error);
  }
  
  // If equipment changed, update the metadata
  if (video.editEquipmentId !== video.originalEquipmentId) {
    await updateEquipmentAssociation(video, video.editEquipmentId, equipments);
  }
};

export const updateEquipmentAssociation = async (
  video: EditableVideo, 
  equipmentId: string,
  equipments: Equipment[]
): Promise<void> => {
  if (equipmentId === 'none') {
    // Remove equipment association
    const metadataObj = {
      ...(video.metadata || {}),
      equipment_id: null
    };
    
    const metadata = VideoMetadataSchema.parse(metadataObj);
    
    await supabase.from('videos_storage')
      .update({
        metadata
      })
      .eq('id', video.id);
      
    // Also remove from videos table if applicable
    await supabase.from('videos')
      .update({
        equipment_id: null
      })
      .eq('id', video.id);
  } else {
    // Add/update equipment association
    const selectedEquipment = equipments.find(eq => eq.id === equipmentId);
    
    const metadataObj = {
      ...(video.metadata || {}),
      equipment_id: equipmentId
    };
    
    const metadata = VideoMetadataSchema.parse(metadataObj);
    
    await supabase.from('videos_storage')
      .update({
        metadata
      })
      .eq('id', video.id);
      
    // Update videos table if applicable
    if (selectedEquipment) {
      // Check if record exists in videos table
      const { data: existingVideo } = await supabase
        .from('videos')
        .select()
        .eq('id', video.id)
        .single();
        
      if (existingVideo) {
        await supabase.from('videos')
          .update({
            equipment_id: equipmentId,
            equipamentos: [selectedEquipment.nome]
          })
          .eq('id', video.id);
      } else {
        // Create record if it doesn't exist
        // First, get video details from videos_storage
        const { data: videoData } = await supabase
          .from('videos_storage')
          .select('title, description, file_urls, tags')
          .eq('id', video.id)
          .single();
          
        if (videoData) {
          const fileUrls = videoData.file_urls as Record<string, string>;
          await supabase.from('videos')
            .insert({
              id: video.id,
              titulo: videoData.title,
              descricao: videoData.description || '',
              url_video: fileUrls?.original || '',
              equipamentos: [selectedEquipment.nome],
              equipment_id: equipmentId,
              tags: video.editTags || []
            });
        }
      }
    }
  }
};

export const deleteVideoData = async (videoId: string): Promise<void> => {
  const result = await deleteVideo(videoId);
  
  if (!result.success) {
    throw new Error(result.error);
  }
};

export const batchUpdateEquipment = async (
  videoIds: string[],
  equipmentId: string,
  equipments: Equipment[]
): Promise<{successCount: number, failCount: number}> => {
  let successCount = 0;
  let failCount = 0;
  
  const selectedEquipment = equipmentId === 'none' 
    ? null 
    : equipments.find(eq => eq.id === equipmentId);
  
  // Process updates sequentially
  for (const videoId of videoIds) {
    try {
      if (equipmentId === 'none') {
        // Remove equipment association
        const metadataObj = {
          equipment_id: null
        };
        
        const metadata = VideoMetadataSchema.parse(metadataObj);
        
        await supabase.from('videos_storage')
          .update({
            metadata
          })
          .eq('id', videoId);
          
        // Also remove from videos table if applicable
        await supabase.from('videos')
          .update({
            equipment_id: null,
            equipamentos: []
          })
          .eq('id', videoId);
      } else if (selectedEquipment) {
        // Add/update equipment association
        const metadataObj = {
          equipment_id: equipmentId
        };
        
        const metadata = VideoMetadataSchema.parse(metadataObj);
        
        await supabase.from('videos_storage')
          .update({
            metadata
          })
          .eq('id', videoId);
          
        // Check if record exists in videos table
        const { data: existingVideo } = await supabase
          .from('videos')
          .select()
          .eq('id', videoId)
          .single();
          
        if (existingVideo) {
          // For existing videos in the videos table, update the equipment_id
          await supabase.from('videos')
            .update({
              equipment_id: equipmentId,
              equipamentos: [selectedEquipment.nome]
            })
            .eq('id', videoId);
        } else {
          // Create a new entry in the videos table with equipment_id
          // First, get video details from videos_storage
          const { data: videoData } = await supabase
            .from('videos_storage')
            .select('title, description, file_urls, tags')
            .eq('id', videoId)
            .single();
            
          if (videoData) {
            const fileUrls = videoData.file_urls as Record<string, string>;
            await supabase.from('videos')
              .insert({
                id: videoId,
                titulo: videoData.title,
                descricao: videoData.description || '',
                url_video: fileUrls?.original || '',
                equipamentos: [selectedEquipment.nome],
                equipment_id: equipmentId,
                tags: videoData.tags || []
              });
          }
        }
      }
      
      successCount++;
    } catch (error) {
      console.error(`Error updating video ${videoId}:`, error);
      failCount++;
    }
  }
  
  return { successCount, failCount };
};
