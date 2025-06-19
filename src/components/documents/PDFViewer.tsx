
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, X } from 'lucide-react';
import { TechnicalDocument } from '@/types/document';

interface PDFViewerProps {
  document: TechnicalDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ document, isOpen, onClose }) => {
  const handleDownload = () => {
    if (document?.arquivo_url || document?.link_dropbox) {
      const url = document.arquivo_url || document.link_dropbox;
      const link = document.createElement('a');
      link.href = url!;
      link.download = `${document.titulo}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenExternal = () => {
    if (document?.arquivo_url || document?.link_dropbox) {
      const url = document.arquivo_url || document.link_dropbox;
      window.open(url, '_blank');
    }
  };

  if (!document) return null;

  const pdfUrl = document.arquivo_url || document.link_dropbox;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {document.titulo}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {document.descricao}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenExternal}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full border-0"
              title={`PDF: ${document.titulo}`}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 mb-4">PDF não disponível para visualização</p>
                <Button onClick={handleDownload} disabled={!pdfUrl}>
                  <Download className="h-4 w-4 mr-2" />
                  Tentar Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
