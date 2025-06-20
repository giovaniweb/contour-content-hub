
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, RotateCw, ExternalLink, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { processPdfUrl, downloadPdf, isPdfUrlValid } from '@/utils/pdfUtils';

interface EnhancedPDFViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl?: string;
  title: string;
  documentId?: string;
}

const EnhancedPDFViewer: React.FC<EnhancedPDFViewerProps> = ({
  isOpen,
  onOpenChange,
  pdfUrl,
  title,
  documentId
}) => {
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && pdfUrl) {
      setIsLoading(true);
      setHasError(false);
      
      try {
        const { processedUrl: newUrl } = processPdfUrl(pdfUrl);
        if (newUrl && isPdfUrlValid(pdfUrl)) {
          setProcessedUrl(newUrl);
        } else {
          setHasError(true);
          toast.error("URL do PDF inválida", {
            description: "Não foi possível processar a URL do documento."
          });
        }
      } catch (error) {
        setHasError(true);
        console.error("Erro ao processar PDF:", error);
      }
    }
  }, [isOpen, pdfUrl]);

  const handleDownload = async () => {
    if (pdfUrl) {
      try {
        await downloadPdf(pdfUrl, `${title}.pdf`);
        toast.success("Download iniciado", {
          description: "O arquivo está sendo baixado"
        });
      } catch (error) {
        toast.error("Erro ao baixar o arquivo", {
          description: "Não foi possível baixar o PDF"
        });
      }
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoom(100);

  const handleExternalOpen = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 aurora-glass border-aurora-electric-purple/30 backdrop-blur-xl">
        <DialogHeader className="p-4 border-b border-aurora-electric-purple/20 aurora-glass">
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="aurora-heading text-lg truncate flex-1 mr-4">
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center gap-2 aurora-glass px-3 py-1 rounded-lg border border-aurora-electric-purple/20">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="h-8 w-8 text-aurora-electric-purple hover:bg-aurora-electric-purple/20"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-aurora-electric-purple w-12 text-center">
                  {zoom}%
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  className="h-8 w-8 text-aurora-electric-purple hover:bg-aurora-electric-purple/20"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleZoomReset}
                  disabled={zoom === 100}
                  className="h-8 w-8 text-aurora-neon-blue hover:bg-aurora-neon-blue/20"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Action Buttons */}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleExternalOpen}
                className="aurora-glass border-aurora-neon-blue/30 text-aurora-neon-blue hover:bg-aurora-neon-blue/20"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleDownload}
                className="aurora-glass border-aurora-emerald/30 text-aurora-emerald hover:bg-aurora-emerald/20"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="h-[80vh] overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center aurora-glass backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-aurora-electric-purple" />
                <p className="text-sm text-slate-300">Carregando PDF...</p>
              </div>
            </div>
          )}
          
          {hasError && (
            <div className="flex flex-col items-center justify-center h-full aurora-glass">
              <div className="bg-red-500/20 p-4 rounded-full mb-4">
                <X className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="font-medium text-slate-200 mb-2">Erro ao carregar PDF</h3>
              <p className="text-sm text-slate-400 mb-4 text-center">
                Não foi possível exibir o documento
              </p>
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/20"
              >
                Tentar Download
              </Button>
            </div>
          )}
          
          {!hasError && processedUrl && (
            <div 
              className="h-full w-full transition-transform duration-300 ease-in-out"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                display: isLoading ? 'none' : 'block'
              }}
            >
              <iframe
                src={processedUrl}
                className="w-full h-full border-0 rounded-b-lg"
                title={title}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </div>
          )}
        </div>
        
        {/* Mobile Zoom Controls */}
        <div className="sm:hidden flex items-center justify-center gap-2 p-3 border-t border-aurora-electric-purple/20 aurora-glass">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-aurora-electric-purple w-12 text-center">
            {zoom}%
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomReset}
            disabled={zoom === 100}
            className="aurora-glass border-aurora-neon-blue/30 text-aurora-neon-blue"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPDFViewer;
