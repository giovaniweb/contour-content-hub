
import React from 'react';
import { TechnicalDocument } from '@/types/document';
import PdfViewer from './PdfViewer';

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
    <PdfViewer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={document.titulo}
      pdfUrl={document.link_dropbox}
    />
  );
};

export default DocumentPreviewModal;
