
import { StoredVideo, VideoMetadata } from '@/types/video-storage';
import { Equipment } from '@/types/equipment';

export interface EditableVideo {
  id: string;
  title: string;
  description?: string;
  status: string;
  tags: string[];
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  editEquipmentId: string;
  editTags: string[];
  originalEquipmentId?: string;
  metadata?: any;
  url?: string;
}

export interface BatchVideoState {
  videos: EditableVideo[];
  loading: boolean;
  error: string | null;
}
