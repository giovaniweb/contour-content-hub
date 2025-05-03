
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TechnicalDocument } from '@/types/document';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: TechnicalDocument;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  document 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4">
          <DialogTitle>{document.titulo}</DialogTitle>
          <DialogDescription>Visualização do documento original</DialogDescription>
        </DialogHeader>
        {document?.link_dropbox && (
          <iframe 
            src={document.link_dropbox.startsWith('http') ? document.link_dropbox : `https://${document.link_dropbox}`} 
            title={document.titulo}
            className="w-full h-[80vh]"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
