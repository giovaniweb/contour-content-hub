
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";

interface TrendingItem {
  id: string;
  title: string;
  type: 'video' | 'article' | 'script';
  thumbnail: string;
  views?: number;
  link: string;
}

const trendingItems: TrendingItem[] = [
  {
    id: '1',
    title: 'Como utilizar o Aparelho X para Tratamento Facial',
    type: 'video',
    thumbnail: '/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png',
    views: 1240,
    link: '/videos'
  },
  {
    id: '2',
    title: 'Eficácia do Tratamento X no Rejuvenescimento Facial: Um Estudo Clínico',
    type: 'article',
    thumbnail: '/assets/images/article-thumbnail-1.jpg',
    views: 856,
    link: '/articles'
  },
  {
    id: '3',
    title: 'Roteiro: 5 Benefícios do Tratamento Y para Rejuvenescimento',
    type: 'script',
    thumbnail: '/assets/images/script-thumbnail-1.jpg',
    views: 542,
    link: '/scripts'
  },
  {
    id: '4',
    title: 'Demonstração do Procedimento Y - Passo a passo detalhado',
    type: 'video',
    thumbnail: '/assets/images/video-thumbnail-2.jpg',
    views: 890,
    link: '/videos'
  }
];

const TrendingItemCard: React.FC<{ item: TrendingItem; index: number }> = ({ item, index }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(item.link);
  };
  
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'video': return 'Vídeo';
      case 'article': return 'Artigo';
      case 'script': return 'Roteiro';
      default: return type;
    }
  };
  
  return (
    <motion.div
      variants={itemVariants}
      className="cursor-pointer"
      onClick={handleClick}
    >
      <Card className="overflow-hidden group hover:shadow-md transition-all h-full flex flex-col">
        <div className="relative">
          <img 
            src={item.thumbnail} 
            alt={item.title}
            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {getTypeLabel(item.type)}
          </div>
          {item.views && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {item.views.toLocaleString()} visualizações
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <h3 className="font-medium text-base line-clamp-2">{item.title}</h3>
          <div className="flex justify-end mt-2">
            <div className="text-sm font-medium text-muted-foreground">
              #{index + 1}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TrendingItems: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Conteúdos Populares</h2>
          <span className="text-sm text-muted-foreground">Última semana</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingItems.map((item, index) => (
            <TrendingItemCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingItems;
