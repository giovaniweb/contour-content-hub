import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Eye,
  Images,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CarouselViewerProps {
  images: string[];
  title: string;
  onDownload?: (imageUrl: string, index: number) => void;
  className?: string;
}

const CarouselViewer: React.FC<CarouselViewerProps> = ({ 
  images, 
  title, 
  onDownload,
  className = ""
}) => {
  const handleDownload = (imageUrl: string, index: number) => {
    if (onDownload) {
      onDownload(imageUrl, index);
    } else {
      // Download padrão
      const link = document.createElement('a');
      link.href = `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${imageUrl}`;
      link.download = `${title}-${index + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAll = () => {
    images.forEach((imageUrl, index) => {
      setTimeout(() => {
        handleDownload(imageUrl, index);
      }, index * 500); // Delay para evitar muitos downloads simultâneos
    });
  };

  if (images.length === 0) {
    return null;
  }

  // Se for apenas uma imagem, renderizar simples
  if (images.length === 1) {
    return (
      <div className={`relative group ${className}`}>
        <div className="aspect-[16/9] rounded-lg overflow-hidden bg-black/20">
          <img
            src={`https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${images[0]}`}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div className="aspect-[16/9] rounded-lg overflow-hidden bg-black/20">
        {/* Preview da primeira imagem */}
        <img
          src={`https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${images[0]}`}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay com indicação de carrossel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50">
          {/* Badge de carrossel */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-aurora-electric-purple/90 text-white border-aurora-electric-purple">
              <Images className="h-3 w-3 mr-1" />
              {images.length} fotos
            </Badge>
          </div>

          {/* Botões de ação */}
          <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="aurora-button aurora-glow">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-slate-900 border-aurora-electric-purple/30">
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    <Images className="h-5 w-5 text-aurora-electric-purple" />
                    {title} - Carrossel
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Carrossel principal */}
                  <Carousel className="w-full">
                    <CarouselContent>
                      {images.map((imageUrl, index) => (
                        <CarouselItem key={index}>
                          <div className="relative">
                            <div className="aspect-[16/9] rounded-lg overflow-hidden bg-black/20">
                              <img
                                src={`https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${imageUrl}`}
                                alt={`${title} - ${index + 1}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            
                            {/* Contador */}
                            <div className="absolute bottom-2 left-2">
                              <Badge className="bg-black/70 text-white">
                                {index + 1} de {images.length}
                              </Badge>
                            </div>

                            {/* Botão de download individual */}
                            <div className="absolute bottom-2 right-2">
                              <Button
                                size="sm"
                                onClick={() => handleDownload(imageUrl, index)}
                                className="aurora-button aurora-glow hover:aurora-glow-intense"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {images.map((imageUrl, index) => (
                      <div key={index} className="relative group cursor-pointer">
                        <div className="aspect-square rounded overflow-hidden bg-black/20 hover:ring-2 hover:ring-aurora-electric-purple transition-all">
                          <img
                            src={`https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${imageUrl}`}
                            alt={`Thumb ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                          <span className="text-white text-xs font-medium">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ações */}
                  <div className="flex justify-center gap-2 pt-4 border-t border-aurora-electric-purple/30">
                    <Button
                      onClick={downloadAll}
                      className="aurora-button aurora-glow hover:aurora-glow-intense"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Todas ({images.length})
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              size="sm" 
              onClick={downloadAll}
              variant="outline"
              className="border-aurora-emerald/30 text-aurora-emerald hover:bg-aurora-emerald/20"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Indicadores de navegação */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === 0 ? 'bg-aurora-electric-purple' : 'bg-white/30'
                }`}
              />
            ))}
            {images.length > 5 && (
              <div className="w-2 h-2 rounded-full bg-white/30" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselViewer;