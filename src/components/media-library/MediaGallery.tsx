
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoaderIcon, Search } from "lucide-react";
import { MediaItem } from "@/utils/api";
import MediaCard from "@/components/MediaCard";
import { getMediaTypeIcon, getMediaTypeName } from "./mediaUtils";

interface MediaGalleryProps {
  mediaType: string;
  filteredItems: MediaItem[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  handleReset: () => void;
  handleMediaUpdate: () => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  mediaType, 
  filteredItems, 
  isLoading, 
  viewMode,
  handleReset, 
  handleMediaUpdate 
}) => {
  return (
    <div className="mt-2">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Carregando mídia...</p>
          </div>
        </div>
      ) : filteredItems.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              {mediaType !== "all" && getMediaTypeIcon(mediaType)}
              <span>{getMediaTypeName(mediaType)}</span>
            </h3>
            <Badge variant="outline">{filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}</Badge>
          </div>
          
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredItems.map((item) => (
              <MediaCard 
                key={item.id} 
                media={item}
                viewMode={viewMode}
                onUpdate={handleMediaUpdate}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Nenhuma mídia encontrada</p>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Não encontramos resultados para sua busca. Tente ajustar os filtros ou adicionar novo conteúdo.
            </p>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="mt-2"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
