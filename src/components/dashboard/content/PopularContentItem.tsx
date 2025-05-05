
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Download, 
  TrendingUp, 
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PopularItem } from "../types/popularContent";

interface PopularContentItemProps {
  item: PopularItem;
  isFavorite: boolean;
  toggleFavorite: (itemId: string, event?: React.MouseEvent) => void;
  handleItemClick: (itemId: string) => void;
  handleShare: (item: PopularItem) => void;
  handleDownload: (item: PopularItem) => void;
  showLikeAnimation: boolean;
}

const PopularContentItem: React.FC<PopularContentItemProps> = ({
  item,
  isFavorite,
  toggleFavorite,
  handleItemClick,
  handleShare,
  handleDownload,
  showLikeAnimation,
}) => {
  return (
    <div className="group relative">
      <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
        <div 
          className="h-48 bg-gray-100 relative"
          onClick={() => handleItemClick(item.id)}
        >
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
          
          {/* Heart Animation on Double Click */}
          {showLikeAnimation && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart className="h-16 w-16 text-white fill-white animate-scale-in opacity-90" />
            </div>
          )}
          
          {/* Duration Badge */}
          {item.type === "Vídeo" && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
              00:07
            </div>
          )}
          
          {/* Floating Action Buttons - Visible on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "rounded-full bg-white hover:bg-white/90 w-10 h-10",
                      isFavorite ? "text-red-500" : "text-gray-800"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id, e);
                    }}
                  >
                    <Heart 
                      className={cn(
                        "h-5 w-5",
                        isFavorite && "fill-current"
                      )} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Curtir</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white hover:bg-white/90 text-gray-800 w-10 h-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(item);
                    }}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compartilhar</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white hover:bg-white/90 text-gray-800 w-10 h-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item);
                    }}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baixar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          {/* Hot Badge */}
          {item.isHot && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-red-100 text-red-600 border-red-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                Em alta
              </Badge>
            </div>
          )}
        </div>
        
        <ItemCardContent item={item} isFavorite={isFavorite} />
      </Card>
    </div>
  );
};

interface ItemCardContentProps {
  item: PopularItem;
  isFavorite: boolean;
}

const ItemCardContent: React.FC<ItemCardContentProps> = ({ item, isFavorite }) => {
  return (
    <CardContent className="p-4">
      <div className="flex items-center mb-2 gap-2">
        <Badge variant="outline">
          {item.type}
        </Badge>
      </div>
      
      <div className="flex items-start">
        {item.imageUrl === "/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" && (
          <div className="mr-3 flex-shrink-0">
            <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1550831107-1553da8c8464?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNsaW5pY3xlbnwwfHwwfHx8MA%3D%3D" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <div>
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
            {item.title}
          </h3>
          <div className="text-xs text-gray-500">
            {item.date}
          </div>
        </div>
      </div>
      
      <ItemStats item={item} isFavorite={isFavorite} />
      <ItemRating rating={item.rating} />
    </CardContent>
  );
};

interface ItemStatsProps {
  item: PopularItem;
  isFavorite: boolean;
}

const ItemStats: React.FC<ItemStatsProps> = ({ item, isFavorite }) => {
  return (
    <div className="flex items-center text-gray-500 text-xs space-x-4 mt-3">
      <div className="flex items-center">
        <Eye className="h-3 w-3 mr-1" />
        <span>{item.views}</span>
      </div>
      <div className="flex items-center">
        <Heart className={cn("h-3 w-3 mr-1", isFavorite && "fill-red-500 text-red-500")} />
        <span>{isFavorite ? item.likes + 1 : item.likes}</span>
      </div>
      <div className="flex items-center">
        <MessageSquare className="h-3 w-3 mr-1" />
        <span>{item.comments}</span>
      </div>
    </div>
  );
};

interface ItemRatingProps {
  rating?: number;
}

const ItemRating: React.FC<ItemRatingProps> = ({ rating }) => {
  if (!rating) return null;
  
  return (
    <div className="mt-2 flex items-center">
      <div className="flex items-center text-yellow-500">
        {Array(5).fill(0).map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "h-3 w-3",
              i < Math.floor(rating || 0) ? "fill-yellow-400" : "fill-gray-200"
            )}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">{rating?.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default PopularContentItem;
