import React from 'react';
import { TechnicalDocument } from '@/types/document';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecommendationEngineProps {
  articles: TechnicalDocument[]; // Todos os artigos disponíveis ou uma seleção pré-filtrada
  currentArticleId?: string; // Para evitar recomendar o artigo que já está sendo visto
  onViewArticle: (article: TechnicalDocument) => void; // Função para visualizar um artigo recomendado
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  articles,
  currentArticleId,
  onViewArticle,
}) => {
  // Lógica de placeholder: Recomendar os 3 artigos mais recentes, excluindo o atual
  // Ou, se houver poucos artigos, mostrar alguns aleatórios.
  // Uma lógica mais avançada (similaridade de conteúdo, histórico) virá depois.

  const recommendedArticles = articles
    .filter(article => article.id !== currentArticleId) // Excluir o artigo atual
    .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()) // Ordenar por mais recente
    .slice(0, 3); // Pegar os 3 primeiros

  if (recommendedArticles.length === 0) {
    return (
      <div className="my-8 p-6 bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl aurora-border-enhanced">
        <h3 className="text-xl font-semibold text-cyan-400 mb-4">Recomendações</h3>
        <p className="text-slate-400">Nenhuma recomendação disponível no momento.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="my-8 p-6 bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl aurora-border-enhanced">
      <h3 className="text-xl font-semibold text-cyan-400 mb-6 flex items-center">
        <Sparkles className="h-6 w-6 mr-3 text-purple-400" />
        Artigos Recomendados
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedArticles.map((article) => (
          <Card
            key={article.id}
            className="group hover:shadow-xl transition-all duration-300 bg-slate-800/50 border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-sm cursor-pointer aurora-border-enhanced-sm"
            onClick={() => onViewArticle(article)}
          >
            <div className="relative aspect-[16/9] bg-slate-700/50 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                <FileText className="h-12 w-12 text-cyan-400" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                PDF
              </div>
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-1 line-clamp-2 text-slate-100">{article.titulo}</h4>
              {article.data_criacao && (
                <div className="flex items-center text-xs text-slate-400 mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(article.data_criacao)}
                </div>
              )}
              {article.keywords && article.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.keywords.slice(0, 2).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-400">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="px-4 py-3 bg-slate-800/30 border-t border-cyan-500/20">
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-700 hover:to-purple-700 rounded-xl text-xs"
                onClick={(e) => {
                    e.stopPropagation(); // Evitar que o clique no card seja acionado também
                    onViewArticle(article);
                }}
              >
                <FileText className="h-3 w-3 mr-1" />
                Visualizar Artigo
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendationEngine;
