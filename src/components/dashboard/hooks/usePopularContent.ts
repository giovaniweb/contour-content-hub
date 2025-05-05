
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PopularItem } from "../types/popularContent";

export function usePopularContent(popularContent: PopularItem[]) {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [likeAnimations, setLikeAnimations] = useState<Record<string, boolean>>({});
  const clickTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const clickCounter = useRef<Record<string, number>>({});

  useEffect(() => {
    // Cleanup timers on unmount
    return () => {
      Object.values(clickTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const handleShare = (item: PopularItem) => {
    // Em uma implementação real, abriria um modal de compartilhamento ou copiaria para o clipboard
    console.log(`Compartilhando: ${item.title}`);
    // Simular copiando um link para o clipboard
    navigator.clipboard.writeText(`https://example.com/content/${item.id}`);
    toast({
      title: "Link copiado!",
      description: "Link copiado para a área de transferência",
    });
  };

  const handleDownload = (item: PopularItem) => {
    console.log(`Baixando: ${item.title}`);
    toast({
      title: "Download iniciado",
      description: `Baixando: ${item.title}`,
    });
    // Em uma implementação real, iniciaria o download do conteúdo
  };

  const toggleFavorite = (itemId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    setFavorites(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
    
    const item = popularContent.find(i => i.id === itemId);
    if (item) {
      toast({
        title: favorites[itemId] ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: item.title,
      });
    }
  };

  // Instagram style double-click to like
  const handleItemClick = (itemId: string) => {
    if (!clickCounter.current[itemId]) {
      clickCounter.current[itemId] = 1;
    } else {
      clickCounter.current[itemId]++;
    }

    // Clear existing timer
    if (clickTimers.current[itemId]) {
      clearTimeout(clickTimers.current[itemId]);
    }

    // Set new timer
    clickTimers.current[itemId] = setTimeout(() => {
      // Double click
      if (clickCounter.current[itemId] >= 2) {
        if (!favorites[itemId]) {
          toggleFavorite(itemId);
          showLikeAnimation(itemId);
        }
      }
      
      // Reset counter
      clickCounter.current[itemId] = 0;
    }, 300); // 300ms threshold for double-click
  };

  const showLikeAnimation = (itemId: string) => {
    setLikeAnimations(prev => ({ ...prev, [itemId]: true }));
    
    setTimeout(() => {
      setLikeAnimations(prev => ({ ...prev, [itemId]: false }));
    }, 1000);
  };

  return {
    favorites,
    likeAnimations,
    handleShare,
    handleDownload,
    toggleFavorite,
    handleItemClick,
    showLikeAnimation,
  };
}
