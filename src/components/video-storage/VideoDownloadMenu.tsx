
import React from 'react';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { downloadVideo } from '@/services/videoStorage/videoDownloadService';

interface DownloadOption {
  quality: string;
  link: string;
}

interface VideoDownloadMenuProps {
  downloads: DownloadOption[];
  videoId?: string;
}

const VideoDownloadMenu: React.FC<VideoDownloadMenuProps> = ({ downloads, videoId }) => {
  const { toast } = useToast();

  const handleDownload = async (url: string, quality: string) => {
    try {
      // If we have a videoId, use the download service for logging
      if (videoId) {
        const { success, downloadUrl, error } = await downloadVideo(videoId, quality);
        
        if (!success || !downloadUrl) {
          throw new Error(error || 'Erro ao preparar download');
        }
        
        // Use the logged download URL
        url = downloadUrl;
      }

      // Create a temporary link and trigger download automatically
      const link = document.createElement('a');
      link.href = url;
      link.download = `video-${quality}-${Date.now()}.mp4`;
      link.target = '_blank';
      
      // Add to DOM temporarily to ensure it works in all browsers
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Download iniciado',
        description: `Download em qualidade ${quality} iniciado automaticamente!`
      });

    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no download',
        description: error.message || 'Erro ao fazer download do vídeo'
      });
    }
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
