
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Video,
  FileText,
  Image,
  Film,
  Camera
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface MediaTypeTabsProps {
  mediaType: string;
  setMediaType: (value: string) => void;
}

const MediaTypeTabs: React.FC<MediaTypeTabsProps> = ({ mediaType, setMediaType }) => {
  return (
    <Tabs value={mediaType} onValueChange={setMediaType} className="w-full">
      <TabsList className="grid grid-cols-1 sm:grid-cols-5 mb-6 w-full">
        <TabsTrigger value="all" className="font-medium">Todos</TabsTrigger>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger value="video" className="flex items-center gap-2 font-medium">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Vídeos</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">Vídeos</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger value="arte" className="flex items-center gap-2 font-medium">
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Artes</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">Artes</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger value="artigo" className="flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Artigos</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">Artigos</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger value="documentacao" className="flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documentação</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">Documentação</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TabsList>
    </Tabs>
  );
};

export default MediaTypeTabs;
