
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, File, Loader2 } from "lucide-react";
import { openPdfInNewTab, downloadPdf } from "@/utils/pdfUtils";
import { modalVariants } from "@/lib/animations";

interface PDFViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  title: string;
  filename?: string;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  open,
  onOpenChange,
  pdfUrl,
  title,
  filename
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleDownload = async () => {
    if (!pdfUrl) return;
    
    try {
      await downloadPdf(pdfUrl, filename || `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError("Não foi possível fazer o download do documento. Por favor, tente novamente.");
    }
  };
  
  const handleOpenExternal = () => {
    if (!pdfUrl) return;
    
    try {
      openPdfInNewTab(pdfUrl, title);
    } catch (err) {
      console.error("Error opening PDF:", err);
      setError("Não foi possível abrir o documento. Por favor, tente novamente.");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col sm:max-h-[80vh]">
        <motion.div 
          className="flex flex-col h-full"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              {title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 mt-4 bg-muted rounded-md overflow-hidden">
            {pdfUrl ? (
              <div className="w-full h-full relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Carregando documento...</p>
                    </div>
                  </div>
                )}
                
                <iframe 
                  src={pdfUrl} 
                  title={title}
                  className="w-full h-full min-h-[500px]"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setError("Não foi possível carregar o documento PDF.");
                  }}
                />
                
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/95">
                    <div className="text-center max-w-xs">
                      <p className="text-destructive">{error}</p>
                      <Button 
                        variant="outline" 
                        className="mt-4" 
                        onClick={handleOpenExternal}
                      >
                        Tentar abrir em uma nova janela
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full min-h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">Nenhum documento disponível</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={handleOpenExternal}
                disabled={!pdfUrl || isLoading}
              >
                Abrir em nova aba
              </Button>
              <Button 
                onClick={handleDownload}
                disabled={!pdfUrl || isLoading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewerModal;
