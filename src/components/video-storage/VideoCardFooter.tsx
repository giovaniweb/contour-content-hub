
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download, Trash2 } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { VideoCardProps } from './types';
import { StoredVideo } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VideoCardFooterProps {
  video: StoredVideo;
  onOpenDeleteDialog: () => void;
  onDownload: () => void;
  onViewVideo: () => void;
  isProcessing: boolean;
  hasFileUrl: boolean;
}

const VideoCardFooter: React.FC<VideoCardFooterProps> = ({
  video,
  onOpenDeleteDialog,
  onDownload,
  onViewVideo,
  isProcessing,
  hasFileUrl
}) => {
  const { isAdmin } = usePermissions();
  
  return (
    <CardFooter className="p-4 pt-0 border-t mt-auto flex justify-between">
      <TooltipProvider>
        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                disabled={(isProcessing && !hasFileUrl) || video.status === 'error'}
                onClick={onViewVideo}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ver vídeo</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                disabled={(isProcessing && !hasFileUrl) || video.status === 'error'}
                onClick={onDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
          
          {isAdmin() && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onOpenDeleteDialog}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Excluir</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </CardFooter>
  );
};

export default VideoCardFooter;
