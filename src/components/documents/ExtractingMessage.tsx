
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';

interface ExtractingMessageProps {
  onExtractContent: () => void;
  extracting: boolean;
  progress: string | null;
}

const ExtractingMessage: React.FC<ExtractingMessageProps> = ({ 
  onExtractContent, 
  extracting,
  progress 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center max-w-md">
        <h3 className="text-lg font-medium mb-4">Sem conteúdo extraído</h3>
        <p className="text-muted-foreground mb-6">
          Este documento ainda não tem conteúdo extraído. 
          Clique no botão abaixo para processar o conteúdo.
        </p>
        <Button 
          variant="default" 
          onClick={onExtractContent}
          disabled={extracting}
        >
          {extracting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {progress || "Processando..."}
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Extrair Conteúdo
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExtractingMessage;
