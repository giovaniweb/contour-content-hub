
import React from 'react';
import { cn } from '@/lib/utils';

// Adicionando a propriedade className na tipagem do componente
interface DocumentContentProps {
  content?: string;
  className?: string;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ content, className }) => {
  if (!content) {
    return (
      <div className={cn("h-full flex items-center justify-center text-muted-foreground", className)}>
        <p>Nenhum conteúdo disponível</p>
      </div>
    );
  }

  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default DocumentContent;
