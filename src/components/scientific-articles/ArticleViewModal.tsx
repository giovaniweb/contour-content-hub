
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  MessageSquare, 
  Calendar, 
  User, 
  Tag, 
  ExternalLink,
  Eye,
  Bot,
  ArrowLeft
} from 'lucide-react';
import { UnifiedDocument } from '@/types/document';
import { supabase } from '@/integrations/supabase/client';
import ArticleChatInterface from './ArticleChatInterface';

interface ArticleViewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: UnifiedDocument;
}

const ArticleViewModal: React.FC<ArticleViewModalProps> = ({
  isOpen,
  onOpenChange,
  document
}) => {
  const [viewMode, setViewMode] = useState<'overview' | 'chat'>('overview');

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPdfUrl = () => {
    if (!document.file_path) return null;
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(document.file_path);
    return data.publicUrl;
  };

  const handleViewPdf = () => {
    const pdfUrl = getPdfUrl();
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const getStatusBadge = () => {
    switch (document.status_processamento) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 aurora-glass-enhanced border-cyan-500/30 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white mb-2 pr-4">
                {document.titulo_extraido || 'Documento sem título'}
              </DialogTitle>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="capitalize">{document.tipo_documento.replace('_', ' ')}</span>
                <span>•</span>
                {getStatusBadge()}
                <span>•</span>
                <span>{formatDate(document.data_upload)}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {viewMode === 'overview' ? (
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="aurora-glass border-cyan-500/30 hover:border-cyan-400/50 transition-colors cursor-pointer group" onClick={handleViewPdf}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 aurora-glow rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Eye className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Visualizar PDF</h3>
                    <p className="text-sm text-slate-400">Abrir documento completo</p>
                  </CardContent>
                </Card>

                <Card className="aurora-glass border-purple-500/30 hover:border-purple-400/50 transition-colors cursor-pointer group" onClick={() => setViewMode('chat')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 aurora-glow rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Bot className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Fazer Perguntas</h3>
                    <p className="text-sm text-slate-400">Chat inteligente sobre o documento</p>
                  </CardContent>
                </Card>
              </div>

              {/* Document Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description/Content */}
                  {document.texto_completo && (
                    <Card className="aurora-glass border-slate-600/50">
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-cyan-400" />
                          Conteúdo Extraído
                        </h4>
                        <div className="text-slate-300 text-sm leading-relaxed max-h-60 overflow-y-auto">
                          {document.texto_completo.substring(0, 1000)}
                          {document.texto_completo.length > 1000 && '...'}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Keywords */}
                  {document.palavras_chave && document.palavras_chave.length > 0 && (
                    <Card className="aurora-glass border-slate-600/50">
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <Tag className="h-5 w-5 text-cyan-400" />
                          Palavras-chave
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {document.palavras_chave.map((keyword, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Authors */}
                  {document.autores && document.autores.length > 0 && (
                    <Card className="aurora-glass border-slate-600/50">
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <User className="h-5 w-5 text-cyan-400" />
                          Autores
                        </h4>
                        <div className="space-y-2">
                          {document.autores.map((author, index) => (
                            <div key={index} className="text-slate-300 text-sm">
                              {author}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Equipment */}
                  {document.equipamento_nome && (
                    <Card className="aurora-glass border-slate-600/50">
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-white mb-3">Equipamento</h4>
                        <p className="text-slate-300 text-sm">{document.equipamento_nome}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Processing Info */}
                  <Card className="aurora-glass border-slate-600/50">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-cyan-400" />
                        Informações
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tipo:</span>
                          <span className="text-slate-300 capitalize">
                            {document.tipo_documento.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Upload:</span>
                          <span className="text-slate-300">
                            {formatDate(document.data_upload)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          {getStatusBadge()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-600 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('overview')}
                  className="text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Chat com o Documento</h3>
                  <p className="text-sm text-slate-400">{document.titulo_extraido}</p>
                </div>
              </div>
              
              {/* Chat Interface */}
              <div className="flex-1 overflow-hidden">
                <ArticleChatInterface document={document} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleViewModal;
