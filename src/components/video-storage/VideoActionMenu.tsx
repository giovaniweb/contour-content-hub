
import React from 'react';
import { MoreHorizontal, Edit, Trash2, Download, BarChart3, Link } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Video } from '@/services/videoStorage/videoService';

interface VideoActionMenuProps {
  video: Video;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onStatistics: () => void;
  onCopyLink: () => void;
}

const VideoActionMenu: React.FC<VideoActionMenuProps> = ({
  video,
  onEdit,
  onDelete,
  onDownload,
  onStatistics,
  onCopyLink
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onStatistics}>
          <BarChart3 className="h-4 w-4 mr-2" />
          Estatísticas
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopyLink}>
          <Link className="h-4 w-4 mr-2" />
          Copiar Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoActionMenu;
