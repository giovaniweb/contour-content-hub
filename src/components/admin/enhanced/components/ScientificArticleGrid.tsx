
import React, { useState } from 'react';
import { FileText, Eye, Edit, Trash2, RefreshCw, Calendar, User, AlertTriangle, CheckCircle, UploadCloud, Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { UnifiedDocument } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ScientificArticleGridProps {
  documents: UnifiedDocument[];
  loading: boolean;
  searchTerm: string;
  onView: (document: UnifiedDocument) => void;
  onQuestion: (document: UnifiedDocument) => void;
  onDownload: (document: UnifiedDocument) => void;
  onUpload: () => void;
  onRefresh?: () => void;
}

const ScientificArticleGrid: React.FC<ScientificArticleGridProps> = ({
  documents,
  loading,
  searchTerm,
  onView,
  onQuestion,
  onDownload,
  onUpload,
  onRefresh
}) => {
  const [editingDocument, setEditingDocument] = useState<UnifiedDocument | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Data desconhecida';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const handleEdit = (document: UnifiedDocument) => {
    setEditingDocument(document);
    setIsEditDialogOpen(true);
  };

  const handleReprocess = async (documentId: string) => {
    toast({ title: "Reprocessando...", description: `Iniciando o reprocessamento do artigo ID: ${documentId}` });
    try {
      await supabase.from('unified_documents').update({ status_processamento: 'pendente', detalhes_erro: null }).eq('id', documentId);

      const { error: functionError } = await supabase.functions.invoke('process-document', {
        body: { documentId: documentId, forceRefresh: true },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }
      toast({ title: "Sucesso", description: "Reprocessamento iniciado. O artigo será atualizado em breve." });
      setTimeout(() => onRefresh?.(), 3000);
    } catch (err: any) {
      console.error("Reprocess Error:", err);
      toast({ variant: "destructive", title: "Falha ao Reprocessar", description: err.message });
      await supabase.from('unified_documents').update({ status_processamento: 'falhou', detalhes_erro: `Falha ao tentar reprocessar: ${err.message}` }).eq('id', documentId);
    }
  };

  const handleDelete = async (documentId: string, articleTitle: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o artigo "${articleTitle}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      toast({ title: "Excluindo...", description: "Removendo o artigo e seus arquivos..." });

      const { data: document } = await supabase
        .from('unified_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();

      if (document?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);
        
        if (storageError) {
          console.warn('Error deleting file from storage:', storageError);
        }
      }

      const { error: deleteError } = await supabase
        .from('unified_documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      toast({ 
        title: "Sucesso", 
        description: "Artigo excluído com sucesso." 
      });

      onRefresh?.();

    } catch (err: any) {
      console.error("Delete Error:", err);
      toast({ 
        variant: "destructive", 
        title: "Falha ao Excluir", 
        description: err.message || "Ocorreu um erro ao excluir o artigo."
      });
    }
  };

  if (loading) {
    return (
      <div className="aurora-glass-enhanced rounded-2xl p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Carregando artigos científicos...</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="aurora-glass-enhanced rounded-2xl p-8">
        <EmptyState
          icon={FileText}
          title={searchTerm ? "Nenhum resultado encontrado" : "Nenhum artigo científico"}
          description={searchTerm ? `Nenhum artigo encontrado para "${searchTerm}"` : "Comece fazendo upload do seu primeiro artigo científico"}
          actionLabel="Fazer Upload"
          onAction={onUpload}
        />
      </div>
    );
  }

  return (
    <>
      <div className="aurora-glass-enhanced rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <Card key={document.id} className="group relative hover:shadow-2xl transition-all duration-300 aurora-glass-enhanced border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm aurora-border-enhanced flex flex-col">
              <CardContent className="p-4 flex-1">
                <div className="relative aspect-[16/9] bg-slate-700/50 overflow-hidden rounded-md mb-3">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 via-slate-800 to-slate-700">
                    <FileText className="h-16 w-16 text-cyan-400 opacity-70" />
                  </div>
                  <div className="absolute top-2 right-2">
                    {document.status_processamento === 'falhou' && <Badge variant="destructive" className="bg-red-500 text-white"><AlertTriangle className="h-3 w-3 mr-1" /> Falhou</Badge>}
                    {document.status_processamento === 'concluido' && <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" /> Concluído</Badge>}
                    {document.status_processamento === 'processando' && <Badge variant="outline" className="text-blue-300 border-blue-400">Processando...</Badge>}
                    {document.status_processamento === 'pendente' && <Badge variant="outline" className="text-yellow-300 border-yellow-400">Pendente</Badge>}
                  </div>
                </div>

                <h3 className="font-semibold text-md mb-1.5 line-clamp-2 text-slate-100 group-hover:text-cyan-400 transition-colors">
                  {document.titulo_extraido || 'Título Pendente'}
                </h3>
                
                {document.descricao && (
                  <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                    {document.descricao}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  {document.data_upload && (
                    <div className="flex items-center" title={`Data de Upload: ${formatDate(document.data_upload)}`}>
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                      {formatDate(document.data_upload)}
                    </div>
                  )}
                  {document.autores && document.autores.length > 0 && (
                    <div className="flex items-center" title={document.autores.join(', ')}>
                      <User className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                      {document.autores.length === 1
                        ? document.autores[0].split(' ')[0]
                        : `${document.autores.length} autores`
                      }
                    </div>
                  )}
                </div>

                {document.palavras_chave && document.palavras_chave.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {document.palavras_chave.slice(0, 3).map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5">
                        {keyword}
                      </Badge>
                    ))}
                    {document.palavras_chave.length > 3 && (
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 px-1.5 py-0.5">
                        +{document.palavras_chave.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {document.equipamento_nome && (
                  <p className="text-xs text-slate-500 mt-1">Equip.: {document.equipamento_nome}</p>
                )}

                {document.status_processamento === 'falhou' && document.detalhes_erro && (
                  <p className="text-xs text-red-400 mt-2 line-clamp-2" title={document.detalhes_erro}>
                    <AlertTriangle className="inline h-3 w-3 mr-1" /> {document.detalhes_erro}
                  </p>
                )}
              </CardContent>

              <CardFooter className="p-3 aurora-glass-enhanced border-t border-slate-700/60">
                <div className="w-full flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(document)}
                    className="flex-1 border-cyan-500/70 text-cyan-400 hover:bg-cyan-500/10"
                    disabled={document.status_processamento !== 'concluido'}
                  >
                    <Eye className="h-4 w-4 mr-1.5" />
                    Ver
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(document)}
                    className="border-yellow-500/70 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {document.status_processamento === 'falhou' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReprocess(document.id)}
                      className="border-blue-500/70 text-blue-400 hover:bg-blue-500/10"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(document.id, document.titulo_extraido || 'Documento')}
                    className="border-red-500/70 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Dialog - Placeholder for now */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl aurora-glass-enhanced border-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="text-slate-100 aurora-text-gradient-enhanced">Editar Artigo Científico</DialogTitle>
            <DialogDescription className="text-slate-400">
              Edite as informações do artigo científico
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <p className="text-slate-300">Funcionalidade de edição em desenvolvimento...</p>
            {editingDocument && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-slate-400">Título: {editingDocument.titulo_extraido}</p>
                <p className="text-sm text-slate-400">Status: {editingDocument.status_processamento}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScientificArticleGrid;
