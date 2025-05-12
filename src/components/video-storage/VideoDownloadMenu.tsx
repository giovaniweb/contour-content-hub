
import React from 'react';
import { Button } from "@/components/ui/button";
import { DownloadCloud, AlertCircle, Check } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

  const handleDownload = (e: React.MouseEvent, link: string, quality: string) => {
    // Prevent dropdown from closing immediately
    e.stopPropagation();
    
    if (!link) {
      toast.error("Link indisponível", {
        description: `O link de download para ${quality} não está disponível.`
      });
      return;
    }
    
    // Open the link in a new tab/window
    toast.success("Download iniciado", {
      description: `Iniciando download em ${quality}`
    });
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
        {downloads.length > 0 ? (
          <>
            {downloads.map((option, index) => (
              <DropdownMenuItem 
                key={index}
                onClick={(e) => handleDownload(e, option.link, option.quality)}
                className="cursor-pointer flex items-center justify-between"
              >
                <span>{option.quality}</span>
                <Check size={16} className="ml-2 text-green-500" />
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-xs text-muted-foreground"
              disabled
            >
              {downloads.length} opções disponíveis
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem disabled className="flex items-center">
            <AlertCircle size={14} className="mr-2 text-yellow-500" />
            <span>Sem opções de download</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoDownloadMenu;
