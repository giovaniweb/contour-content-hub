
import { StoredVideo, VideoMetadata } from '@/types/video-storage';
import { Equipment } from '@/hooks/useEquipments';

export interface EditableVideo extends StoredVideo {
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  editEquipmentId: string;
  editTags: string[];
  originalEquipmentId?: string;
}

export interface BatchVideoState {
  videos: EditableVideo[];
  loading: boolean;
  selectedVideos: string[];
  searchQuery: string;
  batchEquipmentId: string;
  showBatchEditDialog: boolean;
}

export interface BatchVideoActions {
  setSearchQuery: (query: string) => void;
  setSelectedVideos: (ids: string[]) => void;
  setBatchEquipmentId: (id: string) => void;
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
}

export interface UseBatchVideoManageResult extends BatchVideoState, BatchVideoActions {
  isAdmin: () => boolean;
  equipments: Equipment[];
}
