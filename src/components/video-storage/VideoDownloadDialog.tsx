
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { VideoFile, StoredVideo } from '@/types/video-storage';
import { getVimeoDownloadLinks, extractVimeoId } from '@/services/vimeoDownloadService';
import { useToast } from '@/hooks/use-toast';

interface VideoDownloadDialogProps {
  video?: StoredVideo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoTitle?: string;
  videoUrl?: string;
  existingDownloadLinks?: VideoFile;
}

const VideoDownloadDialog: React.FC<VideoDownloadDialogProps> = ({
  open,
  onOpenChange,
  video,
  videoTitle,
  videoUrl,
  existingDownloadLinks
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState<VideoFile | undefined>(
    video?.file_urls || existingDownloadLinks
  );
  const [selectedQuality, setSelectedQuality] = useState<'original' | 'hd' | 'sd' | 'web_optimized'>('hd');
  const [error, setError] = useState<string | null>(null);

  const title = videoTitle || video?.title || 'Vídeo sem título';
  const url = videoUrl || video?.url || '';

  // Carregar links de download se ainda não estiverem disponíveis
  const fetchDownloadLinks = async () => {
    if (downloadLinks) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const vimeoId = extractVimeoId(url);
      
      if (!vimeoId) {
        throw new Error('URL do vídeo inválida ou não é do Vimeo');
      }
      
      const { success, data, error } = await getVimeoDownloadLinks(vimeoId);
      
      if (!success || !data) {
        throw new Error(error || 'Não foi possível obter os links de download');
      }
      
      setDownloadLinks(data.file_urls);
      
      // Selecione automaticamente a melhor qualidade disponível
      if (data.file_urls?.hd) {
        setSelectedQuality('hd');
      } else if (data.file_urls?.sd) {
        setSelectedQuality('sd');
      } else if (data.file_urls?.original) {
        setSelectedQuality('original');
      } else if (data.file_urls?.web_optimized) {
        setSelectedQuality('web_optimized');
      }
      
    } catch (err) {
      console.error('Erro ao buscar links de download:', err);
      setError(err.message || 'Erro ao buscar links de download');
      toast({
        variant: "destructive",
        title: "Erro ao obter download",
        description: err.message || 'Não foi possível obter os links de download'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Quando o diálogo é aberto, carregue os links se necessário
  React.useEffect(() => {
    if (open && !downloadLinks && !isLoading) {
      fetchDownloadLinks();
    }
  }, [open, downloadLinks, isLoading]);

  const getDownloadUrl = () => {
    if (!downloadLinks) return '';
    return downloadLinks[selectedQuality] || '';
  };

  const handleDownload = () => {
    const url = getDownloadUrl();
    if (!url) {
      toast({
        variant: "destructive",
        title: "Qualidade indisponível",
        description: "Este vídeo não está disponível na qualidade selecionada"
      });
      return;
    }
    
    // Registrar download (pode ser implementado posteriormente)
    // logVideoDownload(videoId, selectedQuality);
    
    // Abrir URL de download em nova aba
    window.open(url, '_blank');
    
    // Fechar o diálogo após iniciar o download
    onOpenChange(false);
  };

  const getQualityLabel = (quality: 'original' | 'hd' | 'sd' | 'web_optimized') => {
    switch (quality) {
      case 'original':
        return 'Original (Máxima qualidade)';
      case 'hd':
        return 'HD (720p ou 1080p)';
      case 'sd':
        return 'SD (480p)';
      case 'web_optimized':
        return 'Web (Otimizado para internet)';
    }
  };

  const isQualityAvailable = (quality: 'original' | 'hd' | 'sd' | 'web_optimized') => {
    return downloadLinks && !!downloadLinks[quality];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download do Vídeo</DialogTitle>
          <DialogDescription>
            Selecione a qualidade desejada para baixar "{title}"
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Buscando opções de download...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mb-4" />
            <p className="text-destructive font-medium mb-2">Não foi possível obter os links</p>
            <p className="text-muted-foreground text-sm">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </Button>
          </div>
        ) : downloadLinks ? (
          <>
            <RadioGroup
              value={selectedQuality}
              onValueChange={(value) => setSelectedQuality(value as any)}
              className="space-y-3"
            >
              {(['original', 'hd', 'sd', 'web_optimized'] as const).map((quality) => (
                <div 
                  key={quality}
                  className={`flex items-center space-x-2 rounded-md border p-3 
                    ${!isQualityAvailable(quality) ? 'opacity-50' : ''}`}
                >
                  <RadioGroupItem 
                    value={quality} 
                    id={quality}
                    disabled={!isQualityAvailable(quality)}
                  />
                  <Label 
                    htmlFor={quality}
                    className={`flex-grow ${!isQualityAvailable(quality) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {getQualityLabel(quality)}
                  </Label>
                  {isQualityAvailable(quality) && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
              ))}
            </RadioGroup>
            
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleDownload} disabled={!getDownloadUrl()}>
                <Download className="mr-2 h-4 w-4" /> Baixar
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-amber-500 mb-4" />
            <p className="font-medium mb-2">Sem opções de download</p>
            <p className="text-muted-foreground text-sm">Este vídeo não tem opções de download disponíveis</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoDownloadDialog;
