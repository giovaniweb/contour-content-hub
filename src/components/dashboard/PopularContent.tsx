import React from "react";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import PopularContentItem from "./content/PopularContentItem";
import { usePopularContent } from "./hooks/usePopularContent";
import { getPopularContent } from "./data/popularContentData";

import { useEffect, useState } from "react";
import { PopularItem } from "./types/popularContent";

const PopularContent: React.FC = () => {
  const [popularContent, setPopularContent] = useState<PopularItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let running = true;
    (async () => {
      setLoading(true);
      const data = await getPopularContent();
      if (running) {
        setPopularContent(data);
        setLoading(false);
      }
    })();
    return () => { running = false; };
  }, []);

  const {
    favorites,
    likeAnimations,
    handleShare,
    handleDownload,
    toggleFavorite,
    handleItemClick,
    showLikeAnimation,
  } = usePopularContent(popularContent);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="text-aurora-lavender">Carregando conteúdo popular...</span>
      </div>
    );
  }

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
