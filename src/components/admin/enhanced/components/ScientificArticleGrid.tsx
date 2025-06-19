
import React from 'react';
import { FileText } from 'lucide-react';
import { TechnicalDocument } from '@/types/document';
import { EmptyState } from '@/components/ui/empty-state';
import DocumentCard from '@/components/documents/DocumentCard';

interface ScientificArticleGridProps {
  documents: TechnicalDocument[];
  loading: boolean;
  searchTerm: string;
  onView: (document: TechnicalDocument) => void;
  onQuestion: (document: TechnicalDocument) => void;
  onDownload: (document: TechnicalDocument) => void;
  onUpload: () => void;
}

const ScientificArticleGrid: React.FC<ScientificArticleGridProps> = ({
  documents,
  loading,
  searchTerm,
  onView,
  onQuestion,
  onDownload,
  onUpload
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-slate-300">Carregando documentos...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
        <EmptyState
          icon={FileText}
          title="Nenhum documento encontrado"
          description={searchTerm ? `Não encontramos documentos para "${searchTerm}"` : "Comece adicionando seus primeiros documentos científicos"}
          actionLabel="Adicionar Documento"
          onAction={onUpload}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onView={onView}
            onQuestion={onQuestion}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
};

export default ScientificArticleGrid;
