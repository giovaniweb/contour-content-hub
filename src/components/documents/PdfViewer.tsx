
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileWarning, ExternalLink, RefreshCw } from 'lucide-react';
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

  useEffect(() => {
    if (!isOpen || !pdfUrl) {
      setLoading(false);
      if (!pdfUrl) {
        setError("URL do documento não encontrada");
      }
      return;
    }

    try {
      console.log(`Preparando visualização do PDF (${documentId || 'unknown'}):`, pdfUrl);
      setLoading(true);
      setError(null);
      
      let processedUrl = pdfUrl.trim();
      
      // Para URLs blob, usamos diretamente
      if (processedUrl.startsWith('blob:')) {
        console.log("Usando URL blob diretamente:", processedUrl);
        setFinalUrl(processedUrl);
        setLoading(false);
      }
      // Para URLs do Dropbox
      else if (processedUrl.includes('dropbox.com')) {
        if (!processedUrl.includes('dl=1')) {
          processedUrl = processedUrl.includes('?') 
            ? `${processedUrl}&dl=1` 
            : `${processedUrl}?dl=1`;
        }
        console.log("URL Dropbox processada:", processedUrl);
        setFinalUrl(processedUrl);
        setLoading(false);
      }
      // Para URLs do Google Drive
      else if (processedUrl.includes('drive.google.com')) {
        if (processedUrl.includes('/view')) {
          processedUrl = processedUrl.replace('/view', '/preview');
        }
        console.log("URL Google Drive processada:", processedUrl);
        setFinalUrl(processedUrl);
        setLoading(false);
      }
      // Para outras URLs
      else {
        // Garantir que a URL começa com http ou https
        if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
          processedUrl = `https://${processedUrl}`;
        }
        console.log("URL genérica processada:", processedUrl);
        setFinalUrl(processedUrl);
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Erro ao processar URL do PDF:", err);
      setError(`Erro ao processar URL do documento: ${err.message || 'Erro desconhecido'}`);
      setLoading(false);
    }
  }, [pdfUrl, isOpen, documentId]);

  const openInNewTab = () => {
    if (finalUrl) {
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
      toast("Abrindo documento", {
        description: "O documento está sendo aberto em uma nova aba."
      });
    } else if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      toast("Abrindo documento original", {
        description: "Abrindo a URL original em uma nova aba."
      });
    }
  };
  
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Forçar a reavaliação do useEffect
    setFinalUrl('');
    setTimeout(() => {
      // Pequeno atraso para garantir que o estado seja atualizado
      toast("Tentando novamente", {
        description: "Recarregando o documento..."
      });
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            <span>Visualização do documento original</span>
            <div className="flex gap-2">
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
              <iframe
                src={finalUrl}
                className="w-full h-full border-0"
                title={title}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
                onLoad={() => console.log("PDF carregado com sucesso")}
                onError={() => {
                  console.error("Erro ao carregar o PDF");
                  setError("Não foi possível carregar o documento.");
                }}
              />
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewer;
