
import React from "react";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import PopularContentItem from "./content/PopularContentItem";
import { usePopularContent } from "./hooks/usePopularContent";
import { getPopularContent } from "./data/popularContentData";

const PopularContent: React.FC = () => {
  const popularContent = getPopularContent();
  const {
    favorites,
    likeAnimations,
    handleShare,
    handleDownload,
    toggleFavorite,
    handleItemClick,
    showLikeAnimation,
  } = usePopularContent(popularContent);

  return (
    <TooltipProvider>
      <>
        {popularContent.map((item) => (
          <PopularContentItem
            key={item.id}
            item={item}
            isFavorite={!!favorites[item.id]}
            toggleFavorite={toggleFavorite}
            handleItemClick={() => handleItemClick(item.id)}
            handleShare={handleShare}
            handleDownload={handleDownload}
            showLikeAnimation={!!likeAnimations[item.id]}
          />
        ))}
      </>
    </TooltipProvider>
  );
};

export default PopularContent;
