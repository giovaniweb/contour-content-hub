
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Video,
  FileText,
  Image
} from "lucide-react";

interface MediaTypeTabsProps {
  mediaType: string;
  setMediaType: (value: string) => void;
}

const MediaTypeTabs: React.FC<MediaTypeTabsProps> = ({ mediaType, setMediaType }) => {
  return (
    <Tabs value={mediaType} onValueChange={setMediaType}>
      <TabsList className="grid grid-cols-5 mb-6">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="video" className="flex items-center">
          <Video className="h-4 w-4 mr-1.5" />
          <span>Vídeos</span>
        </TabsTrigger>
        <TabsTrigger value="arte" className="flex items-center">
          <Image className="h-4 w-4 mr-1.5" />
          <span>Artes</span>
        </TabsTrigger>
        <TabsTrigger value="artigo" className="flex items-center">
          <FileText className="h-4 w-4 mr-1.5" />
          <span>Artigos</span>
        </TabsTrigger>
        <TabsTrigger value="documentacao" className="flex items-center">
          <FileText className="h-4 w-4 mr-1.5" />
          <span>Documentação</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default MediaTypeTabs;
