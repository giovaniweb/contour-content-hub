import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Upload, Plus, Flame, Sparkles, FileText, Calendar, User } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useScientificArticles, ScientificArticleFilters } from '@/hooks/use-scientific-articles'; // MODIFICADO
import ArticleViewModal from '@/components/scientific-articles/ArticleViewModal';
import AdvancedSearch from '@/components/scientific-articles/AdvancedSearch'; // NOVO
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { TechnicalDocument } from '@/types/document'; // For better typing
import { useCallback } from 'react'; // Added useCallback

const ScientificArticles: React.FC = () => {
  // const [searchTerm, setSearchTerm] = useState(''); // REMOVIDO
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Manter se SearchAndFilters for mantido para viewMode
  const [selectedArticle, setSelectedArticle] = useState<TechnicalDocument | null>(null); // MODIFICADO: any para TechnicalDocument | null
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { articles, loading, error, fetchScientificArticles } = useScientificArticles(); // MODIFICADO
  const [currentFilters, setCurrentFilters] = useState<Partial<ScientificArticleFilters>>({}); // NOVO

  useEffect(() => {
    fetchScientificArticles(currentFilters);
  }, [fetchScientificArticles, currentFilters]);

  // const filteredArticles = articles.filter(article => ...); // REMOVIDO - filtragem agora no hook

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data desconhecida';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Função para determinar se um artigo é "novo" (últimos 30 dias)
  const isNewArticle = (dateString: string) => {
    const articleDate = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return articleDate > thirtyDaysAgo;
  };

  // Função para determinar se um artigo é "popular" (tem keywords ou researchers)
  const isPopularArticle = (article: TechnicalDocument) => { // MODIFICADO: any para TechnicalDocument
    return (article.keywords && article.keywords.length > 0) || 
           (article.researchers && article.researchers.length > 0);
  };

  const handleViewArticle = (article: TechnicalDocument) => { // MODIFICADO: any para TechnicalDocument
    setSelectedArticle(article);
    setIsViewModalOpen(true);
  };

  const handleAdvancedSearch = useCallback((newFilters: Partial<ScientificArticleFilters>) => {
    setCurrentFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setCurrentFilters({});
  }, []);

  const statusBadges = [
    {
      icon: Flame,
      label: 'Popular',
      variant: 'secondary' as const,
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    },
    {
      icon: Sparkles,
      label: 'Recente',
      variant: 'secondary' as const,
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={BookOpen}
        title="Artigos Científicos"
        subtitle="Biblioteca de artigos e pesquisas científicas"
        statusBadges={statusBadges}
      />

      {/* REMOVER SearchAndFilters ou ajustar sua integração */}
      {/* <SearchAndFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onViewModeChange={setViewMode}
        viewMode={viewMode} // viewMode pode ser mantido se a funcionalidade for desejada separadamente
      /> */}

      <AdvancedSearch // NOVO
        initialFilters={currentFilters}
        onSearch={handleAdvancedSearch}
        onClear={handleClearSearch}
      />

      { error && (
        <div className="container mx-auto px-6 py-4">
          <div className="bg-red-500/20 text-red-300 border border-red-500/30 p-4 rounded-md">
            Erro ao carregar artigos: {error}
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-slate-300">Carregando artigos...</p>
            </div>
          ) : articles.length === 0 ? ( // MODIFICADO de filteredArticles para articles
            <EmptyState
              icon={BookOpen}
              title="Nenhum artigo encontrado"
              description={Object.keys(currentFilters).filter(k => currentFilters[k] !== undefined && currentFilters[k] !== '').length > 0 ? 'Tente ajustar seus filtros ou clique em "Limpar Filtros"' : 'Nenhum artigo científico corresponde aos critérios atuais ou ainda não foram adicionados.'}
              actionLabel="Limpar Filtros e Recarregar"
              onAction={handleClearSearch} // Ação agora limpa os filtros
            />
          ) : (
            // TODO: Re-integrar o viewMode se SearchAndFilters for mantido apenas para isso.
            // Por agora, removendo a lógica de classe dinâmica de viewMode para simplificar.
            <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''} gap-6`}>
              {articles.map((article) => ( // MODIFICADO de filteredArticles para articles
                <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 bg-slate-800/50 border-cyan-500/20 rounded-xl overflow-hidden backdrop-blur-sm cursor-pointer aurora-border-enhanced">
                  {/* Article Preview */}
                  <div className="relative aspect-[4/3] bg-slate-700/50 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                      <FileText className="h-16 w-16 text-cyan-400" />
                    </div>
                    
                    {/* Tags sobre o artigo */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {isPopularArticle(article) && (
                        <div className="bg-orange-500/90 rounded-full p-2 backdrop-blur-sm" title="Popular">
                          <Flame className="h-4 w-4 text-white" />
                        </div>
                      )}
                      {article.data_criacao && isNewArticle(article.data_criacao) && (
                        <div className="bg-green-500/90 rounded-full p-2 backdrop-blur-sm" title="Recente">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* PDF indicator */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                      PDF
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2 text-slate-100">{article.titulo}</h3>
                    
                    {article.descricao && (
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                        {article.descricao}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      {article.data_criacao && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(article.data_criacao)}
                        </div>
                      )}
                      {article.researchers && article.researchers.length > 0 && (
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {article.researchers.length === 1 
                            ? article.researchers[0].split(' ')[0] 
                            : `${article.researchers.length} autores`
                          }
                        </div>
                      )}
                    </div>

                    {/* Keywords */}
                    {article.keywords && article.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.keywords.slice(0, 2).map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-400">
                            {keyword}
                          </Badge>
                        ))}
                        {article.keywords.length > 2 && (
                          <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                            +{article.keywords.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Equipment info */}
                    {article.equipamento_nome && (
                      <div className="text-xs text-slate-500 mt-1">
                        Equipamento: {article.equipamento_nome}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="px-4 py-3 bg-slate-800/60 border-t border-cyan-500/20">
                    <Button 
                      size="sm" 
                      onClick={() => handleViewArticle(article)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-xl"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Visualização */}
      <ArticleViewModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        document={selectedArticle} // MODIFICADO
      />
    </AuroraPageLayout>
  );
};

export default ScientificArticles;
