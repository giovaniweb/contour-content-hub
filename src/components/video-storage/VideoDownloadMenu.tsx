
import React from 'react';
import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface DownloadOption {
  quality: string;
  link: string;
}

interface VideoDownloadMenuProps {
  downloads: DownloadOption[];
  className?: string;
  buttonVariant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
}

const VideoDownloadMenu: React.FC<VideoDownloadMenuProps> = ({
  downloads,
  className = "",
  buttonVariant = "ghost",
  buttonSize = "sm"
}) => {
  // Don't render anything if there are no download options
  if (!downloads || downloads.length === 0) {
    return null;
  }

  const handleDownload = (e: React.MouseEvent, link: string) => {
    // Prevent dropdown from closing immediately
    e.stopPropagation();
    
    // Open the link in a new tab/window
    window.open(link, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size={buttonSize}
          className={`gap-1 ${className}`}
        >
          <DownloadCloud size={16} />
          <span>Baixar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        {downloads.map((option, index) => (
          <DropdownMenuItem 
            key={index}
            onClick={(e) => handleDownload(e, option.link)}
            className="cursor-pointer"
          >
            {option.quality}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoDownloadMenu;
