
import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  isRating: boolean;
  onRate: (rating: number) => void;
  showValue?: boolean;
  size?: "small" | "default";
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  isRating,
  onRate,
  showValue = false,
  size = "default"
}) => {
  const maxRating = 5;
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center">
      {stars.map((star) => (
        <Star
          key={star}
          className={cn(
            "cursor-pointer transition-all",
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
            size === "small" ? "w-3.5 h-3.5" : "w-4 h-4",
            isRating && "animate-pulse"
          )}
          onClick={() => onRate(star)}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
