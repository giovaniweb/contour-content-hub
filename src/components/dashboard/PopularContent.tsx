
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

  const handleLike = (item: PopularItem) => {
    console.log(`Curtindo: ${item.title}`);
    toast({
      title: item.title,
      description: "Adicionado aos favoritos",
    });
    // Em uma implementação real, enviaria uma requisição para a API
  };

  const handleDownload = (item: PopularItem) => {
    console.log(`Baixando: ${item.title}`);
    toast({
      title: "Download iniciado",
      description: `Baixando: ${item.title}`,
    });
    // Em uma implementação real, iniciaria o download do conteúdo
  };

  const toggleFavorite = (itemId: string) => {
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

  return (
    <TooltipProvider>
      <>
        {popularContent.map((item) => (
          <div key={item.id} className="group relative">
            <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
              <div className="h-48 bg-gray-100 relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Duration Badge */}
                {item.type === "Vídeo" && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                    00:07
                  </div>
                )}
                
                {/* Floating Action Buttons - Visible on hover */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          "rounded-full bg-gray-200 bg-opacity-80 hover:bg-gray-300",
                          favorites[item.id] && "text-yellow-500"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                      >
                        <Star 
                          className={cn(
                            "h-4 w-4",
                            favorites[item.id] && "fill-yellow-500"
                          )} 
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Favoritar</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-gray-200 bg-opacity-80 hover:bg-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
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
                        className="rounded-full bg-gray-200 bg-opacity-80 hover:bg-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(item);
                        }}
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copiar link</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center mb-2 gap-2">
                  {item.isHot && (
                    <Badge variant="secondary" className="bg-red-100 text-red-600 border-red-200">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Em alta
                    </Badge>
                  )}
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
                    <Heart className="h-3 w-3 mr-1" />
                    <span>{item.likes}</span>
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
