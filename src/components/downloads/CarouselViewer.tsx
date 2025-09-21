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
  FileText,
  Wand2
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
  const handleDownload = async (imageUrl: string, index: number) => {
    if (onDownload) {
      onDownload(imageUrl, index);
    } else {
      // Download individual forçado
      try {
        const fullUrl = `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${imageUrl}`;
        const response = await fetch(fullUrl);
        const blob = await response.blob();
        
        // Criar link de download forçado
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}-${index + 1}.${getFileExtension(imageUrl)}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Erro ao baixar imagem:', error);
      }
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop() || 'jpg';
  };

  const downloadAll = async () => {
    try {
      // Importar JSZip dinamicamente
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Adicionar cada imagem ao ZIP
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const fullUrl = `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${imageUrl}`;
        
        try {
          const response = await fetch(fullUrl);
          const blob = await response.blob();
          const filename = `${title}-${i + 1}.${getFileExtension(imageUrl)}`;
          zip.file(filename, blob);
        } catch (error) {
          console.error(`Erro ao baixar imagem ${i + 1}:`, error);
        }
      }
      
      // Gerar e baixar o ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}-todas-imagens.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro ao criar ZIP:', error);
    }
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
              <DialogContent className="max-w-7xl bg-slate-900 border-aurora-electric-purple/30">
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    <Eye className="h-5 w-5 text-aurora-electric-purple" />
                    Visualizar com IA - {title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[80vh] overflow-auto">
                  {/* Image Preview */}
                  <div className="space-y-4">
                    <div className="flex-1">
                      <Carousel className="w-full h-full">
                        <CarouselContent className="h-full">
                          {images.map((imageUrl, index) => (
                            <CarouselItem key={index} className="h-full">
                              <div className="relative h-full">
                                <div className="aspect-square w-full overflow-hidden rounded-lg border border-aurora-electric-purple/30">
                                  <img
                                    src={`https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${imageUrl}`}
                                    alt={`${title} - ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                
                                {/* Contador */}
                                <div className="absolute bottom-3 left-3">
                                  <Badge className="bg-black/70 text-white border-0">
                                    {index + 1} de {images.length}
                                  </Badge>
                                </div>

                                {/* Botão de download individual */}
                                <div className="absolute bottom-3 right-3">
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
                    </div>

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

                    {/* Botão Download All */}
                    <div className="flex justify-start pt-2">
                      <Button
                        onClick={downloadAll}
                        className="aurora-button aurora-glow hover:aurora-glow-intense px-6"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Todas ({images.length})
                      </Button>
                    </div>
                  </div>

                  {/* AI Caption Generator */}
                  <div className="space-y-4">
                    <CaptionGenerator
                      imageUrl={material?.file_url || images[0]}
                      equipments={material?.equipment_ids ? 
                        equipments.filter(eq => material.equipment_ids.includes(eq.id)) : []
                      }
                    />
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