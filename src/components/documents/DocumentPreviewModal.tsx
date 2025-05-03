
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
  // Garantir que temos uma URL válida para o PDF
  const validPdfUrl = document.link_dropbox || document.preview_url;
  
  // Se não tivermos uma URL válida, ainda podemos exibir o modal,
  // o componente PdfViewer tratará o caso de erro
  
  return (
    <PdfViewer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={document.titulo}
      pdfUrl={validPdfUrl}
    />
  );
};

export default DocumentPreviewModal;
