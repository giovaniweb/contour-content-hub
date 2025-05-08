
import React from "react";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import { getMediaTypeIcon, getMediaTypeName } from "./mediaUtils";

interface MediaCardListContentProps {
  title: string;
  equipment: string[];
  purpose: string[];
  type: string;
  rating: number;
  isRating: boolean;
  onRate: (rating: number) => void;
}

const MediaCardListContent: React.FC<MediaCardListContentProps> = ({
  title,
  equipment,
  purpose,
  type,
  rating,
  isRating,
  onRate,
}) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{title}</h3>
          
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="flex items-center gap-1 mr-2">
              {getMediaTypeIcon(type)}
              <span>{getMediaTypeName(type)}</span>
            </Badge>
            
            <span className="text-sm text-muted-foreground">
              {equipment && equipment.length > 0 && equipment[0]}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {purpose && purpose.slice(0, 2).map((purpose) => (
              <Badge key={purpose} variant="secondary" className="text-xs">
                {purpose}
              </Badge>
            ))}
            {purpose && purpose.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{purpose.length - 2}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <StarRating
            rating={rating}
            isRating={isRating}
            onRate={onRate}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default MediaCardListContent;
