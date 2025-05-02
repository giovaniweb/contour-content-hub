
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageSquare, Share2, Download, TrendingUp, Star } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
}

const PopularContent: React.FC = () => {
  // Exemplo de conteúdo popular - em uma implementação real, estes viriam de uma API
  const popularContent: PopularItem[] = [
    {
      id: "1",
      title: "7 dicas para melhorar a elasticidade da pele",
      type: "Vídeo",
      imageUrl: "/placeholder.svg",
      views: 1240,
      likes: 89,
      comments: 14,
      isHot: true,
      rating: 4.8
    },
    {
      id: "2",
      title: "Como o laser de CO2 ajuda na renovação celular",
      type: "Roteiro",
      imageUrl: "/placeholder.svg",
      views: 832,
      likes: 57,
      comments: 8,
      rating: 4.2
    },
    {
      id: "3",
      title: "Peelings químicos: qual o ideal para seu tipo de pele?",
      type: "Story",
      imageUrl: "/placeholder.svg",
      views: 1122,
      likes: 103,
      comments: 22,
      isHot: true,
      rating: 4.5
    }
  ];

  const handleShare = (item: PopularItem) => {
    // Em uma implementação real, abriria um modal de compartilhamento ou copiaria para o clipboard
    console.log(`Compartilhando: ${item.title}`);
    // Simular copiando um link para o clipboard
    navigator.clipboard.writeText(`https://example.com/content/${item.id}`);
    alert("Link copiado para a área de transferência!");
  };

  const handleLike = (item: PopularItem) => {
    console.log(`Curtindo: ${item.title}`);
    // Em uma implementação real, enviaria uma requisição para a API
  };

  const handleDownload = (item: PopularItem) => {
    console.log(`Baixando: ${item.title}`);
    // Em uma implementação real, iniciaria o download do conteúdo
  };

  return (
    <>
      {popularContent.map((item) => (
        <HoverCard key={item.id}>
          <HoverCardTrigger asChild>
            <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
              <div className="h-40 bg-gray-100 relative group">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.isHot && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Em alta
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="mb-2">
                    {item.type}
                  </Badge>
                </div>
                <h3 className="font-medium text-gray-800 mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center text-gray-500 text-xs space-x-4">
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
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <div className="flex items-center mt-1">
                  {item.rating && (
                    <div className="flex items-center text-yellow-500">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "h-3 w-3",
                            i < Math.floor(item.rating) ? "fill-yellow-400" : "fill-gray-200"
                          )}
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">{item.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {item.isHot && (
                    <Badge variant="outline" className="ml-2 bg-red-50 text-red-500 border-red-200">
                      <TrendingUp className="h-3 w-3 mr-1" /> Tendência
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 flex items-center justify-center" 
                  onClick={() => handleLike(item)}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Curtir
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 flex items-center justify-center" 
                  onClick={() => handleShare(item)}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Compartilhar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 flex items-center justify-center" 
                  onClick={() => handleDownload(item)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Baixar
                </Button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </>
  );
};

export default PopularContent;
