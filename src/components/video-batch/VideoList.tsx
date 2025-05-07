
import React from 'react';
import { VideoMetadata } from '@/types/video-storage';
import VideoListHeader from './VideoListHeader';
import VideoListItem from './VideoListItem';

interface Equipment {
  id: string;
  nome: string;
}

interface EditableVideo {
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

interface VideoListProps {
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

const VideoList: React.FC<VideoListProps> = ({
  videos,
  selectedVideos,
  equipments,
  onSelect,
  onSelectAll,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onUpdateVideo
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <VideoListHeader
        hasVideos={videos.length > 0}
        selectedAll={videos.length > 0 && selectedVideos.length === videos.length}
        onSelectAll={onSelectAll}
      />
      
      {videos.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          Nenhum vídeo encontrado.
        </div>
      ) : (
        <div className="divide-y">
          {videos.map((video, index) => (
            <VideoListItem
              key={video.id}
              video={video}
              isSelected={selectedVideos.includes(video.id)}
              onSelect={() => onSelect(video.id)}
              onEdit={() => onEdit(video.id)}
              onSave={() => onSave(video.id)}
              onCancel={() => onCancel(video.id)}
              onDelete={() => onDelete(video.id)}
              equipmentOptions={equipments}
              onUpdate={(updates) => onUpdateVideo(index, updates)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;
