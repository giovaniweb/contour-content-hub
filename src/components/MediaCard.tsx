
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MediaItem, toggleFavorite, rateMedia } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import MediaCardThumbnail from "./media-library/MediaCardThumbnail";
import MediaCardContent from "./media-library/MediaCardContent";
import MediaCardListContent from "./media-library/MediaCardListContent";
import MediaCardFooter from "./media-library/MediaCardFooter";

interface MediaCardProps {
  media: MediaItem;
  viewMode?: "grid" | "list";
  onUpdate?: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, viewMode = "grid", onUpdate }) => {
  const [isFavorite, setIsFavorite] = useState(media.isFavorite);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [currentRating, setCurrentRating] = useState(media.rating);
  const { toast } = useToast();

  const handleToggleFavorite = async () => {
    try {
      setIsTogglingFavorite(true);
      await toggleFavorite(media.id);
      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite ? "Media item removed from your favorites" : "Media item added to your favorites",
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "Could not update favorite status",
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleRate = async (rating: number) => {
    try {
      setIsRating(true);
      await rateMedia(media.id, rating);
      setCurrentRating(rating);
      toast({
        title: "Rating updated",
        description: "Thank you for your feedback",
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Rating failed",
        description: "Could not update rating",
      });
    } finally {
      setIsRating(false);
    }
  };

  // Render list view
  if (viewMode === "list") {
    return (
      <TooltipProvider>
        <Card className="w-full overflow-hidden flex">
          <MediaCardThumbnail
            thumbnailUrl={media.thumbnailUrl}
            duration={media.duration}
            type={media.type}
            isFavorite={isFavorite}
            isTogglingFavorite={isTogglingFavorite}
            onToggleFavorite={handleToggleFavorite}
            viewMode="list"
          />
          
          <div className="flex-1 flex flex-col">
            <CardContent className="p-0">
              <MediaCardListContent
                title={media.title}
                equipment={media.equipment}
                purpose={media.purpose}
                type={media.type}
                rating={currentRating}
                isRating={isRating}
                onRate={handleRate}
              />
            </CardContent>
            
            <CardFooter className="p-4 pt-0 mt-auto">
              <MediaCardFooter 
                videoUrl={media.videoUrl}
                viewMode="list"
              />
            </CardFooter>
          </div>
        </Card>
      </TooltipProvider>
    );
  }

  // Default grid view
  return (
    <TooltipProvider>
      <Card className="w-full reelline-card overflow-hidden">
        <MediaCardThumbnail
          thumbnailUrl={media.thumbnailUrl}
          duration={media.duration}
          type={media.type}
          isFavorite={isFavorite}
          isTogglingFavorite={isTogglingFavorite}
          onToggleFavorite={handleToggleFavorite}
        />
        
        <CardContent className="p-0">
          <MediaCardContent
            title={media.title}
            equipment={media.equipment}
            purpose={media.purpose}
            rating={currentRating}
            isRating={isRating}
            onRate={handleRate}
          />
        </CardContent>
        
        <CardFooter className="p-0">
          <MediaCardFooter videoUrl={media.videoUrl} />
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default MediaCard;
