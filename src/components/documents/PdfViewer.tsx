
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface PdfViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  pdfUrl: string | undefined;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ isOpen, onOpenChange, title, pdfUrl }) => {
  // Função para garantir que a URL do PDF esteja formatada corretamente
  const getPdfUrl = (url: string | undefined): string => {
    if (!url) return '';
    
    // Para URLs de blob local
    if (url.startsWith('blob:')) {
      return url;
    }
    
    // Para URLs externas, garantir que comecem com http ou https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    
    return url;
  };

  const formattedUrl = getPdfUrl(pdfUrl);
  console.log("URL formatada para PDF:", formattedUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Visualização do documento original</DialogDescription>
        </DialogHeader>
        {pdfUrl && (
          <div className="w-full h-[80vh]">
            <iframe
              src={formattedUrl}
              className="w-full h-full"
              title={title}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewer;
