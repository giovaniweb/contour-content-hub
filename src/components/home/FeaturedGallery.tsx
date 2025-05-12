
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage } from "@/components/ui/lazy-image";

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  type: 'photo' | 'art';
}

const FeaturedGallery: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Dados de exemplo para a galeria
  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Procedimento estético facial',
      imageUrl: '/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png',
      type: 'photo'
    },
    {
      id: '2',
      title: 'Kit de produtos para skincare',
      imageUrl: '/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png',
      type: 'photo'
    },
    {
      id: '3',
      title: 'Técnica de massagem facial',
      imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80',
      type: 'photo'
    },
    {
      id: '4',
      title: 'Arte digital para mídia social',
      imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
      type: 'art'
    },
    {
      id: '5',
      title: 'Infográfico de tratamentos',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      type: 'art'
    },
    {
      id: '6',
      title: 'Equipamento de última geração',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 
      type: 'photo'
    }
  ];

  // Função para simular o download
  const handleDownload = (item: GalleryItem) => {
    console.log(`Baixando: ${item.title}`);
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = 300; // Pixels para rolar
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  return (
    <div className="relative">
      {/* Botão de navegação esquerdo */}
      <Button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
        onClick={() => scroll('left')}
        size="icon"
        disabled={scrollPosition <= 0}
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      </Button>

      {/* Carrossel */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-6 pt-2 px-4 hide-scrollbar snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
      >
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        
        {galleryItems.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="relative min-w-[300px] sm:min-w-[350px] snap-start bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <LazyImage
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                aspectRatio="wide"
              />
            </div>
            
            {/* Overlay com informações e ações */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white font-medium text-lg mb-3">{item.title}</h3>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex items-center gap-1 bg-white/20 backdrop-blur-sm hover:bg-white/40"
                  onClick={() => console.log(`Ver: ${item.title}`)}
                >
                  <Eye className="h-4 w-4" />
                  Ver
                </Button>
                
                <Button 
                  size="sm" 
                  className="flex items-center gap-1 bg-white/20 backdrop-blur-sm hover:bg-white/40"
                  onClick={() => handleDownload(item)}
                >
                  <Download className="h-4 w-4" />
                  Baixar
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Botão de navegação direito */}
      <Button
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
        onClick={() => scroll('right')}
        size="icon"
        disabled={scrollContainerRef.current ? 
          scrollPosition >= scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth : 
          false}
      >
        <ChevronRight className="h-6 w-6 text-gray-700" />
      </Button>
    </div>
  );
};

export default FeaturedGallery;
