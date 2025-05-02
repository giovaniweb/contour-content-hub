
import React, { useState, useRef, useEffect } from "react";
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
  Link
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PopularItem {
  id: string;
  title: string;
  type: string;
  imageUrl: string;
  views: number;
  likes: number;
  comments: number;
  isHot?: boolean;
  rating?: number;
  date?: string;
}

const PopularContent: React.FC = () => {
  const { toast } = useToast();
  
  // Exemplo de conteúdo popular - em uma implementação real, estes viriam de uma API
  const popularContent: PopularItem[] = [
    {
      id: "1",
      title: "7 dicas para melhorar a elasticidade da pele",
      type: "Vídeo",
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1170&auto=format&fit=crop",
      views: 1240,
      likes: 89,
      comments: 14,
      isHot: true,
      rating: 4.8,
      date: "2 de maio de 2025"
    },
    {
      id: "2",
      title: "Como o laser de CO2 ajuda na renovação celular",
      type: "Roteiro",
      imageUrl: "https://images.unsplash.com/photo-1612270043573-65a76546f9e8?q=80&w=1171&auto=format&fit=crop",
      views: 832,
      likes: 57,
      comments: 8,
      rating: 4.2,
      date: "30 de abril de 2025"
    },
    {
      id: "3",
      title: "Aplicação abdominal Ref...",
      type: "Story",
      imageUrl: "/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png",
      views: 1122,
      likes: 103,
      comments: 22,
      isHot: true,
      rating: 4.5,
      date: "2 de maio de 2025"
    }
  ];

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

  return (
    <TooltipProvider>
      <>
        {popularContent.map((item) => (
          <div key={item.id} className="group relative">
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
                {likeAnimations[item.id] && (
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
                            favorites[item.id] ? "text-red-500" : "text-gray-800"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id, e);
                          }}
                        >
                          <Heart 
                            className={cn(
                              "h-5 w-5",
                              favorites[item.id] && "fill-current"
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
                
                <div className="flex items-center text-gray-500 text-xs space-x-4 mt-3">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{item.views}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className={cn("h-3 w-3 mr-1", favorites[item.id] && "fill-red-500 text-red-500")} />
                    <span>{favorites[item.id] ? item.likes + 1 : item.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{item.comments}</span>
                  </div>
                </div>
                
                {item.rating && (
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center text-yellow-500">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "h-3 w-3",
                            i < Math.floor(item.rating || 0) ? "fill-yellow-400" : "fill-gray-200"
                          )}
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">{item.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </>
    </TooltipProvider>
  );
};

export default PopularContent;
