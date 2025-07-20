import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Eye,
  Images,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import CaptionGenerator from './CaptionGenerator';
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
  material?: any;
  equipments?: any[];
  onDownload?: (imageUrl: string, index: number) => void;
  className?: string;
}

const CarouselViewer: React.FC<CarouselViewerProps> = ({ 
  images, 
  title, 
  material,
  equipments = [],
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
              <DialogContent className="max-w-6xl bg-slate-900 border-aurora-electric-purple/30">
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    <Images className="h-5 w-5 text-aurora-electric-purple" />
                    {title} - Carrossel
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Lado esquerdo - Imagens */}
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
                    <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
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
                    <div className="flex justify-center gap-2 pt-4">
                      <Button
                        onClick={downloadAll}
                        className="aurora-button aurora-glow hover:aurora-glow-intense"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Todas ({images.length})
                      </Button>
                    </div>
                  </div>

                  {/* Lado direito - Informações e Legenda */}
                  <div className="space-y-4">
                    {/* Informações do material */}
                    {material && (
                      <div className="aurora-card p-4 space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-slate-200 mb-2">{material.title}</h3>
                          {material.description && (
                            <p className="text-sm text-slate-400 mb-3">{material.description}</p>
                          )}
                        </div>

                        {/* Tags */}
                        {material.tags && material.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {material.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-aurora-electric-purple/20 text-aurora-electric-purple rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Equipamentos */}
                        {material.equipment_ids && material.equipment_ids.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-300 mb-2">Equipamentos:</h4>
                            <div className="flex flex-wrap gap-2">
                              {material.equipment_ids.map((equipId, index) => {
                                const equipment = equipments.find(eq => eq.id === equipId);
                                return equipment ? (
                                  <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-aurora-neon-blue/20 text-aurora-neon-blue rounded-full"
                                  >
                                    {equipment.nome}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}

                        {/* Legenda existente */}
                        {material.metadata && typeof material.metadata === 'object' && 'caption' in material.metadata && (
                          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-aurora-electric-purple mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-medium text-slate-300 mb-1">Legenda atual:</h4>
                                <p className="text-sm text-slate-400">{String(material.metadata.caption)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Gerador de Legenda */}
                    {material && (
                      <CaptionGenerator
                        imageUrl={material.file_url}
                        equipments={material.equipment_ids ? 
                          equipments.filter(eq => material.equipment_ids.includes(eq.id)) : []
                        }
                        onCaptionGenerated={(caption) => {
                          console.log('Caption generated:', caption);
                        }}
                      />
                    )}
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