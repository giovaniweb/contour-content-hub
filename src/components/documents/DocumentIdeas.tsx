
import React from 'react';
import { TechnicalDocument } from '@/types/document';

interface DocumentIdeasProps {
  document: TechnicalDocument;
  className?: string;  // Add this to accept className prop
}

const DocumentIdeas: React.FC<DocumentIdeasProps> = ({ document, className }) => {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Ideias geradas para este documento</h3>
      <p className="text-muted-foreground">
        As ideias para este documento ainda estão sendo geradas. 
        Volte mais tarde para ver sugestões de conteúdo baseado neste documento.
      </p>
    </div>
  );
};

export default DocumentIdeas;
