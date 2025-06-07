
import React from 'react';
import { Card } from '@/components/ui/card';

const ImageGallerySection: React.FC = () => {
  const images = [
    {
      id: 1,
      title: 'Antes e Depois - Harmonização Facial',
      category: 'Resultados',
      image: '/placeholder-before-after.jpg'
    },
    {
      id: 2,
      title: 'Equipamentos de Última Geração',
      category: 'Tecnologia',
      image: '/placeholder-equipment.jpg'
    },
    {
      id: 3,
      title: 'Ambiente Clínico Moderno',
      category: 'Estrutura',
      image: '/placeholder-clinic.jpg'
    },
    {
      id: 4,
      title: 'Procedimentos Minimamente Invasivos',
      category: 'Tratamentos',
      image: '/placeholder-procedure.jpg'
    }
  ];

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Galeria de Imagens</h2>
        <p className="text-muted-foreground">Inspire-se com resultados reais e equipamentos modernos</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
            <div className="relative aspect-square bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-xs font-medium">{image.category}</span>
                  <h3 className="text-sm font-semibold mt-1">{image.title}</h3>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ImageGallerySection;
