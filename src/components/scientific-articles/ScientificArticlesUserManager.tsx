import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Book, MessageSquare, Download } from 'lucide-react';
import { useScientificArticles } from '@/hooks/use-scientific-articles';
import { UnifiedDocument } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import SearchAndFilters from '@/components/layout/SearchAndFilters';
import { EquipmentFilter } from '@/components/filters/EquipmentFilter';
import ScientificArticleListView from './ScientificArticleListView';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ScientificArticlesUserManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const {
    articles,
    loading,
    error,
    fetchScientificArticles,
  } = useScientificArticles();

  useEffect(() => {
    const params = {
      search: searchTerm,
      equipmentId: selectedEquipment || undefined,
    };
    fetchScientificArticles(params);
  }, [searchTerm, selectedEquipment, fetchScientificArticles]);

  const handleViewDocument = (document: UnifiedDocument) => {
    // Navigate to dedicated page instead of modal
    window.location.href = `/scientific-articles/${document.id}`;
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Erro ao carregar artigos científicos: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <SearchAndFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        additionalControls={
          <EquipmentFilter
            value={selectedEquipment}
            onValueChange={setSelectedEquipment}
            placeholder="Todos os equipamentos"
            className="min-w-[200px]"
          />
        }
      />

      {/* Loading State */}
      {loading ? (
        <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-cyan mx-auto mb-4"></div>
            <p className="aurora-body text-white/80">Carregando artigos científicos...</p>
          </div>
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="aurora-card-enhanced hover:border-aurora-cyan/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                          Artigo Científico
                        </Badge>
                        <Badge variant="secondary" className={
                          article.status_processamento === 'concluido' 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : article.status_processamento === 'falhou' 
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        }>
                          {article.status_processamento}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="font-semibold aurora-text-gradient-enhanced mb-2 line-clamp-2">
                          {article.titulo_extraido || 'Título não disponível'}
                        </h3>
                        {article.texto_completo && (
                          <p className="text-sm text-slate-300 line-clamp-3">
                            {article.texto_completo.substring(0, 150)}...
                          </p>
                        )}
                      </div>

                      {article.equipamento_nome && (
                        <div className="text-xs text-aurora-cyan">
                          📱 {article.equipamento_nome}
                        </div>
                      )}

                      {article.palavras_chave && article.palavras_chave.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {article.palavras_chave.slice(0, 3).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/30">
                              {keyword}
                            </Badge>
                          ))}
                          {article.palavras_chave.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/30">
                              +{article.palavras_chave.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() => handleViewDocument(article)}
                          size="sm"
                          variant="outline"
                          className="border-aurora-cyan text-aurora-cyan hover:bg-aurora-cyan/10"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => {
                            if (article.file_path) {
                              const fullFileUrl = `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/documents/${article.file_path}`;
                              window.open(fullFileUrl, '_blank');
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="border-aurora-emerald text-aurora-emerald hover:bg-aurora-emerald/10"
                          disabled={!article.file_path}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleViewDocument(article)}
                          size="sm"
                          variant="outline"
                          className="border-aurora-electric-purple text-aurora-electric-purple hover:bg-aurora-electric-purple/10"
                        >
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* List View */
            <ScientificArticleListView
              articles={articles}
              onView={handleViewDocument}
              formatDate={formatDate}
            />
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
          <div className="text-center py-16">
            <Book className="h-16 w-16 text-aurora-electric-purple mx-auto mb-4" />
            <h3 className="aurora-heading-enhanced text-xl mb-2">
              Nenhum artigo científico encontrado
            </h3>
            <p className="text-slate-400">
              Ajuste os filtros ou tente uma busca diferente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScientificArticlesUserManager;