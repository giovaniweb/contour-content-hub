
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from 'lucide-react';
import { LazyImage } from "@/components/ui/lazy-image";

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  type: 'photo' | 'art';
}

const FeaturedGallery: React.FC = () => {
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
    // Lógica de download aqui
    console.log(`Baixando: ${item.title}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {galleryItems.map((item) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="relative group overflow-hidden rounded-xl shadow-md"
        >
          <div className="aspect-[4/3] overflow-hidden">
            <LazyImage
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              aspectRatio="wide"
            />
          </div>
          
          {/* Overlay translúcido ao passar o mouse */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-medium text-lg mb-2">{item.title}</h3>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="glass"
                className="flex items-center gap-1"
                onClick={() => console.log(`Ver: ${item.title}`)}
              >
                <Eye className="h-4 w-4" />
                Ver
              </Button>
              
              <Button 
                size="sm" 
                variant="glass"
                className="flex items-center gap-1"
                onClick={() => handleDownload(item)}
              >
                <Download className="h-4 w-4" />
                Baixar
              </Button>
            </div>
          </div>
          
          {/* Brilho neon ao hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-r from-fluida-blue/30 to-fluida-pink/30" />
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturedGallery;
