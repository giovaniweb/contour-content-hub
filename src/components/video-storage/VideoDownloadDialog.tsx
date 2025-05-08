
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';
import { generateDownloadUrl } from '@/services/videoStorage/videoDownloadService';
import { useToast } from '@/hooks/use-toast';
import { StoredVideo, VideoQuality } from '@/types/video-storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VideoDownloadDialogProps {
  video: StoredVideo;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoDownloadDialog: React.FC<VideoDownloadDialogProps> = ({ 
  video, 
  isOpen, 
  onOpenChange 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<Record<VideoQuality, boolean>>({
    original: false,
    hd: false,
    sd: false
  });
  const [downloadSuccess, setDownloadSuccess] = React.useState<Record<VideoQuality, boolean>>({
    original: false,
    hd: false,
    sd: false
  });

  // Resetar estados quando o diálogo fechado
  React.useEffect(() => {
    if (!isOpen) {
      setIsLoading({
        original: false,
        hd: false,
        sd: false
      });
      setDownloadSuccess({
        original: false,
        hd: false,
        sd: false
      });
    }
  }, [isOpen]);

  // Função para iniciar o download
  const handleDownload = async (quality: VideoQuality) => {
    // Evitar múltiplos cliques
    if (isLoading[quality]) return;
    
    setIsLoading(prev => ({ ...prev, [quality]: true }));
    setDownloadSuccess(prev => ({ ...prev, [quality]: false }));
    
    try {
      const result = await generateDownloadUrl(video.id, quality);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.url) {
        // Iniciar download via link
        const link = document.createElement('a');
        link.href = result.url;
        link.download = result.filename || `${video.title}_${quality}.mp4`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Feedback de sucesso
        setDownloadSuccess(prev => ({ ...prev, [quality]: true }));
        toast({
          title: "Download iniciado",
          description: `O download do vídeo em qualidade ${quality} começou.`,
        });
      }
    } catch (error) {
      console.error('Error downloading video:', error);
      toast({
        variant: "destructive",
        title: "Erro ao baixar vídeo",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado ao gerar o link de download."
      });
    } finally {
      // Remover estado de loading após um pequeno delay para melhor feedback visual
      setTimeout(() => {
        setIsLoading(prev => ({ ...prev, [quality]: false }));
      }, 500);
    }
  };
  
  // Verificar quais qualidades estão disponíveis
  const hasOriginal = !!video.file_urls?.original;
  const hasHd = !!video.file_urls?.hd;
  const hasSd = !!video.file_urls?.sd;
  
  // Função para calcular o tamanho aproximado com base na qualidade
  const getApproxSize = (quality: VideoQuality): string => {
    if (!video.size) return "Tamanho desconhecido";
    
    const originalSize = video.size;
    
    // Estimativa aproximada baseada na qualidade
    switch (quality) {
      case 'original':
        return formatFileSize(originalSize);
      case 'hd':
        return formatFileSize(originalSize * 0.7); // ~70% do tamanho original
      case 'sd':
        return formatFileSize(originalSize * 0.4); // ~40% do tamanho original
      default:
        return "Tamanho desconhecido";
    }
  };
  
  // Função para formatar o tamanho do arquivo
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download do vídeo</DialogTitle>
          <DialogDescription>
            Escolha uma das opções de qualidade para baixar "{video.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Tabs defaultValue="quality" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="quality">Opções de download</TabsTrigger>
            </TabsList>
            <TabsContent value="quality" className="space-y-4 pt-4">
              {hasOriginal && (
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Qualidade Original</p>
                    <p className="text-sm text-muted-foreground">{getApproxSize('original')}</p>
                  </div>
                  <Button 
                    onClick={() => handleDownload('original')}
                    disabled={isLoading.original}
                    size="sm"
                    className="min-w-[100px]"
                  >
                    {isLoading.original ? (
                      <span className="flex items-center">Processando...</span>
                    ) : downloadSuccess.original ? (
                      <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Baixado</span>
                    ) : (
                      <span className="flex items-center"><Download className="h-4 w-4 mr-1" /> Baixar</span>
                    )}
                  </Button>
                </div>
              )}
              
              {hasHd && (
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Alta Qualidade (HD)</p>
                    <p className="text-sm text-muted-foreground">{getApproxSize('hd')}</p>
                  </div>
                  <Button 
                    onClick={() => handleDownload('hd')}
                    disabled={isLoading.hd}
                    size="sm"
                    className="min-w-[100px]"
                  >
                    {isLoading.hd ? (
                      <span className="flex items-center">Processando...</span>
                    ) : downloadSuccess.hd ? (
                      <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Baixado</span>
                    ) : (
                      <span className="flex items-center"><Download className="h-4 w-4 mr-1" /> Baixar</span>
                    )}
                  </Button>
                </div>
              )}
              
              {hasSd && (
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Qualidade Padrão (SD)</p>
                    <p className="text-sm text-muted-foreground">{getApproxSize('sd')}</p>
                  </div>
                  <Button 
                    onClick={() => handleDownload('sd')}
                    disabled={isLoading.sd}
                    size="sm"
                    className="min-w-[100px]"
                  >
                    {isLoading.sd ? (
                      <span className="flex items-center">Processando...</span>
                    ) : downloadSuccess.sd ? (
                      <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Baixado</span>
                    ) : (
                      <span className="flex items-center"><Download className="h-4 w-4 mr-1" /> Baixar</span>
                    )}
                  </Button>
                </div>
              )}
              
              {!hasOriginal && !hasHd && !hasSd && (
                <div className="p-4 text-center border border-amber-200 bg-amber-50 rounded-md flex flex-col items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <p className="text-amber-700">Este vídeo não tem arquivos disponíveis para download.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="text-xs text-center text-muted-foreground">
          Os downloads são registrados para fins de auditoria
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDownloadDialog;
