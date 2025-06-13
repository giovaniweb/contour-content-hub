
import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Download, 
  X, 
  Camera, 
  Loader2,
  Package,
  RefreshCw,
  AlertTriangle,
  Eye,
  Sparkles
} from 'lucide-react';
import { SlideImagePrompt } from '@/utils/photographicPromptBuilder';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  slideTitle?: string;
  equipmentUsed?: string[];
  imageStyle?: string;
  isRealistic?: boolean;
}

interface PhotographicImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGenerating: boolean;
  progress: number;
  generatedImages: GeneratedImage[];
  slidePrompts: SlideImagePrompt[];
  errors: string[];
  onDownloadImage: (image: GeneratedImage) => void;
  onDownloadAll: () => void;
  onRetryFailed?: (failedIndexes: number[]) => void;
  formato: string;
}

const PhotographicImageModal: React.FC<PhotographicImageModalProps> = ({
  isOpen,
  onClose,
  isGenerating,
  progress,
  generatedImages,
  slidePrompts,
  errors = [],
  onDownloadImage,
  onDownloadAll,
  onRetryFailed,
  formato
}) => {
  const isCarrossel = formato === 'carrossel';
  const expectedImages = isCarrossel ? 5 : 1;
  
  const failedIndexes = errors.map((_, index) => index).filter(index => 
    !generatedImages.find(img => img.id === `photo-${index + 1}` || img.id === `photo-retry-${index + 1}`)
  );

  const getStyleIcon = (style?: string) => {
    switch (style) {
      case 'hero': return '🏆';
      case 'problem': return '❓';
      case 'solution': return '⚡';
      case 'results': return '✨';
      case 'cta': return '📞';
      default: return '📸';
    }
  };

  const getStyleLabel = (style?: string) => {
    switch (style) {
      case 'hero': return 'Apresentação';
      case 'problem': return 'Problema';
      case 'solution': return 'Solução';
      case 'results': return 'Resultados';
      case 'cta': return 'Chamada';
      default: return 'Fotográfica';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="aurora-glass border border-purple-500/30 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-purple-300 flex items-center gap-2">
            <Camera className="h-6 w-6" />
            📸 Imagens Fotográficas Realistas
            <Badge variant="outline" className="ml-2 bg-green-500/20 border-green-500 text-green-300">
              {formato.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 border-blue-500 text-blue-300">
              <Sparkles className="h-3 w-3 mr-1" />
              ANTI-ALUCINAÇÃO
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Loading State */}
          {isGenerating && (
            <div className="space-y-4">
              <div className="text-center">
                <Camera className="h-12 w-12 animate-pulse text-green-400 mx-auto mb-4" />
                <p className="text-green-300 text-lg">
                  📸 Gerando {expectedImages} imagem{expectedImages > 1 ? 's' : ''} fotográfica{expectedImages > 1 ? 's' : ''}...
                </p>
                <p className="text-sm text-green-400">
                  {generatedImages.length}/{expectedImages} concluída{generatedImages.length !== 1 ? 's' : ''} • Qualidade profissional
                </p>
              </div>
              
              <Progress value={progress} className="w-full" />
              
              <div className="text-center text-xs text-green-300/70">
                ✨ Usando sistema anti-alucinação para equipamentos reais
              </div>
            </div>
          )}

          {/* Error Display */}
          {errors.length > 0 && !isGenerating && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                <div className="space-y-1">
                  <p className="font-medium">Algumas imagens fotográficas falharam:</p>
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm">{error}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Prompts Preview */}
          {slidePrompts.length > 0 && !isGenerating && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Prompts Fotográficos Gerados
              </h3>
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {slidePrompts.map((prompt, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getStyleIcon(prompt.imageStyle)}</span>
                      <span className="font-medium text-white">{prompt.slideTitle}</span>
                      <Badge variant="outline" className="text-xs">
                        {getStyleLabel(prompt.imageStyle)}
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-xs line-clamp-2">
                      {prompt.prompt.substring(0, 150)}...
                    </p>
                    {prompt.equipmentUsed && prompt.equipmentUsed.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {prompt.equipmentUsed.map((eq, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-blue-500/20 border-blue-500 text-blue-300">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Images Grid */}
          {generatedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  📸 Imagens Fotográficas Geradas ({generatedImages.length}/{expectedImages})
                </h3>
                
                <div className="flex gap-2">
                  {failedIndexes.length > 0 && onRetryFailed && (
                    <Button
                      onClick={() => onRetryFailed(failedIndexes)}
                      disabled={isGenerating}
                      variant="outline"
                      size="sm"
                      className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerar ({failedIndexes.length})
                    </Button>
                  )}
                  
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
              </div>

              <div className={`grid gap-6 ${
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
                        className="w-full rounded-lg border border-green-500/20 hover:border-green-500/40 transition-colors shadow-lg"
                      />
                      
                      {/* Realistic badge */}
                      {image.isRealistic && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-green-500/90 text-white text-xs">
                            <Camera className="h-3 w-3 mr-1" />
                            REALISTA
                          </Badge>
                        </div>
                      )}
                      
                      {/* Overlay com botão de download */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          onClick={() => onDownloadImage(image)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    {/* Info da imagem */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStyleIcon(image.imageStyle)}</span>
                        {image.slideTitle && (
                          <h4 className="font-medium text-white text-sm">
                            {image.slideTitle}
                          </h4>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {getStyleLabel(image.imageStyle)}
                        </Badge>
                      </div>
                      
                      {image.equipmentUsed && image.equipmentUsed.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {image.equipmentUsed.map((eq, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-blue-500/20 border-blue-500 text-blue-300">
                              {eq}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-green-300/70">
                        ✨ Imagem fotográfica profissional anti-alucinação
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isGenerating && generatedImages.length === 0 && errors.length === 0 && (
            <div className="text-center py-8">
              <Camera className="h-16 w-16 text-green-400 mx-auto mb-4 opacity-50" />
              <p className="text-green-300">Nenhuma imagem fotográfica foi gerada ainda.</p>
              <p className="text-xs text-green-400 mt-2">
                Sistema pronto para gerar imagens realistas com equipamentos reais
              </p>
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

export default PhotographicImageModal;
