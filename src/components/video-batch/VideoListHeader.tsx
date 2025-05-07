
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface VideoListHeaderProps {
  hasVideos: boolean;
  selectedAll: boolean;
  onSelectAll: () => void;
}

const VideoListHeader: React.FC<VideoListHeaderProps> = ({
  hasVideos,
  selectedAll,
  onSelectAll
}) => {
  return (
    <div className="bg-muted p-3 flex items-center">
      <div className="flex items-center w-12">
        <Checkbox 
          checked={hasVideos && selectedAll}
          onCheckedChange={onSelectAll}
          disabled={!hasVideos}
        />
      </div>
      <div className="flex-1 font-medium">Título</div>
      <div className="hidden md:block w-32 text-center">Equipamento</div>
      <div className="w-32 text-center">Status</div>
      <div className="w-24 text-right">Ações</div>
    </div>
  );
};

export default VideoListHeader;
