
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';

const FeaturedCarousel: React.FC = () => {
  // Mock data for featured content
  const featuredItems = [
    {
      id: '1',
      title: 'Como criar vídeos educativos sobre procedimentos estéticos',
      type: 'video',
      image: '/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png',
      link: `${ROUTES.VIDEOS.PLAYER}?id=1`,
      badge: 'Em alta'
    },
    {
      id: '2',
      title: 'Roteiro para demonstração completa de equipamento facial',
      type: 'script',
      image: '/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png',
      link: `${ROUTES.CONTENT.SCRIPTS.GENERATOR}?template=2`,
      badge: 'Novo'
    },
    {
      id: '3',
      title: 'Dicas para criar antes & depois de procedimentos estéticos',
      type: 'article',
      image: '/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png',
      link: `${ROUTES.SCIENTIFIC_ARTICLES}/3`,
      badge: 'Popular'
    },
    {
      id: '4',
      title: 'Galeria de mídias para tratamentos corporais',
      type: 'media',
      image: '/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png',
      link: `${ROUTES.MEDIA}?category=4`,
      badge: 'Recomendado'
    },
    {
      id: '5',
      title: 'Roteiro: Benefícios comprovados do laser fracionado',
      type: 'script',
      image: '/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png',
      link: `${ROUTES.CONTENT.SCRIPTS.GENERATOR}?template=5`,
      badge: 'Científico'
    },
    {
      id: '6',
      title: 'Tendências em rejuvenescimento facial para 2025',
      type: 'article',
      image: '/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png',
      link: `${ROUTES.SCIENTIFIC_ARTICLES}/6`,
      badge: 'Tendência'
    },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const visibleItems = 4; // Number of items visible at once
  
  const nextSlide = () => {
    setStartIndex((prevIndex) => 
      Math.min(prevIndex + 1, featuredItems.length - visibleItems)
    );
  };
  
  const prevSlide = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
  
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'script': return 'bg-purple-100 text-purple-800';
      case 'article': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="relative">
      <div className="flex justify-between mb-6">
        <div className="flex gap-4">
          <Button 
            onClick={prevSlide} 
            disabled={startIndex === 0}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button 
            onClick={nextSlide} 
            disabled={startIndex >= featuredItems.length - visibleItems}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        <Link to="/all-featured" className="text-fluida-blue font-medium hover:underline">
          Ver todos
        </Link>
      </div>
      
      <div className="overflow-hidden">
        <motion.div 
          className="flex gap-6"
          animate={{ x: -startIndex * (100 / visibleItems) + '%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ width: `${(featuredItems.length / visibleItems) * 100}%` }}
        >
          {featuredItems.map((item) => (
            <div 
              key={item.id} 
              className="relative flex-shrink-0" 
              style={{ width: `calc(${100 / visibleItems}% - ${(6 * (visibleItems - 1)) / visibleItems}rem)` }}
            >
              <Link to={item.link}>
                <Card className="overflow-hidden group h-full hover:shadow-lg transition-all">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 z-10 flex gap-2">
                      <Badge className={`${getTypeColor(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                      {item.badge && (
                        <Badge variant="secondary" className="bg-white text-gray-800">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-2">{item.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
