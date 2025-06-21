import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // For "Add New Article" button
import { BookOpen, Flame, Sparkles, FileText, Calendar, User, AlertTriangle, CheckCircle, RefreshCw, UploadCloud } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useScientificArticles, ScientificArticleFilters } from '@/hooks/use-scientific-articles';
import ArticleViewModal from '@/components/scientific-articles/ArticleViewModal'; // Needs to be adapted for UnifiedDocument
import AdvancedSearch from '@/components/scientific-articles/AdvancedSearch'; // Needs to be adapted for UnifiedDocument filters
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { UnifiedDocument, ProcessingStatusEnum } from '@/types/document'; // Using UnifiedDocument
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';


const ScientificArticlesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Retain view mode if UI supports it
  const [selectedArticle, setSelectedArticle] = useState<UnifiedDocument | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  const { articles, loading, error, fetchScientificArticles } = useScientificArticles();
  const [currentFilters, setCurrentFilters] = useState<Partial<ScientificArticleFilters>>({
    status_processamento: 'concluido', // Default to show only concluded articles
  });

  useEffect(() => {
    fetchScientificArticles(currentFilters);
  }, [fetchScientificArticles, currentFilters]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Data desconhecida';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const isNewArticle = (dateString?: string | null) => {
    if (!dateString) return false;
    const articleDate = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return articleDate > thirtyDaysAgo;
  };

  const isPopularArticle = (article: UnifiedDocument) => {
    return (article.palavras_chave && article.palavras_chave.length > 0) ||
           (article.autores && article.autores.length > 0);
  };

  const handleViewArticle = (article: UnifiedDocument) => {
    setSelectedArticle(article);
    setIsViewModalOpen(true);
  };

  const handleReprocess = async (documentId: string) => {
    toast({ title: "Reprocessando...", description: `Iniciando o reprocessamento do artigo ID: ${documentId}` });
    try {
      // Update status to 'pendente' to visually indicate it's queued again
      await supabase.from('unified_documents').update({ status_processamento: 'pendente', detalhes_erro: null }).eq('id', documentId);

      const { error: functionError } = await supabase.functions.invoke('process-document', {
        body: { documentId: documentId, forceRefresh: true }, // forceRefresh might be implicit if re-queued
      });

      if (functionError) {
        throw new Error(functionError.message);
      }
      toast({ title: "Sucesso", description: "Reprocessamento iniciado. O artigo será atualizado em breve." });
      // Optionally, refresh the list after a short delay or use real-time updates
      setTimeout(() => fetchScientificArticles(currentFilters), 3000);
    } catch (err: any) {
      console.error("Reprocess Error:", err);
      toast({ variant: "destructive", title: "Falha ao Reprocessar", description: err.message });
      // Revert status if needed, or let the processing function handle failure status
      await supabase.from('unified_documents').update({ status_processamento: 'falhou', detalhes_erro: `Falha ao tentar reprocessar: ${err.message}` }).eq('id', documentId);
    }
  };


  const handleAdvancedSearch = useCallback((newFilters: Partial<ScientificArticleFilters>) => {
    setCurrentFilters(prevFilters => ({ ...prevFilters, ...newFilters, status_processamento: newFilters.status_processamento || 'concluido' }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setCurrentFilters({ status_processamento: 'concluido' });
  }, []);

  const pageActions = (
    <Link to="/admin/upload-documento"> {/* Link to the new unified upload page */}
      <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
        <UploadCloud className="mr-2 h-4 w-4" />
        Adicionar Novo Documento
      </Button>
    </Link>
  );


  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={BookOpen}
        title="Artigos Científicos"
        subtitle="Biblioteca de artigos e pesquisas científicas (Nova Gestão)"
        actions={pageActions} // Add button to header
      />

      <AdvancedSearch // This component will need adaptation for new filter names (palavras_chave, autores)
        initialFilters={currentFilters}
        onSearch={handleAdvancedSearch}
        onClear={handleClearSearch}
        // Pass available statuses for filtering
        availableStatuses={[
            { value: 'concluido', label: 'Concluído' },
            { value: 'pendente', label: 'Pendente' },
            { value: 'processando', label: 'Processando' },
            { value: 'falhou', label: 'Falhou' }
        ]}
      />

      {error && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-800/30 text-red-300 border border-red-700/50 p-4 rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3 text-red-400" /> Erro ao carregar artigos: {error}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-800/30 backdrop-blur-md border border-cyan-500/20 rounded-xl p-6 shadow-lg">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-slate-300">Carregando artigos...</p>
            </div>
          ) : articles.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Nenhum artigo científico encontrado"
              description={Object.keys(currentFilters).filter(k => currentFilters[k] !== undefined && (typeof currentFilters[k] === 'string' ? currentFilters[k] !== '' : true) && k !== 'status_processamento' || (k === 'status_processamento' && currentFilters[k] !== 'concluido')).length > 0
                ? 'Nenhum artigo corresponde aos filtros. Tente limpá-los.'
                : 'Nenhum artigo científico foi processado com sucesso ainda ou não há artigos cadastrados.'
              }
              actionLabel="Limpar Filtros e Recarregar"
              onAction={handleClearSearch}
            />
          ) : (
            <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''} gap-6`}>
              {articles.map((article) => (
                <Card key={article.id} className="group relative hover:shadow-2xl transition-all duration-300 bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm aurora-border-enhanced flex flex-col justify-between">
                  <CardContent className="p-4">
                    <div className="relative aspect-[16/9] bg-slate-700/50 overflow-hidden rounded-md mb-3">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 via-slate-800 to-slate-700">
                        <FileText className="h-16 w-16 text-cyan-400 opacity-70" />
                      </div>
                      <div className="absolute top-2 right-2">
                         {article.status_processamento === 'falhou' && <Badge variant="destructive" className="bg-red-500 text-white"><AlertTriangle className="h-3 w-3 mr-1" /> Falhou</Badge>}
                         {article.status_processamento === 'concluido' && <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" /> Concluído</Badge>}
                         {article.status_processamento === 'processando' && <Badge variant="outline" className="text-blue-300 border-blue-400">Processando...</Badge>}
                         {article.status_processamento === 'pendente' && <Badge variant="outline" className="text-yellow-300 border-yellow-400">Pendente</Badge>}
                      </div>
                    </div>

                    <h3 className="font-semibold text-md mb-1.5 line-clamp-2 text-slate-100 group-hover:text-cyan-400 transition-colors">{article.titulo_extraido || 'Título Pendente'}</h3>
                    
                    {article.descricao && ( // Using the mapped 'descricao' which is a snippet of 'texto_completo'
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
                            ? article.autores[0].split(' ')[0] // First name of first author
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
                    {article.status_processamento === 'falhou' && article.detalhes_erro && (
                        <p className="text-xs text-red-400 mt-2 line-clamp-2" title={article.detalhes_erro}>
                            <AlertTriangle className="inline h-3 w-3 mr-1" /> {article.detalhes_erro}
                        </p>
                    )}
                  </CardContent>

                  <CardFooter className="p-3 bg-slate-800/70 border-t border-slate-700/60 mt-auto">
                    <div className="w-full flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewArticle(article)}
                          className="flex-1 border-cyan-500/70 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500"
                          disabled={article.status_processamento !== 'concluido'}
                        >
                          <FileText className="h-4 w-4 mr-1.5" />
                          Visualizar
                        </Button>
                        {article.status_processamento === 'falhou' && (
                             <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReprocess(article.id)}
                                className="flex-1 border-yellow-500/70 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 hover:border-yellow-500"
                            >
                                <RefreshCw className="h-4 w-4 mr-1.5" />
                                Reprocessar
                            </Button>
                        )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedArticle && (
        <ArticleViewModal // This modal will need to be adapted to accept UnifiedDocument and its fields
          isOpen={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          document={selectedArticle}
        />
      )}
    </AuroraPageLayout>
  );
};

export default ScientificArticlesPage;
