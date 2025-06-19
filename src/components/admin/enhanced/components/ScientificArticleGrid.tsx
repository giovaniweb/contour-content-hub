
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { TechnicalDocument } from '@/types/document';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import DocumentCard from '@/components/documents/DocumentCard';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
          onAction={() => navigate('/admin/scientific-articles/new')}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-100">
          Documentos ({documents.length})
        </h2>
        <Button
          onClick={() => navigate('/admin/scientific-articles/new')}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Documento
        </Button>
      </div>
      
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
