
import { StoredVideo, VideoMetadata } from '@/types/video-storage';
import { EditableVideo } from './types';

export const transformToEditableVideos = (videos: StoredVideo[]): EditableVideo[] => {
  return videos.map(video => {
    // Extract equipment ID from metadata
    let equipmentId = 'none';
    if (video.metadata) {
      const metadata = video.metadata as VideoMetadata;
      if (metadata.equipment_id) {
        equipmentId = metadata.equipment_id;
      }
    }
    
    return {
      ...video,
      isEditing: false,
      editTitle: video.title,
      editDescription: video.description || '',
      editTags: [...video.tags],
      editEquipmentId: equipmentId,
      originalEquipmentId: equipmentId === 'none' ? undefined : equipmentId
    };
  });
};
