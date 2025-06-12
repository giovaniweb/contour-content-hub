
import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  X, 
  Image as ImageIcon, 
  Loader2,
  Package
} from 'lucide-react';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  slideTitle?: string;
}

interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGenerating: boolean;
  progress: number;
  generatedImages: GeneratedImage[];
  onDownloadImage: (image: GeneratedImage) => void;
  onDownloadAll: () => void;
  formato: string;
}

const ImageGenerationModal: React.FC<ImageGenerationModalProps> = ({
  isOpen,
  onClose,
  isGenerating,
  progress,
  generatedImages,
  onDownloadImage,
  onDownloadAll,
  formato
}) => {
  const isCarrossel = formato === 'carrossel';
  const expectedImages = isCarrossel ? 5 : 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="aurora-glass border border-purple-500/30 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-purple-300 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {isCarrossel ? '🎠 Imagens do Carrossel' : '🖼️ Imagem do Post'}
            <Badge variant="outline" className="ml-2">
              {formato.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Loading State */}
          {isGenerating && (
            <div className="space-y-4">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
                <p className="text-purple-300 text-lg">
                  Gerando {expectedImages} imagem{expectedImages > 1 ? 's' : ''}...
                </p>
                <p className="text-sm text-purple-400">
                  {generatedImages.length}/{expectedImages} concluída{generatedImages.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Generated Images Grid */}
          {generatedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Imagens Geradas ({generatedImages.length})
                </h3>
                
                {generatedImages.length > 1 && (
                  <Button
                    onClick={onDownloadAll}
                    className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Download Todas
                  </Button>
                )}
              </div>

              <div className={`grid gap-4 ${
                isCarrossel ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}>
                {generatedImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="relative group">
                      <img 
                        src={image.imageUrl} 
                        alt={image.slideTitle || `Imagem ${index + 1}`}
                        className="w-full rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                      />
                      
                      {/* Overlay com botão de download */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          onClick={() => onDownloadImage(image)}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    {/* Título e info */}
                    <div className="space-y-2">
                      {image.slideTitle && (
                        <h4 className="font-medium text-white text-sm">
                          {image.slideTitle}
                        </h4>
                      )}
                      <p className="text-xs text-purple-300 line-clamp-2">
                        {image.prompt}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isGenerating && generatedImages.length === 0 && (
            <div className="text-center py-8">
              <ImageIcon className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <p className="text-purple-300">Nenhuma imagem foi gerada ainda.</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-purple-500/20">
            <Button
              onClick={onClose}
              variant="outline"
              className="aurora-glass border-purple-500/30 text-purple-300"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGenerationModal;
