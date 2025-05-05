
import React from "react";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";

interface MediaCardContentProps {
  title: string;
  equipment: string[];
  purpose: string[];
  rating: number;
  isRating: boolean;
  onRate: (rating: number) => void;
}

const MediaCardContent: React.FC<MediaCardContentProps> = ({
  title,
  equipment,
  purpose,
  rating,
  isRating,
  onRate,
}) => {
  return (
    <div className="p-4">
      <h3 className="font-medium truncate">{title}</h3>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {equipment && equipment.map((item) => (
          <Badge key={item} variant="outline" className="text-xs">
            {item}
          </Badge>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-1 mt-1">
        {purpose && purpose.map((purpose, index) => (
          index < 2 ? (
            <Badge key={purpose} variant="secondary" className="text-xs">
              {purpose}
            </Badge>
          ) : index === 2 ? (
            <Badge key="more" variant="secondary" className="text-xs">
              +{purpose.length - 2}
            </Badge>
          ) : null
        ))}
      </div>
      
      <div className="flex items-center mt-3">
        <StarRating
          rating={rating}
          isRating={isRating}
          onRate={onRate}
          showValue={true}
        />
      </div>
    </div>
  );
};

export default MediaCardContent;
