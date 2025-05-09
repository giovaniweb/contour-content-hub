
import React from 'react';

interface DocumentIdeasProps {
  className?: string;
}

const DocumentIdeas: React.FC<DocumentIdeasProps> = ({ className }) => {
  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4">Ideias Relacionadas</h3>
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Nenhuma ideia relacionada encontrada para este documento.
        </p>
      </div>
    </div>
  );
};

export default DocumentIdeas;
