
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
  
  // Processar a URL do PDF quando o documento ou o estado do modal muda
  useEffect(() => {
    if (!document || !isOpen) {
      setValidPdfUrl(undefined);
      return;
    }
    
    try {
      console.log("Verificando URLs disponíveis para o documento:", document.id);
      
      // Verificar se temos alguma URL válida
      if (document.link_dropbox && document.link_dropbox.trim() !== '') {
        console.log("Usando link_dropbox:", document.link_dropbox);
        setValidPdfUrl(document.link_dropbox);
      } else if (document.preview_url && document.preview_url.trim() !== '') {
        console.log("Usando preview_url:", document.preview_url);
        setValidPdfUrl(document.preview_url);
      } else {
        console.error("Nenhuma URL de PDF disponível para o documento:", document.id);
        toast("Nenhuma URL de PDF disponível para este documento");
        setValidPdfUrl(undefined);
        // Fechar o modal se não houver URL
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erro ao processar URL do PDF:", error);
      toast("Erro ao processar URL do PDF");
      setValidPdfUrl(undefined);
      // Fechar o modal em caso de erro
      onOpenChange(false);
    }
  }, [document, isOpen, onOpenChange]);
  
  // Se não houver documento ou o modal estiver fechado, não renderizar nada
  if (!document || !isOpen) {
    return null;
  }
  
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
