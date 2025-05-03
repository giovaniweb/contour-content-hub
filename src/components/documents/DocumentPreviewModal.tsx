
import React, { useEffect, useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import PdfViewer from './PdfViewer';
import { toast } from 'sonner';

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
    if (!document || !isOpen) {
      setValidPdfUrl(undefined);
      return;
    }
    
    try {
      // Use link_dropbox as the primary source, and preview_url as fallback
      let url = '';
      
      // Check for valid URL sources in priority order
      if (document.link_dropbox && document.link_dropbox.trim() !== '') {
        url = document.link_dropbox;
      } else if (document.preview_url && document.preview_url.trim() !== '') {
        url = document.preview_url;
      }
      
      console.log("Document PDF URL source details:", {
        link_dropbox: document.link_dropbox,
        preview_url: document.preview_url,
        selectedUrl: url,
        documentId: document.id,
        titulo: document.titulo,
        isBlob: url.startsWith('blob:')
      });
      
      if (!url) {
        console.error("No PDF URL available for document:", document.id);
        toast.error("Nenhum URL de PDF disponível para este documento");
        return;
      }
      
      // Set the URL - the PdfViewer component will handle formatting
      setValidPdfUrl(url);
    } catch (error) {
      console.error("Error processing PDF URL:", error);
      toast.error("Erro ao processar URL do PDF");
      setValidPdfUrl(undefined);
    }
  }, [document, isOpen]);
  
  // If there's no document or the modal is closed, don't render anything
  if (!document || !isOpen) {
    return null;
  }
  
  console.log("Rendering PdfViewer with URL:", validPdfUrl);
  
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
