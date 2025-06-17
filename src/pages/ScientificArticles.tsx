
import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Upload, Plus, Flame, Sparkles, FileText, Calendar, User } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useDocuments } from '@/hooks/use-documents';

const ScientificArticles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { documents, loading, fetchDocuments } = useDocuments();

  useEffect(() => {
    // Buscar apenas artigos científicos
    fetchDocuments({ type: 'artigo_cientifico' });
  }, [fetchDocuments]);

  const filteredArticles = documents.filter(article =>
    article.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.descricao && article.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
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
  const isPopularArticle = (article: any) => {
    return (article.keywords && article.keywords.length > 0) || 
           (article.researchers && article.researchers.length > 0);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <BookOpen className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
              <div className="absolute inset-0 h-12 w-12 text-cyan-400 animate-pulse blur-sm"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                Artigos Científicos
              </h1>
              <p className="text-slate-300">Biblioteca de artigos e pesquisas científicas</p>
            </div>
          </div>

          {/* Status Tags */}
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30 rounded-xl">
              <Flame className="h-4 w-4 mr-1" />
              Popular
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 rounded-xl">
              <Sparkles className="h-4 w-4 mr-1" />
              Recente
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <Input 
                placeholder="Pesquisar artigos..." 
                className="pl-10 bg-slate-800/50 border-cyan-500/30 text-slate-100 placeholder:text-slate-400 rounded-xl backdrop-blur-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl">
              <Upload className="h-4 w-4" />
              Enviar Artigo
            </Button>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-xl">
              <Plus className="h-4 w-4" />
              Novo Artigo
            </Button>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Carregando artigos...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
            <EmptyState
              icon={BookOpen}
              title="Nenhum artigo encontrado"
              description={searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando seus primeiros artigos científicos'}
              actionLabel="Adicionar Primeiro Artigo"
              actionIcon={Upload}
              onAction={() => console.log('Add article')}
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 bg-slate-800/50 border-cyan-500/20 rounded-xl overflow-hidden backdrop-blur-sm cursor-pointer">
                  {/* Article Preview */}
                  <div className="relative aspect-[4/3] bg-slate-700/50 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                      <FileText className="h-16 w-16 text-cyan-400" />
                    </div>
                    
                    {/* Tags sobre o artigo */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {isPopularArticle(article) && (
                        <div className="bg-orange-500/90 rounded-full p-2 backdrop-blur-sm">
                          <Flame className="h-4 w-4 text-white" />
                        </div>
                      )}
                      {article.data_criacao && isNewArticle(article.data_criacao) && (
                        <div className="bg-green-500/90 rounded-full p-2 backdrop-blur-sm">
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
                      <div className="text-xs text-slate-500">
                        Equipamento: {article.equipamento_nome}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="px-4 py-3 bg-slate-800/30 border-t border-cyan-500/20">
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-xl"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScientificArticles;
