
import React, { useEffect, useState } from 'react';
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
  const [validPdfUrl, setValidPdfUrl] = useState<string | undefined>(undefined);
  
  // Process the PDF URL when the document or modal state changes
  useEffect(() => {
    if (document && isOpen) {
      // Use link_dropbox as the primary source, and preview_url as fallback
      const url = document.link_dropbox || document.preview_url || '';
      
      console.log("Document PDF URL source:", {
        link_dropbox: document.link_dropbox,
        preview_url: document.preview_url,
        selectedUrl: url,
        documentId: document.id,
        titulo: document.titulo
      });
      
      if (!url) {
        console.error("No PDF URL available for document:", document.id);
      }
      
      setValidPdfUrl(url);
    } else {
      // Reset URL when modal is closed
      setValidPdfUrl(undefined);
    }
  }, [document, isOpen]);
  
  return (
    <PdfViewer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={document?.titulo || 'Documento'}
      pdfUrl={validPdfUrl}
      documentId={document?.id}
    />
  );
};

export default DocumentPreviewModal;
