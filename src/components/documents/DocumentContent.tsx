
import React, { useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface DocumentContentProps {
  document: TechnicalDocument;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // If the document is still processing or doesn't have extracted content
  if (document.status === 'processando' || !document.conteudo_extraido) {
    return (
      <div>
        {document.status === 'processando' ? (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin text-yellow-500" />
              <AlertDescription className="text-yellow-700">
                Este documento está sendo processado. O conteúdo estará disponível em breve.
              </AlertDescription>
            </div>
          </Alert>
        ) : (
          <Alert className="mb-4">
            <AlertDescription>
              Nenhum conteúdo extraído disponível para este documento.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/6" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }
  
  const content = document.conteudo_extraido;
  const shouldTruncate = content.length > 1000 && !isExpanded;
  const displayContent = shouldTruncate ? content.slice(0, 1000) + '...' : content;
  
  return (
    <div className="space-y-4">
      <div className="prose max-w-none dark:prose-invert">
        <div 
          className="whitespace-pre-line"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          {displayContent}
        </div>
      </div>
      
      {content.length > 1000 && (
        <div className="pt-2">
          <Button 
            variant="ghost" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentContent;
