
import React from 'react';
import { TechnicalDocument } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentContentProps {
  document: TechnicalDocument;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  return (
    <ScrollArea className="h-[calc(100vh-250px)] min-h-[500px] w-full rounded-md border p-4">
      <div className="whitespace-pre-wrap pb-8">
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
