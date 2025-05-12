
import React from 'react';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface DownloadOption {
  quality: string;
  link: string;
}

interface VideoDownloadMenuProps {
  downloads: DownloadOption[];
}

const VideoDownloadMenu: React.FC<VideoDownloadMenuProps> = ({ downloads }) => {
  const handleDownload = (url: string, quality: string) => {
    // Open in new tab
    window.open(url, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Download size={16} />
          <span>Download</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {downloads.map((option, index) => (
          <DropdownMenuItem 
            key={index}
            onClick={() => handleDownload(option.link, option.quality)}
          >
            {option.quality}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoDownloadMenu;
