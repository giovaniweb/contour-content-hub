
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import { UnifiedDocument } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { UniversalDeleteService } from '@/services/universalDeleteService';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

interface ScientificArticleGridProps {
  articles: UnifiedDocument[];
  isLoading: boolean;
  onEdit: (article: UnifiedDocument) => void;
  onView: (article: UnifiedDocument) => void;
  onRefresh: () => void;
}

const ScientificArticleGrid: React.FC<ScientificArticleGridProps> = ({
  articles,
  isLoading,
  onEdit,
  onView,
  onRefresh
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<UnifiedDocument | null>(null);
  const { toast } = useToast();

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Data desconhecida';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const handleDeleteClick = (article: UnifiedDocument) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    setDeletingId(articleToDelete.id);
    setDeleteDialogOpen(false);

    try {
      console.log('🗑️ Iniciando exclusão do documento:', articleToDelete.id);
      
      const result = await UniversalDeleteService.deleteDocument(articleToDelete.id);
      
      if (result.success) {
        toast({
          title: 'Documento excluído',
          description: 'O documento foi removido com sucesso.',
        });
        onRefresh();
      } else {
        throw new Error(result.error || 'Erro ao excluir documento');
      }
    } catch (error: any) {
      console.error('Erro ao excluir documento:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: error.message || 'Não foi possível excluir o documento.',
      });
    } finally {
      setDeletingId(null);
      setArticleToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse aurora-glass-enhanced rounded-xl p-4">
            <div className="aspect-video bg-slate-700/50 rounded-md mb-3"></div>
            <div className="h-4 bg-slate-700/50 rounded mb-2"></div>
            <div className="h-3 bg-slate-700/50 rounded w-2/3 mb-3"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-slate-700/50 rounded flex-1"></div>
              <div className="h-8 bg-slate-700/50 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 aurora-glass-enhanced rounded-xl border border-cyan-500/20">
        <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
        <h3 className="text-lg font-medium mb-2 text-slate-200">Nenhum artigo encontrado</h3>
        <p className="text-slate-400">
          Comece adicionando seu primeiro artigo científico à biblioteca.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="group relative hover:shadow-2xl transition-all duration-300 aurora-card-enhanced aurora-border-enhanced flex flex-col justify-between">
            <CardContent className="p-4">
              <div className="relative aspect-[16/9] bg-slate-700/50 overflow-hidden rounded-md mb-3">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 via-slate-800 to-slate-700">
                  <FileText className="h-16 w-16 text-cyan-400 opacity-70" />
                </div>
                <div className="absolute top-2 right-2">
                  {article.status_processamento === 'falhou' && <Badge variant="destructive" className="bg-red-500 text-white"><AlertTriangle className="h-3 w-3 mr-1" /> Erro</Badge>}
                  {article.status_processamento === 'concluido' && <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" /> Disponível</Badge>}
                  {article.status_processamento === 'processando' && <Badge variant="outline" className="text-blue-300 border-blue-400">Processando...</Badge>}
                  {article.status_processamento === 'pendente' && <Badge variant="outline" className="text-yellow-300 border-yellow-400">Pendente</Badge>}
                </div>
              </div>

              <h3 className="font-semibold text-md mb-1.5 line-clamp-2 text-slate-100 group-hover:text-cyan-400 transition-colors">
                {article.titulo_extraido || 'Título Pendente'}
              </h3>
              
              {article.descricao && (
                <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                  {article.descricao}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                {article.data_upload && (
                  <div className="flex items-center" title={`Data de Upload: ${formatDate(article.data_upload)}`}>
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                    {formatDate(article.data_upload)}
                  </div>
                )}
                {article.autores && article.autores.length > 0 && (
                  <div className="flex items-center" title={article.autores.join(', ')}>
                    <User className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                    {article.autores.length === 1
                      ? article.autores[0].split(' ')[0]
                      : `${article.autores.length} autores`
                    }
                  </div>
                )}
              </div>

              {article.palavras_chave && article.palavras_chave.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {article.palavras_chave.slice(0, 3).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5">
                      {keyword}
                    </Badge>
                  ))}
                  {article.palavras_chave.length > 3 && (
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 px-1.5 py-0.5">
                      +{article.palavras_chave.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              
              {article.equipamento_nome && (
                <p className="text-xs text-slate-500 mt-1">Equip.: {article.equipamento_nome}</p>
              )}
            </CardContent>

            <CardFooter className="p-3 aurora-glass-enhanced border-t border-slate-700/60 mt-auto">
              <div className="w-full flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(article)}
                  className="flex-1 aurora-button-enhanced border-cyan-500/70 text-cyan-400 hover:bg-cyan-500/10"
                  disabled={article.status_processamento !== 'concluido'}
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  Ver
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(article)}
                  className="aurora-button-enhanced border-blue-500/70 text-blue-400 hover:bg-blue-500/10"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteClick(article)}
                  disabled={deletingId === article.id}
                  className="aurora-button-enhanced border-red-500/70 text-red-400 hover:bg-red-500/10"
                >
                  {deletingId === article.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="aurora-enhanced-theme bg-card/95 backdrop-blur-lg border border-primary/20 shadow-2xl max-w-md">
          <AlertDialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-slate-100">
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300 text-center leading-relaxed">
              Tem certeza que deseja excluir o documento <span className="font-semibold text-white">"{articleToDelete?.titulo_extraido}"</span>?
              <br />
              <span className="text-red-400 font-medium">Esta ação não pode ser desfeita e removerá todos os dados relacionados.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <AlertDialogCancel className="flex-1 bg-slate-700/50 hover:bg-slate-600 border-slate-600 text-slate-200 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ScientificArticleGrid;
