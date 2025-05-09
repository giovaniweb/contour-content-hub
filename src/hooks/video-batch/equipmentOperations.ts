
import { supabase } from '@/integrations/supabase/client';
import { EditableVideo } from './types';

interface Equipment {
  id: string;
  nome: string;
}

export const saveVideoEquipment = async (videoId: string, equipmentId: string | null) => {
  try {
    // Get existing video data
    const { data: videoData, error: fetchError } = await supabase
      .from('videos')
      .select('metadata')
      .eq('id', videoId)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Parse existing metadata or create new
    let metadata = videoData?.metadata ? 
      (typeof videoData.metadata === 'string' ? JSON.parse(videoData.metadata) : videoData.metadata) : 
      {};
    
    if (equipmentId) {
      // Get equipment details
      const { data: equipmentData, error: equipmentError } = await supabase
        .from('equipamentos')
        .select('id, nome')
        .eq('id', equipmentId)
        .single();
      
      if (equipmentError) {
        throw equipmentError;
      }
      
      // Update metadata with equipment info
      metadata = {
        ...metadata,
        equipment_id: equipmentData.id,
        equipment_name: equipmentData.nome
      };
    } else {
      // Remove equipment info if null
      if (metadata && typeof metadata === 'object') {
        const { equipment_id, equipment_name, ...rest } = metadata as any;
        metadata = rest;
      }
    }
    
    // Update video with new metadata
    const { error: updateError } = await supabase
      .from('videos')
      .update({ equipment_id: equipmentId, metadata })
      .eq('id', videoId);
    
    if (updateError) {
      throw updateError;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error saving equipment:', error);
    return { success: false, error: error.message };
  }
};

export const batchUpdateEquipment = async (
  videoIds: string[], 
  equipmentId: string, 
  equipments: Equipment[]
): Promise<{ successCount: number, failCount: number }> => {
  let successCount = 0;
  let failCount = 0;
  
  // Find the equipment name
  const equipment = equipments.find(e => e.id === equipmentId);
  
  // Process each video
  for (const videoId of videoIds) {
    try {
      // Get the current video data
      const { data: videoData, error: getError } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single();
        
      if (getError) {
        failCount++;
        continue;
      }
      
      // Update the video
      const { error: updateError } = await supabase
        .from('videos')
        .update({ 
          equipment_id: equipmentId === 'none' ? null : equipmentId,
          metadata: {
            ...(typeof videoData.metadata === 'object' ? videoData.metadata : {}),
            equipment_id: equipmentId === 'none' ? null : equipmentId,
            equipment_name: equipment?.nome || null
          }
        })
        .eq('id', videoId);
      
      if (updateError) {
        failCount++;
      } else {
        successCount++;
      }
    } catch (error) {
      failCount++;
    }
  }
  
  return { successCount, failCount };
};
