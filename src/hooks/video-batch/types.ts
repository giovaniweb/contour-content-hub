
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
  successCount?: number;
  failCount?: number;
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

// Additional types needed for state management
export interface BatchVideoState {
  videos: EditableVideo[];
  filteredVideos: EditableVideo[];
  searchQuery: string;
  loading: boolean;
  selectedVideos: string[];
  equipments: Equipment[];
}
