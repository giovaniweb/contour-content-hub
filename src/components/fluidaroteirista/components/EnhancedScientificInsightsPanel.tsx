import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  FileText,
  Users,
  Calendar,
  Star,
  Quote
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScientificInsight {
  title: string;
  summary: string;
  relevanceScore: number;
  keywords: string[];
  source: string;
  authors?: string[];
  publicationDate?: string;
  doi?: string;
  fullText?: string;
  citations?: number;
  methodology?: string;
  sampleSize?: number;
  conclusions?: string;
}

interface EnhancedScientificInsightsPanelProps {
  insights: ScientificInsight[];
  isLoading: boolean;
}

const EnhancedScientificInsightsPanel: React.FC<EnhancedScientificInsightsPanelProps> = ({
  insights,
  isLoading
}) => {
  const [expandedInsights, setExpandedInsights] = useState<Set<number>>(new Set());

  const toggleInsightExpansion = (index: number) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedInsights(newExpanded);
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-100 dark:bg-green-900/20";
    if (score >= 6) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:bg-red-900/20";
  };

  const getRelevanceLabel = (score: number) => {
    if (score >= 8) return "Alta Relevância";
    if (score >= 6) return "Média Relevância";
    return "Baixa Relevância";
  };

  const generateDOILink = (doi?: string) => {
    if (!doi) return null;
    return `https://doi.org/${doi}`;
  };

  const generateSourceLink = (source: string) => {
    // Tenta detectar se é PubMed, Google Scholar, etc.
    if (source.includes('pubmed')) return source;
    if (source.includes('scholar.google')) return source;
    if (source.includes('doi.org')) return source;
    // Se não for um link, tenta buscar no Google Scholar
    return `https://scholar.google.com/scholar?q=${encodeURIComponent(source)}`;
  };

  if (isLoading) {
    return (
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle className="text-lg">Insights Científicos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Analisando artigos científicos...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Insights Científicos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum insight científico encontrado para este tema.
          </p>
        </CardContent>
      </Card>
    );
  }

  const averageRelevance = insights.reduce((acc, insight) => acc + insight.relevanceScore, 0) / insights.length;

  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Insights Científicos</CardTitle>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {insights.length} artigos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas resumidas */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {insights.length}
            </div>
            <div className="text-xs text-muted-foreground">Artigos Analisados</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {averageRelevance.toFixed(1)}/10
            </div>
            <div className="text-xs text-muted-foreground">Relevância Média</div>
          </div>
        </div>

        {/* Lista de insights */}
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <Card key={index} className="border border-border/30 hover:border-border/60 transition-colors">
              <CardContent className="p-4">
                {/* Header do insight */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-sm text-foreground leading-tight">
                      {insight.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge 
                        className={cn("text-xs", getRelevanceColor(insight.relevanceScore))}
                        variant="secondary"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {insight.relevanceScore}/10 - {getRelevanceLabel(insight.relevanceScore)}
                      </Badge>
                      {insight.authors && insight.authors.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {insight.authors.length} autor{insight.authors.length > 1 ? 'es' : ''}
                        </Badge>
                      )}
                      {insight.citations && (
                        <Badge variant="outline" className="text-xs">
                          <Quote className="h-3 w-3 mr-1" />
                          {insight.citations} citações
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleInsightExpansion(index)}
                    className="h-8 w-8 p-0 ml-2"
                  >
                    {expandedInsights.has(index) ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                </div>

                {/* Resumo sempre visível */}
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {insight.summary}
                </p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {insight.keywords.slice(0, 5).map((keyword, keyIndex) => (
                    <Badge key={keyIndex} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {insight.keywords.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{insight.keywords.length - 5} mais
                    </Badge>
                  )}
                </div>

                {/* Conteúdo expandido */}
                {expandedInsights.has(index) && (
                  <div className="space-y-3 pt-3 border-t border-border/50">
                    {/* Detalhes adicionais */}
                    {(insight.methodology || insight.sampleSize || insight.conclusions) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {insight.methodology && (
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-foreground">Metodologia</div>
                            <p className="text-xs text-muted-foreground">{insight.methodology}</p>
                          </div>
                        )}
                        {insight.sampleSize && (
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-foreground">Amostra</div>
                            <p className="text-xs text-muted-foreground">{insight.sampleSize} participantes</p>
                          </div>
                        )}
                        {insight.conclusions && (
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-foreground">Conclusões</div>
                            <p className="text-xs text-muted-foreground">{insight.conclusions}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Texto completo se disponível */}
                    {insight.fullText && (
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-xs font-medium text-foreground mb-2">Texto Completo</div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {insight.fullText}
                        </p>
                      </div>
                    )}

                    {/* Autores */}
                    {insight.authors && insight.authors.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-foreground">Autores</div>
                        <p className="text-xs text-muted-foreground">
                          {insight.authors.join(", ")}
                        </p>
                      </div>
                    )}

                    {/* Links e fonte */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-foreground">Fonte</div>
                        <p className="text-xs text-muted-foreground break-all">
                          {insight.source}
                        </p>
                        {insight.publicationDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {insight.publicationDate}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        {insight.doi && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => window.open(generateDOILink(insight.doi), '_blank')}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            DOI
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => window.open(generateSourceLink(insight.source), '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Ver Artigo
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dica profissional */}
        <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-start space-x-2">
            <div className="text-blue-600 dark:text-blue-400 mt-0.5">
              💡
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Dica Profissional
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Use esses insights científicos para fundamentar seu roteiro e aumentar a credibilidade. 
                Mencione estudos específicos quando possível e sempre cite as fontes para transparência.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedScientificInsightsPanel;