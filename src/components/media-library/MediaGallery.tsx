
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoaderIcon, Search } from "lucide-react";
import { MediaItem } from "@/utils/api";
import { TabsContent } from "@/components/ui/tabs";
import MediaCard from "@/components/MediaCard";
import { getMediaTypeIcon } from "./mediaUtils";

interface MediaGalleryProps {
  mediaType: string;
  filteredItems: MediaItem[];
  isLoading: boolean;
  handleReset: () => void;
  handleMediaUpdate: () => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  mediaType, 
  filteredItems, 
  isLoading, 
  handleReset, 
  handleMediaUpdate 
}) => {
  const getMediaTypeName = (type: string) => {
    switch (type) {
      case "all": return "Todos os itens";
      case "video": return "Vídeos";
      case "arte": return "Artes";
      case "artigo": return "Artigos";
      case "documentacao": return "Documentação";
      case "video_pronto": return "Vídeos Prontos";
      case "take": return "Takes Brutos";
      case "image": return "Imagens";
      default: return "Mídia";
    }
  };

  return (
    <TabsContent value={mediaType} className="mt-0">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading media...</p>
          </div>
        </div>
      ) : filteredItems.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              {mediaType !== "all" && getMediaTypeIcon(mediaType)}
              <span>{getMediaTypeName(mediaType)}</span>
            </h3>
            <Badge variant="outline">{filteredItems.length} items</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MediaCard 
                key={item.id} 
                media={item}
                onUpdate={handleMediaUpdate}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No media found</p>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default MediaGallery;
