
import { useState } from 'react';
import { EditableVideo, BatchVideoState } from './types';

export const useVideoBatchState = (): BatchVideoState & {
  setVideos: React.Dispatch<React.SetStateAction<EditableVideo[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
} => {
  const [videos, setVideos] = useState<EditableVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [batchEquipmentId, setBatchEquipmentId] = useState<string>('none');
  const [showBatchEditDialog, setShowBatchEditDialog] = useState(false);
  
  return {
    videos,
    loading,
    selectedVideos,
    searchQuery,
    batchEquipmentId,
    showBatchEditDialog,
    setVideos,
    setLoading,
    setSelectedVideos,
    setSearchQuery,
    setBatchEquipmentId,
    setShowBatchEditDialog
  };
};
