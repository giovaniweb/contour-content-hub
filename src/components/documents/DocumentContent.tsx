
import React from 'react';
import { TechnicalDocument } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DocumentContentProps {
  document: TechnicalDocument;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  return (
    <ScrollArea className="h-[calc(100vh-250px)] min-h-[500px] w-full rounded-md border p-6">
      {document.conteudo_extraido ? (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>
            {document.conteudo_extraido}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-muted-foreground text-center py-4">
            Este documento ainda não tem conteúdo extraído.
          </p>
          <p className="text-sm text-muted-foreground">
            Clique em "Extrair Conteúdo" no topo da página para processar o documento.
          </p>
        </div>
      )}
    </ScrollArea>
  );
};

export default DocumentContent;
