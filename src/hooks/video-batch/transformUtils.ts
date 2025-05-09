
import { StoredVideo } from "@/types/video-storage";
import { EditableVideo } from "./types";

export const transformStoredVideosToEditable = (videos: StoredVideo[]): EditableVideo[] => {
  return videos.map(video => {
    // Handle metadata safely
    let equipmentId = "";
    if (video.metadata && typeof video.metadata === 'object') {
      equipmentId = (video.metadata as any).equipment_id || "";
    }
    
    // Create EditableVideo with required fields
    return {
      id: video.id,
      title: video.title || "",
      description: video.description || "",
      status: video.status || "ready",
      tags: video.tags || [],
      isEditing: false,
      editTitle: video.title || "",
      editDescription: video.description || "",
      editEquipmentId: equipmentId,
      editTags: video.tags || [],
      originalEquipmentId: equipmentId,
      metadata: video.metadata,
      url: video.file_urls?.web_optimized || video.file_urls?.sd || video.file_urls?.original
    };
  });
};

export const getFileUrl = (video: StoredVideo): string => {
  if (!video.file_urls) return "";
  
  return video.file_urls.web_optimized || 
         video.file_urls.sd || 
         video.file_urls.hd || 
         video.file_urls.original || 
         "";
};
