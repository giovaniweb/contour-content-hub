
import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface StarRatingProps {
  rating: number;
  isRating: boolean;
  onRate: (rating: number) => void;
  showValue?: boolean;
  size?: "small" | "medium";
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  isRating,
  onRate,
  showValue = false,
  size = "medium"
}) => {
  const getStarSize = () => {
    return size === "small" ? "h-4 w-4" : "h-5 w-5";
  };

  const getButtonSize = () => {
    return size === "small" ? "h-6 w-6" : "h-7 w-7";
  };

  return (
    <TooltipProvider>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Tooltip key={star}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`${getButtonSize()} p-0`}
                onClick={() => onRate(star)}
                disabled={isRating}
              >
                <Star
                  className={cn(
                    getStarSize(),
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rate {star} {star === 1 ? 'star' : 'stars'}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {showValue && (
          <span className="text-xs text-muted-foreground ml-1">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    </TooltipProvider>
  );
};

export default StarRating;
