
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, RotateCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { downloadPdf, isPdfUrlValid } from '@/utils/pdfUtils';

interface PDFViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string;
  title?: string;
  filename?: string;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  open,
  onOpenChange,
  pdfUrl,
  title = "Visualizar PDF",
  filename = "documento.pdf"
}) => {
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Validar a URL do PDF quando o componente montar
  useEffect(() => {
    if (open && pdfUrl) {
      const validateUrl = async () => {
        try {
          setIsLoading(true);
          setHasError(false);
          const isValid = isPdfUrlValid(pdfUrl);
          if (!isValid) {
            setHasError(true);
            toast.error("Não foi possível carregar o PDF", {
              description: "O arquivo pode não existir ou não é um PDF válido."
            });
          }
        } catch (error) {
          setHasError(true);
          console.error("Erro ao validar PDF:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      validateUrl();
    }
  }, [open, pdfUrl]);
  
  const handleDownload = async () => {
    try {
      await downloadPdf(pdfUrl, filename);
      toast.success("Download iniciado", {
        description: "O arquivo está sendo baixado"
      });
    } catch (error) {
      toast.error("Erro ao baixar o arquivo", {
        description: "Não foi possível baixar o PDF"
      });
    }
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };
  
  const handleZoomReset = () => {
    setZoom(100);
  };
  
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 border-b sticky top-0 z-10 bg-background">
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="truncate flex-1 mr-2">{title}</DialogTitle>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomReset}
                  disabled={zoom === 100}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="h-[70vh] overflow-auto bg-muted/30">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Carregando PDF...</p>
              </div>
            </div>
          )}
          
          {hasError && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-destructive/10 p-3 rounded-full mb-2">
                <X className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="font-medium">Erro ao carregar PDF</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Não foi possível exibir o documento
              </p>
              <Button variant="outline" className="mt-4" onClick={handleDownload}>
                Tentar baixar mesmo assim
              </Button>
            </div>
          )}
          
          {!hasError && (
            <div 
              style={{ 
                height: '100%', 
                display: isLoading ? 'none' : 'block',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease'
              }}
            >
              <iframe
                src={`${pdfUrl}#toolbar=0`}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  border: 'none'
                }}
                title={title}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              ></iframe>
            </div>
          )}
        </div>
        
        <div className="sm:hidden flex items-center justify-center gap-2 p-2 border-t">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomReset}
            disabled={zoom === 100}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewerModal;
