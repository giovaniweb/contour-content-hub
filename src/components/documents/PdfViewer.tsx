
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileWarning, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
  
  // Function to ensure the PDF URL is correctly formatted
  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal is closed
      setLoading(true);
      setError(null);
      setFinalUrl('');
      return;
    }
    
    if (!pdfUrl) {
      setError("URL do documento não encontrada");
      setLoading(false);
      return;
    }
    
    try {
      console.log(`Processing PDF URL for document ${documentId || 'unknown'}:`, pdfUrl);
      
      let processedUrl = pdfUrl.trim();
      
      // For blob URLs (direct file references)
      if (processedUrl.startsWith('blob:')) {
        console.log("Using blob URL directly:", processedUrl);
        setFinalUrl(processedUrl);
      }
      // For Dropbox URLs that need conversion to direct download links
      else if (processedUrl.includes('dropbox.com') && !processedUrl.includes('dl=1')) {
        // Convert sharing URL to direct download link if needed
        if (processedUrl.includes('?')) {
          processedUrl += '&dl=1';
        } else {
          processedUrl += '?dl=1';
        }
        console.log("Converted Dropbox URL:", processedUrl);
        setFinalUrl(processedUrl);
      }
      // For external URLs, ensure they start with http or https
      else if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
        console.log("Added https protocol:", processedUrl);
        setFinalUrl(processedUrl);
      } else {
        console.log("Using URL as-is:", processedUrl);
        setFinalUrl(processedUrl);
      }
      
      setError(null);
    } catch (err: any) {
      console.error("Erro ao processar URL do PDF:", err);
      setError(`Erro ao processar URL do documento: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  }, [pdfUrl, isOpen, documentId]);

  const handleIframeError = () => {
    console.error("Erro ao carregar o PDF:", finalUrl);
    setError("Não foi possível carregar o documento. Verifique se a URL está correta.");
    setLoading(false);
    toast.error("Erro ao carregar o PDF", {
      description: "Não foi possível carregar o documento."
    });
  };

  const handleIframeLoad = () => {
    console.log("PDF iframe loaded successfully:", finalUrl);
    setLoading(false);
    setError(null);
  };
  
  const openInNewTab = () => {
    if (finalUrl) {
      window.open(finalUrl, '_blank');
      toast("Abrindo documento", {
        description: "O documento está sendo aberto em uma nova aba."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            <span>Visualização do documento original</span>
            {finalUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openInNewTab}
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Abrir em nova aba</span>
              </Button>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="w-full h-[80vh] bg-gray-100">
          {loading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          
          {error ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <FileWarning className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Documento não disponível</h3>
              <p className="text-muted-foreground mb-4">
                {error || "Talvez ele tenha sido movido, editado ou excluído."}
              </p>
              <p className="text-sm text-muted-foreground mb-4">URL: {pdfUrl || "Indisponível"}</p>
              
              {finalUrl && (
                <Button onClick={openInNewTab} className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Tentar abrir em nova aba</span>
                </Button>
              )}
            </div>
          ) : (
            finalUrl && (
              <iframe
                src={finalUrl}
                className="w-full h-full"
                title={title}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
                onError={handleIframeError}
                onLoad={handleIframeLoad}
              />
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewer;
