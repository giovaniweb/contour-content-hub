
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UnifiedDocument } from '@/types/document';
import { 
  FileText, 
  Eye, 
  MessageSquare, 
  Download, 
  Calendar, 
  User,
  Tag,
  Upload,
  Loader2 
} from 'lucide-react';

interface ScientificArticleGridProps {
  documents: UnifiedDocument[];
  loading: boolean;
  searchTerm: string;
  onView: (document: UnifiedDocument) => void;
  onQuestion: (document: UnifiedDocument) => void;
  onDownload: (document: UnifiedDocument) => void;
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluido':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Processado</Badge>;
      case 'processando':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Processando</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendente</Badge>;
      case 'falhou':
        return <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">Falhou</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando documentos...</span>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="aurora-glass-enhanced border-cyan-500/30 text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 aurora-glow rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <FileText className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'Nenhum documento encontrado' : 'Nenhum documento ainda'}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm 
                  ? `Não encontramos documentos que correspondam a "${searchTerm}"`
                  : 'Comece fazendo upload do seu primeiro documento científico'
                }
              </p>
              <Button
                onClick={onUpload}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Fazer Upload de Documento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((document) => (
        <Card key={document.id} className="aurora-glass border-slate-600/50 hover:border-cyan-500/50 transition-all duration-200 group">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 aurora-glow rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-cyan-400" />
                </div>
                {getStatusBadge(document.status_processamento)}
              </div>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
              {document.titulo_extraido || 'Título não disponível'}
            </h3>

            {/* Description */}
            <p className="text-slate-400 text-sm mb-4 line-clamp-3">
              {document.texto_completo?.substring(0, 150) || 'Descrição não disponível'}
              {document.texto_completo && document.texto_completo.length > 150 && '...'}
            </p>

            {/* Keywords */}
            {document.palavras_chave && document.palavras_chave.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {document.palavras_chave.slice(0, 3).map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30 text-xs"
                  >
                    {keyword}
                  </Badge>
                ))}
                {document.palavras_chave.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{document.palavras_chave.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Authors */}
            {document.autores && document.autores.length > 0 && (
              <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                <User className="h-4 w-4" />
                <span className="truncate">
                  {document.autores.length === 1 
                    ? document.autores[0] 
                    : `${document.autores[0]} +${document.autores.length - 1}`
                  }
                </span>
              </div>
            )}

            {/* Equipment */}
            {document.equipamento_nome && (
              <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                <Tag className="h-4 w-4" />
                <span className="truncate">{document.equipamento_nome}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2 mb-6 text-sm text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(document.data_upload)}</span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(document)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuestion(document)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(document)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                disabled={!document.file_path}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScientificArticleGrid;
