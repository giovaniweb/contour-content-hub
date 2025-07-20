import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface CarouselFile {
  id: string;
  file: File;
  preview: string;
  url?: string;
  uploading?: boolean;
}

interface CarouselUploaderProps {
  onComplete: (files: CarouselFile[]) => void;
  maxFiles?: number;
}

const CarouselUploader: React.FC<CarouselUploaderProps> = ({ 
  onComplete, 
  maxFiles = 10 
}) => {
  const [files, setFiles] = useState<CarouselFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, maxFiles - files.length).map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file)
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [files.length, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf']
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    disabled: files.length >= maxFiles || uploading
  });

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadedFiles: CarouselFile[] = [];

    try {
      for (const carouselFile of files) {
        setFiles(prev => 
          prev.map(f => f.id === carouselFile.id ? { ...f, uploading: true } : f)
        );

        const fileExt = carouselFile.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('downloads')
          .upload(fileName, carouselFile.file);

        if (error) throw error;

        uploadedFiles.push({
          ...carouselFile,
          url: data.path,
          uploading: false
        });

        setFiles(prev => 
          prev.map(f => f.id === carouselFile.id ? { ...f, uploading: false, url: data.path } : f)
        );
      }

      toast({
        title: "Upload concluído!",
        description: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso.`,
      });

      onComplete(uploadedFiles);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível enviar os arquivos.",
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-6 w-6" />;
    }
    return <ImageIcon className="h-6 w-6" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-aurora-electric-purple bg-aurora-electric-purple/10' 
              : 'border-aurora-electric-purple/30 hover:border-aurora-electric-purple/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-aurora-electric-purple/20">
              <Upload className="h-8 w-8 text-aurora-electric-purple" />
            </div>
            
            <div>
              <h3 className="aurora-heading text-lg font-semibold text-white mb-2">
                {isDragActive ? 'Solte os arquivos aqui...' : 'Upload de Carrossel'}
              </h3>
              <p className="aurora-body text-white/70 mb-4">
                Arraste e solte ou clique para selecionar múltiplas imagens
              </p>
              
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="border-aurora-neon-blue/30 text-aurora-neon-blue">
                  JPG, PNG, GIF, PDF
                </Badge>
                <Badge variant="outline" className="border-aurora-emerald/30 text-aurora-emerald">
                  Até 500MB cada
                </Badge>
                <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple">
                  Máx. {maxFiles} arquivos
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Files Preview */}
      {files.length > 0 && (
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="aurora-heading text-lg font-semibold text-white">
                Preview do Carrossel ({files.length}/{maxFiles})
              </h4>
              <Button
                onClick={uploadFiles}
                disabled={uploading}
                className="aurora-button aurora-glow hover:aurora-glow-intense"
              >
                {uploading ? 'Enviando...' : 'Confirmar Upload'}
              </Button>
            </div>

            {/* Carousel Preview */}
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {files.map((carouselFile) => (
                    <CarouselItem key={carouselFile.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="relative group">
                        <Card className="aurora-glass border-aurora-electric-purple/20">
                          <CardContent className="p-0">
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/20">
                              {carouselFile.file.type.startsWith('image/') ? (
                                <img
                                  src={carouselFile.preview}
                                  alt={carouselFile.file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                  {getFileIcon(carouselFile.file)}
                                  <span className="text-white/60 text-sm mt-2">
                                    {carouselFile.file.name}
                                  </span>
                                </div>
                              )}
                              
                              {carouselFile.uploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <div className="w-8 h-8 border-2 border-aurora-electric-purple border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}

                              {/* Remove button */}
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeFile(carouselFile.id)}
                                disabled={uploading}
                              >
                                <X className="h-3 w-3" />
                              </Button>

                              {/* File info */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <p className="text-white text-xs truncate">
                                  {carouselFile.file.name}
                                </p>
                                <p className="text-white/60 text-xs">
                                  {(carouselFile.file.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                  
                  {/* Add more button */}
                  {files.length < maxFiles && (
                    <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                      <Card 
                        className="aurora-glass border-aurora-electric-purple/30 border-dashed cursor-pointer hover:border-aurora-electric-purple/50 transition-colors"
                        onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                      >
                        <CardContent className="p-0">
                          <div className="aspect-[4/3] flex flex-col items-center justify-center">
                            <div className="p-3 rounded-full bg-aurora-electric-purple/20 mb-2">
                              <Plus className="h-6 w-6 text-aurora-electric-purple" />
                            </div>
                            <span className="text-white/70 text-sm">
                              Adicionar mais
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          </CardContent>
        </Card>
      )}

      {files.length === 0 && (
        <div className="text-center py-8">
          <p className="aurora-body text-white/60">
            Nenhum arquivo selecionado ainda
          </p>
        </div>
      )}
    </div>
  );
};

export default CarouselUploader;