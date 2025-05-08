
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoaderIcon, Search } from "lucide-react";
import { MediaItem } from "./mockData";
import { Card } from "@/components/ui/card";
import MediaCardThumbnail from "./MediaCardThumbnail";
import MediaCardContent from "./MediaCardContent";
import MediaCardFooter from "./MediaCardFooter";
import MediaCardListContent from "./MediaCardListContent";
import { getMediaTypeIcon, getMediaTypeName } from "./mediaUtils";
import { TooltipProvider } from "@/components/ui/tooltip";

interface MediaGalleryProps {
  mediaType: string;
  filteredItems: MediaItem[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  handleReset: () => void;
  handleMediaUpdate: () => void;
  onDownload: (item: MediaItem) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  mediaType, 
  filteredItems, 
  isLoading, 
  viewMode,
  handleReset, 
  handleMediaUpdate,
  onDownload
}) => {
  const [isRating, setIsRating] = React.useState<Record<string, boolean>>({});
  const [isTogglingFavorite, setIsTogglingFavorite] = React.useState<Record<string, boolean>>({});
  
  const handleToggleFavorite = (id: string) => {
    setIsTogglingFavorite(prev => ({ ...prev, [id]: true }));
    
    setTimeout(() => {
      setIsTogglingFavorite(prev => ({ ...prev, [id]: false }));
      handleMediaUpdate();
    }, 300);
  };
  
  const handleRate = (id: string, rating: number) => {
    setIsRating(prev => ({ ...prev, [id]: true }));
    
    setTimeout(() => {
      setIsRating(prev => ({ ...prev, [id]: false }));
      handleMediaUpdate();
    }, 500);
  };
  
  return (
    <TooltipProvider>
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
                <Card 
                  key={item.id} 
                  className={`overflow-hidden hover:shadow-md transition-all ${viewMode === "list" ? "flex" : ""}`}
                >
                  <MediaCardThumbnail 
                    thumbnailUrl={item.thumbnailUrl}
                    duration={item.duration}
                    type={item.type}
                    isFavorite={item.isFavorite}
                    isTogglingFavorite={!!isTogglingFavorite[item.id]}
                    onToggleFavorite={() => handleToggleFavorite(item.id)}
                    viewMode={viewMode}
                  />
                  
                  {viewMode === "grid" ? (
                    <>
                      <MediaCardContent 
                        title={item.title}
                        equipment={item.equipment}
                        purpose={item.purpose}
                        rating={item.rating}
                        isRating={!!isRating[item.id]}
                        onRate={(rating) => handleRate(item.id, rating)}
                      />
                      <MediaCardFooter 
                        videoUrl={item.url}
                        onDownload={() => onDownload(item)}
                      />
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col justify-between">
                      <MediaCardListContent
                        title={item.title}
                        equipment={item.equipment}
                        purpose={item.purpose}
                        type={item.type}
                        rating={item.rating}
                        isRating={!!isRating[item.id]}
                        onRate={(rating) => handleRate(item.id, rating)}
                      />
                      <MediaCardFooter 
                        videoUrl={item.url}
                        viewMode={viewMode}
                        onDownload={() => onDownload(item)}
                      />
                    </div>
                  )}
                </Card>
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
    </TooltipProvider>
  );
};

export default MediaGallery;
