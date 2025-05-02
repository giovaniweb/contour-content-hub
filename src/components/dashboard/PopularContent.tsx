
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageSquare } from "lucide-react";

interface PopularItem {
  id: string;
  title: string;
  type: string;
  imageUrl: string;
  views: number;
  likes: number;
  comments: number;
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
      comments: 14
    },
    {
      id: "2",
      title: "Como o laser de CO2 ajuda na renovação celular",
      type: "Roteiro",
      imageUrl: "/placeholder.svg",
      views: 832,
      likes: 57,
      comments: 8
    },
    {
      id: "3",
      title: "Peelings químicos: qual o ideal para seu tipo de pele?",
      type: "Story",
      imageUrl: "/placeholder.svg",
      views: 1122,
      likes: 103,
      comments: 22
    }
  ];

  return (
    <>
      {popularContent.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all">
          <div className="h-40 bg-gray-100">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
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
      ))}
    </>
  );
};

export default PopularContent;
