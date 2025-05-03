
import React from 'react';
import { TechnicalDocument } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentContentProps {
  document: TechnicalDocument;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  return (
    <ScrollArea className="h-[500px] rounded-md border p-4">
      <div className="whitespace-pre-wrap">
        {document.conteudo_extraido || (
          <p className="text-muted-foreground text-center py-8">
            Este documento ainda não tem conteúdo extraído.
          </p>
        )}
      </div>
    </ScrollArea>
  );
};

export default DocumentContent;
