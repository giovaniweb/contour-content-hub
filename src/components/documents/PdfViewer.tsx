
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileWarning, ExternalLink, RefreshCw, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { processPdfUrl, openPdfInNewTab } from '@/utils/pdfUtils';

interface PdfViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  pdfUrl: string | undefined;
  documentId?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ isOpen, onOpenChange, title, pdfUrl, documentId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string>('');
  const [zoom, setZoom] = useState(1);

  // Effect to process the PDF URL when the modal is opened
  useEffect(() => {
    // If the modal is closed, do nothing
    if (!isOpen) {
      return;
    }
    
    // Reset states at the beginning
    setLoading(true);
    setError(null);
    setFinalUrl('');
    setZoom(1);
    
    // Check if we have a URL
    if (!pdfUrl) {
      setLoading(false);
      setError("URL do documento não encontrada");
      return;
    }

    console.log(`Preparing PDF view (${documentId || 'unknown'}):`, pdfUrl);
      
    try {
      // Process URL using our utility
      const { processedUrl } = processPdfUrl(pdfUrl);
      
      if (processedUrl) {
        console.log("Processed URL:", processedUrl);
        setFinalUrl(processedUrl);
      } else {
        setError("URL do documento inválida");
      }
    } catch (err: any) {
      console.error("Error processing PDF URL:", err);
      setError(`Erro ao processar URL do documento: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  }, [pdfUrl, isOpen, documentId]);

  // Function to open PDF in a new tab
  const openInNewTab = () => {
    try {
      if (finalUrl) {
        openPdfInNewTab(finalUrl, title);
        toast("Abrindo documento", {
          description: "O documento está sendo aberto em uma nova aba."
        });
      } else if (pdfUrl) {
        openPdfInNewTab(pdfUrl, title);
        toast("Abrindo documento original", {
          description: "Abrindo a URL original em uma nova aba."
        });
      } else {
        toast.error("URL do documento não encontrada");
      }
    } catch (error: any) {
      console.error("Error opening document:", error);
      toast.error(error.message || "Não foi possível abrir o documento");
    }
  };
  
  // Function to retry loading the PDF
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setFinalUrl('');
    
    setTimeout(() => {
      toast("Tentando novamente", {
        description: "Recarregando o documento..."
      });
    }, 100);
  };

  // Zoom functions
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            <span>Visualização do documento original</span>
            <div className="flex gap-2">
              <div className="flex items-center border rounded-md px-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={zoomOut}
                  className="p-1 h-8"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs px-2">{Math.round(zoom * 100)}%</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={zoomIn}
                  className="p-1 h-8"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetZoom}
                className="flex items-center gap-1"
              >
                <RotateCw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Recarregar</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openInNewTab}
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Abrir em nova aba</span>
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="w-full h-[80vh] bg-gray-100 overflow-auto">
          {loading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-3 text-muted-foreground">Carregando documento...</span>
            </div>
          )}
          
          {error ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <FileWarning className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Documento não disponível</h3>
              <p className="text-muted-foreground mb-4">
                {error || "Talvez ele tenha sido movido, editado ou excluído."}
              </p>
              <p className="text-sm text-muted-foreground mb-4 max-w-lg break-all">
                URL: {pdfUrl ? pdfUrl : "Indisponível"}
              </p>
              
              <div className="flex gap-2">
                <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Tentar novamente</span>
                </Button>
                
                <Button onClick={openInNewTab} className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Abrir em nova aba</span>
                </Button>
              </div>
            </div>
          ) : (
            !loading && finalUrl && (
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s' }} className="min-h-full">
                <iframe
                  src={finalUrl}
                  className="w-full h-full min-h-[80vh] border-0"
                  title={title}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
                  onLoad={() => console.log("PDF loaded successfully")}
                  onError={(e) => {
                    console.error("Error loading PDF", e);
                    setError("Não foi possível carregar o documento.");
                  }}
                />
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewer;
