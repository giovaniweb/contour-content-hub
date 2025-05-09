
import { StoredVideo } from '@/types/video-storage';
import type { VideoMetadata } from '@/types/video-storage';

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
  metadata?: VideoMetadata;
}

export interface Equipment {
  id: string;
  nome: string;
}

export interface VideoListProps {
  videos: EditableVideo[];
  selectedVideos: string[];
  equipments: Equipment[];
  onSelect: (videoId: string) => void;
  onSelectAll: () => void;
  onEdit: (videoId: string) => void;
  onSave: (videoId: string) => Promise<void>;
  onCancel: (videoId: string) => void;
  onDelete: (videoId: string) => void;
  onUpdateVideo: (index: number, updates: Partial<EditableVideo>) => void;
}

export interface BatchActionResult {
  success: boolean;
  error?: string;
  affectedCount?: number;
}
