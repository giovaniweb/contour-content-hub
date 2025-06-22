
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Flame, Sparkles, FileText, Calendar, User, AlertTriangle, CheckCircle, RefreshCw, UploadCloud } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useScientificArticles, ScientificArticleFilters } from '@/hooks/use-scientific-articles';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { UnifiedDocument, ProcessingStatusEnum } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ScientificArticlesPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<UnifiedDocument | null>(null);
  const { toast } = useToast();

  const { articles, loading, error, fetchScientificArticles } = useScientificArticles();
  const [currentFilters, setCurrentFilters] = useState<Partial<ScientificArticleFilters>>({});

  useEffect(() => {
    // Fetch all documents without filters to see everything
    fetchScientificArticles();
  }, [fetchScientificArticles]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Data desconhecida';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const handleReprocess = async (documentId: string) => {
    toast({ title: "Reprocessando...", description: `Iniciando o reprocessamento do artigo ID: ${documentId}` });
    try {
      // Update status to 'pendente' to visually indicate it's queued again
      await supabase.from('unified_documents').update({ status_processamento: 'pendente', detalhes_erro: null }).eq('id', documentId);

      const { error: functionError } = await supabase.functions.invoke('process-document', {
        body: { documentId: documentId, forceRefresh: true },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }
      toast({ title: "Sucesso", description: "Reprocessamento iniciado. O artigo será atualizado em breve." });
      // Refresh the list after a short delay
      setTimeout(() => fetchScientificArticles(), 3000);
    } catch (err: any) {
      console.error("Reprocess Error:", err);
      toast({ variant: "destructive", title: "Falha ao Reprocessar", description: err.message });
      // Revert status if needed
      await supabase.from('unified_documents').update({ status_processamento: 'falhou', detalhes_erro: `Falha ao tentar reprocessar: ${err.message}` }).eq('id', documentId);
    }
  };

  const handleRefresh = useCallback(() => {
    fetchScientificArticles();
  }, [fetchScientificArticles]);

  const pageActions = (
    <div className="flex gap-4">
      <Button onClick={handleRefresh} variant="outline" className="border-cyan-500/70 text-cyan-400 hover:bg-cyan-500/10">
        <RefreshCw className="mr-2 h-4 w-4" />
        Atualizar
      </Button>
      <Link to="/admin/upload-documento">
        <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white aurora-glow">
          <UploadCloud className="mr-2 h-4 w-4" />
          Adicionar Novo Documento
        </Button>
      </Link>
    </div>
  );

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={BookOpen}
        title="Artigos Científicos"
        subtitle="Biblioteca de artigos e pesquisas científicas"
        actions={pageActions}
      />

      {error && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-800/30 text-red-300 border border-red-700/50 p-4 rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3 text-red-400" /> Erro ao carregar artigos: {error}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="aurora-glass-enhanced border border-cyan-500/20 rounded-xl p-6 shadow-lg">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-slate-300">Carregando artigos...</p>
            </div>
          ) : articles.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Nenhum artigo científico encontrado"
              description="Nenhum artigo foi carregado ainda. Faça upload do seu primeiro documento científico."
              actionLabel="Fazer Upload"
              onAction={() => window.location.href = '/admin/upload-documento'}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="group relative hover:shadow-2xl transition-all duration-300 aurora-glass-enhanced border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm aurora-border-enhanced flex flex-col justify-between">
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
                    {article.status_processamento === 'falhou' && article.detalhes_erro && (
                      <p className="text-xs text-red-400 mt-2 line-clamp-2" title={article.detalhes_erro}>
                        <AlertTriangle className="inline h-3 w-3 mr-1" /> {article.detalhes_erro}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="p-3 aurora-glass-enhanced border-t border-slate-700/60 mt-auto">
                    <div className="w-full flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedArticle(article)}
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
    </AuroraPageLayout>
  );
};

export default ScientificArticlesPage;
