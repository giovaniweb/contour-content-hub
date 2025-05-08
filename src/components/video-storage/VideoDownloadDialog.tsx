
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { generateDownloadUrl } from '@/services/videoStorageService';
import { StoredVideo, VideoQuality } from '@/types/video-storage';
import { Download, FileVideo, AlertTriangle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [quality, setQuality] = useState<VideoQuality>('original');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { toast } = useToast();

  // Determinar quais qualidades estão disponíveis
  const availableQualities: VideoQuality[] = [];
  
  if (video.file_urls?.original) availableQualities.push('original');
  if (video.file_urls?.hd) availableQualities.push('hd');
  if (video.file_urls?.sd) availableQualities.push('sd');
  
  // Se não houver qualidades disponíveis, usar a primeira URL disponível
  const hasNoQualityOptions = availableQualities.length === 0;
  
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Se não houver qualidades disponíveis, mas tiver alguma URL
      if (hasNoQualityOptions) {
        const url = video.file_urls?.original || video.file_urls?.hd || video.file_urls?.sd;
        if (!url) {
          throw new Error('Nenhuma URL de download disponível');
        }
        
        // Criar um link temporário para download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${video.title}.mp4`; 
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setDownloadSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
          setDownloadSuccess(false);
        }, 1500);
        
        return;
      }
      
      // Gerar URL de download usando o serviço
      const result = await generateDownloadUrl(video.id, quality);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (!result.url) {
        throw new Error('URL de download não gerada');
      }
      
      // Criar um link e clicar nele para iniciar o download
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.filename || `${video.title}_${quality}.mp4`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadSuccess(true);
      
      // Fechar o diálogo após um breve delay
      setTimeout(() => {
        onOpenChange(false);
        setDownloadSuccess(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error generating download URL:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer download",
        description: error instanceof Error ? error.message : "Não foi possível fazer o download do vídeo"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Lidar com download direto das URLs
  const handleDirectDownload = (url: string) => {
    try {
      // Criar um link temporário para download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${video.title}.mp4`; 
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "O download do vídeo foi iniciado."
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error initiating direct download:', error);
      toast({
        variant: "destructive",
        title: "Erro ao iniciar download",
        description: "Não foi possível iniciar o download do vídeo."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download do vídeo</DialogTitle>
          <DialogDescription>
            Selecione a qualidade desejada para download do vídeo "{video.title}".
          </DialogDescription>
        </DialogHeader>
        
        {downloadSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="bg-green-100 rounded-full p-3 mb-2">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-center font-medium">Download iniciado com sucesso!</p>
          </div>
        ) : hasNoQualityOptions && !Object.values(video.file_urls || {}).some(Boolean) ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="bg-amber-100 rounded-full p-3 mb-2">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-center font-medium">Vídeo indisponível para download</p>
            <p className="text-center text-sm text-muted-foreground mt-1">
              Este vídeo ainda está sendo processado ou ocorreu um erro.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 py-2">
              <FileVideo className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-medium">{video.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {video.description ? (
                    <span className="line-clamp-1">{video.description}</span>
                  ) : (
                    <span>{(video.size / (1024 * 1024)).toFixed(1)} MB</span>
                  )}
                </p>
              </div>
            </div>
            
            {!hasNoQualityOptions && availableQualities.length > 0 ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Qualidade:</Label>
                  <Select
                    value={quality}
                    onValueChange={(value) => setQuality(value as VideoQuality)}
                    disabled={isDownloading}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione uma qualidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableQualities.includes('original') && (
                        <SelectItem value="original">Original</SelectItem>
                      )}
                      {availableQualities.includes('hd') && (
                        <SelectItem value="hd">Alta (HD)</SelectItem>
                      )}
                      {availableQualities.includes('sd') && (
                        <SelectItem value="sd">Padrão (SD)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              // Se não temos qualidades específicas mas temos URLs, mostrar links diretos
              <div className="grid gap-4 py-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Download direto disponível:
                  </p>
                  <div className="flex justify-center gap-2 mt-2">
                    {video.file_urls?.original && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDirectDownload(video.file_urls.original as string)}
                      >
                        Original
                      </Button>
                    )}
                    {video.file_urls?.hd && video.file_urls.hd !== video.file_urls?.original && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDirectDownload(video.file_urls.hd as string)}
                      >
                        HD
                      </Button>
                    )}
                    {video.file_urls?.sd && 
                     video.file_urls.sd !== video.file_urls?.original && 
                     video.file_urls.sd !== video.file_urls?.hd && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDirectDownload(video.file_urls.sd as string)}
                      >
                        SD
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={isDownloading}
              >
                Cancelar
              </Button>
              
              {!hasNoQualityOptions && (
                <Button 
                  type="submit" 
                  onClick={handleDownload}
                  disabled={isDownloading || availableQualities.length === 0}
                >
                  {isDownloading ? (
                    <>
                      <Download className="mr-2 h-4 w-4 animate-spin" />
                      Baixando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Baixar
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Label component - reusable UI component
const Label = ({ className, ...props }: React.HTMLAttributes<HTMLLabelElement>) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
);

export default VideoDownloadDialog;
