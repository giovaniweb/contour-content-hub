
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getMediaTypeIcon, getMediaTypeName, mediaTypeToColor } from "./mediaUtils";

interface MediaCardThumbnailProps {
  thumbnailUrl: string;
  duration?: string;
  type: string;
  isFavorite: boolean;
  isTogglingFavorite: boolean;
  onToggleFavorite: () => void;
  viewMode?: "grid" | "list";
}

const MediaCardThumbnail: React.FC<MediaCardThumbnailProps> = ({
  thumbnailUrl,
  duration,
  type,
  isFavorite,
  isTogglingFavorite,
  onToggleFavorite,
  viewMode = "grid"
}) => {
  const getBadgeClass = () => {
    return `flex items-center gap-1 ${mediaTypeToColor(type)}`;
  };
  
  return (
    <div className={cn("relative", viewMode === "list" ? "w-1/4 min-w-[120px]" : "")}>
      <div className={viewMode === "grid" ? "aspect-video bg-gray-200" : ""}>
        <img 
          src={thumbnailUrl} 
          alt="Media thumbnail"
          className="w-full h-full object-cover"
          style={viewMode === "list" ? { aspectRatio: "16/9" } : undefined}
        />
      </div>
      
      {duration && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
          {duration}
        </div>
      )}
      
      {viewMode === "grid" && (
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className={getBadgeClass()}>
            {getMediaTypeIcon(type)}
            <span>{getMediaTypeName(type)}</span>
          </Badge>
        </div>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-2 left-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white/90",
          isFavorite && "text-red-500"
        )}
        onClick={onToggleFavorite}
        disabled={isTogglingFavorite}
      >
        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
      </Button>
    </div>
  );
};

export default MediaCardThumbnail;
