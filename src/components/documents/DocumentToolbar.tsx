
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Loader2 } from 'lucide-react';

interface DocumentToolbarProps {
  onViewOriginal: () => void;
  onDownloadPdf: () => void;
  onExtractContent: () => void;
  extracting: boolean;
  hasContent: boolean;
}

const DocumentToolbar: React.FC<DocumentToolbarProps> = ({ 
  onViewOriginal, 
  onDownloadPdf, 
  onExtractContent, 
  extracting, 
  hasContent 
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        onClick={onViewOriginal}
        className="flex items-center gap-2"
      >
        <Eye className="h-4 w-4" />
        Ver PDF Original
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onDownloadPdf}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Baixar PDF
      </Button>
      
      <Button 
        variant="default" 
        onClick={onExtractContent}
        disabled={extracting}
        className="flex items-center gap-2"
      >
        {extracting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {hasContent ? "Reprocessando..." : "Processando..."}
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            {hasContent ? "Reprocessar Conteúdo" : "Extrair Conteúdo"}
          </>
        )}
      </Button>
    </div>
  );
};

export default DocumentToolbar;
