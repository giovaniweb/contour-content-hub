
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

export interface UseBatchVideoManageResult {
  videos: EditableVideo[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedVideos: string[];
  setSelectedVideos: (ids: string[]) => void;
  batchEquipmentId: string;
  setBatchEquipmentId: (id: string) => void;
  showBatchEditDialog: boolean;
  setShowBatchEditDialog: (show: boolean) => void;
  loadVideos: () => Promise<void>;
  handleSelectAll: () => void;
  handleSelect: (videoId: string) => void;
  handleEdit: (videoId: string) => void;
  handleUpdate: (index: number, updates: Partial<EditableVideo>) => void;
  handleSave: (videoId: string) => Promise<void>;
  handleCancel: (videoId: string) => void;
  handleDelete: (videoId: string) => Promise<void>;
  handleBatchDelete: () => Promise<void>;
  handleBatchEquipmentUpdate: () => Promise<void>;
  isAdmin: () => boolean;
  equipments: Equipment[];
}
