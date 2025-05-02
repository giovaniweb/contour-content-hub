
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Star,
  Video as VideoIcon,
  Camera,
  Film,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaItem, toggleFavorite, rateMedia } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

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

  // Get the icon based on media type
  const getMediaTypeIcon = () => {
    switch (media.type) {
      case "video_pronto":
        return <VideoIcon className="h-4 w-4" />;
      case "take":
        return <Film className="h-4 w-4" />;
      case "image":
        return <Camera className="h-4 w-4" />;
      default:
        return <VideoIcon className="h-4 w-4" />;
    }
  };

  // Get badge color based on media type
  const getBadgeVariant = () => {
    switch (media.type) {
      case "video_pronto":
        return "default";
      case "take":
        return "secondary";
      case "image":
        return "outline";
      default:
        return "default";
    }
  };

  // Render list view
  if (viewMode === "list") {
    return (
      <Card className="w-full overflow-hidden flex">
        <div className="relative w-1/4 min-w-[120px]">
          <img 
            src={media.thumbnailUrl} 
            alt={media.title}
            className="w-full h-full object-cover"
            style={{ aspectRatio: "16/9" }}
          />
          {media.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
              {media.duration}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 left-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white/90",
              isFavorite && "text-red-500"
            )}
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{media.title}</h3>
                
                <div className="flex items-center mt-1">
                  <Badge variant={getBadgeVariant()} className="flex items-center gap-1 mr-2">
                    {getMediaTypeIcon()}
                    <span>{media.type === "video_pronto" ? "Vídeo" : media.type === "take" ? "Take" : "Imagem"}</span>
                  </Badge>
                  
                  <span className="text-sm text-muted-foreground">
                    {media.equipment && media.equipment.length > 0 && media.equipment[0]}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {media.purpose && media.purpose.slice(0, 2).map((purpose) => (
                    <Badge key={purpose} variant="secondary" className="text-xs">
                      {purpose}
                    </Badge>
                  ))}
                  {media.purpose && media.purpose.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{media.purpose.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0"
                    onClick={() => handleRate(star)}
                    disabled={isRating}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        star <= currentRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 mt-auto">
            <Button variant="default" size="sm" asChild className="mr-2">
              <a href={media.videoUrl || "#"} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </a>
            </Button>
          </CardFooter>
        </div>
      </Card>
    );
  }

  // Default grid view
  return (
    <Card className="w-full reelline-card overflow-hidden">
      <div className="relative">
        <div className="aspect-video bg-gray-200">
          <img 
            src={media.thumbnailUrl} 
            alt={media.title}
            className="w-full h-full object-cover"
          />
          {media.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
              {media.duration}
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={getBadgeVariant()} className="flex items-center gap-1">
              {getMediaTypeIcon()}
              <span>{media.type === "video_pronto" ? "Vídeo" : media.type === "take" ? "Take" : media.type}</span>
            </Badge>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 left-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white/90",
            isFavorite && "text-red-500"
          )}
          onClick={handleToggleFavorite}
          disabled={isTogglingFavorite}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium truncate">{media.title}</h3>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {media.equipment && media.equipment.map((item) => (
            <Badge key={item} variant="outline" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {media.purpose && media.purpose.map((purpose, index) => (
            index < 2 ? (
              <Badge key={purpose} variant="secondary" className="text-xs">
                {purpose}
              </Badge>
            ) : index === 2 ? (
              <Badge key="more" variant="secondary" className="text-xs">
                +{media.purpose.length - 2}
              </Badge>
            ) : null
          ))}
        </div>
        
        <div className="flex items-center mt-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={() => handleRate(star)}
              disabled={isRating}
            >
              <Star
                className={cn(
                  "h-5 w-5",
                  star <= currentRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            </Button>
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            {currentRating.toFixed(1)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button variant="default" size="sm" className="w-full" asChild>
          <a href={media.videoUrl || "#"} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-1" />
            View Media
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MediaCard;
