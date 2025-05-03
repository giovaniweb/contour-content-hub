
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileWarning } from 'lucide-react';
import { toast } from 'sonner';

interface PdfViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  pdfUrl: string | undefined;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ isOpen, onOpenChange, title, pdfUrl }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string>('');
  
  // Function to ensure the PDF URL is correctly formatted
  useEffect(() => {
    if (!pdfUrl) {
      setError("URL do documento não encontrada");
      setLoading(false);
      return;
    }
    
    try {
      console.log("Trying to format PDF URL:", pdfUrl);
      
      // For local blob URLs
      if (pdfUrl.startsWith('blob:')) {
        setFinalUrl(pdfUrl);
      }
      // For external URLs, ensure they start with http or https
      else if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://')) {
        setFinalUrl(`https://${pdfUrl}`);
      } else {
        setFinalUrl(pdfUrl);
      }
      
      console.log("URL formatada para PDF:", finalUrl || pdfUrl);
      setError(null);
    } catch (err) {
      console.error("Erro ao processar URL do PDF:", err);
      setError("Erro ao processar URL do documento");
    } finally {
      setLoading(false);
    }
  }, [pdfUrl, isOpen]);

  const handleIframeError = () => {
    console.error("Erro ao carregar o PDF:", finalUrl);
    setError("Não foi possível carregar o documento. Verifique se a URL está correta.");
    toast.error("Erro ao carregar o PDF", {
      description: "Não foi possível carregar o documento."
    });
  };

  const handleIframeLoad = () => {
    console.log("PDF iframe loaded successfully:", finalUrl);
    setLoading(false);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Visualização do documento original</DialogDescription>
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
              <p className="text-sm text-muted-foreground">URL: {pdfUrl || "Indisponível"}</p>
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
