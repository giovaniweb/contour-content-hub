
import React, { useEffect, useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import PDFViewer from './PDFViewer';
import { toast } from 'sonner';
import { isPdfUrlValid } from '@/utils/pdfUtils';

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
  
  // Limpa o estado quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      setValidPdfUrl(undefined);
    }
  }, [isOpen]);
  
  // Processa a URL do PDF quando o documento ou o estado do modal muda
  useEffect(() => {
    if (!document || !isOpen) {
      return;
    }
    
    try {
      console.log("Verificando URLs disponíveis para o documento:", document.id);
      
      // Verificar se temos alguma URL válida
      if (document.link_dropbox && isPdfUrlValid(document.link_dropbox)) {
        console.log("Usando link_dropbox:", document.link_dropbox);
        setValidPdfUrl(document.link_dropbox);
      } else if (document.preview_url && isPdfUrlValid(document.preview_url)) {
        console.log("Usando preview_url:", document.preview_url);
        setValidPdfUrl(document.preview_url);
      } else {
        console.error("Nenhuma URL de PDF válida disponível para o documento:", document.id);
        toast.error("Nenhuma URL de PDF disponível para este documento");
        setValidPdfUrl(undefined);
        // Fechar o modal se não houver URL
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erro ao processar URL do PDF:", error);
      toast.error("Erro ao processar URL do PDF");
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
    <PDFViewer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={document?.titulo || 'Documento'}
      pdfUrl={validPdfUrl}
      documentId={document?.id}
    />
  );
};

export default DocumentPreviewModal;
