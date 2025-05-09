
import React from 'react';
import { cn } from '@/lib/utils';
import { TechnicalDocument } from '@/types/document';

// Adicionando a propriedade document na tipagem do componente
interface DocumentContentProps {
  content?: string;
  className?: string;
  document?: TechnicalDocument;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ content, className, document }) => {
  // Se um documento foi passado, obter o conteúdo dele
  const contentToDisplay = document?.conteudo_extraido || content;
  
  if (!contentToDisplay) {
    return (
      <div className={cn("h-full flex items-center justify-center text-muted-foreground", className)}>
        <p>Nenhum conteúdo disponível</p>
      </div>
    );
  }

  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      <div dangerouslySetInnerHTML={{ __html: contentToDisplay }} />
    </div>
  );
};

export default DocumentContent;
