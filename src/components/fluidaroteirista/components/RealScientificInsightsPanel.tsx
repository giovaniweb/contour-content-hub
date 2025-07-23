import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  BookOpen, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  FileText,
  Users,
  Calendar,
  Star,
  Quote,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

import type { ScientificInsight } from '../types/interfaces';

interface RealScientificInsightsPanelProps {
  insights: ScientificInsight[];
  isLoading: boolean;
}

const RealScientificInsightsPanel: React.FC<RealScientificInsightsPanelProps> = ({
  insights,
  isLoading
}) => {
  const [expandedInsights, setExpandedInsights] = useState<Set<number>>(new Set());
  const [selectedDocument, setSelectedDocument] = useState<ScientificInsight | null>(null);

  const toggleInsightExpansion = (index: number) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedInsights(newExpanded);
  };

  const openDocumentViewer = (insight: ScientificInsight) => {
    setSelectedDocument(insight);
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
            Analisando artigos científicos na base de dados...
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
          <div className="text-center py-6">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Nenhum artigo científico encontrado na base de dados para este tema específico.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Tente termos mais gerais ou verifique se há artigos cadastrados no sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const averageRelevance = insights.reduce((acc, insight) => acc + insight.relevanceScore, 0) / insights.length;

  return (
    <>
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Evidências Científicas</CardTitle>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {insights.length} artigos encontrados
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Artigos da nossa base de dados científica
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estatísticas resumidas */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {insights.length}
              </div>
              <div className="text-xs text-muted-foreground">Artigos Relevantes</div>
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
                        {insight.publicationDate && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {insight.publicationDate}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Base Fluida
                        </Badge>
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
                  {insight.keywords && insight.keywords.length > 0 && (
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
                  )}

                  {/* Conteúdo expandido */}
                  {expandedInsights.has(index) && (
                    <div className="space-y-3 pt-3 border-t border-border/50">
                      {/* Autores se disponível */}
                      {insight.authors && insight.authors.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-foreground">Autores</div>
                          <p className="text-xs text-muted-foreground">
                            {insight.authors.join(", ")}
                          </p>
                        </div>
                      )}

                      {/* Fonte do documento */}
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-foreground">Identificação</div>
                        <p className="text-xs text-muted-foreground">
                          {insight.source}
                        </p>
                      </div>

                      {/* Botões de ação */}
                      <div className="flex gap-2 pt-2 border-t border-border/30">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => openDocumentViewer(insight)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver Artigo Completo
                        </Button>
                        {insight.filePath && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => {
                              if (insight.filePath) {
                                window.open(`https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/documents/${insight.filePath}`, '_blank');
                              }
                            }}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download PDF
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dica científica */}
          <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-start space-x-2">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                🔬
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Evidência Científica
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Estes são artigos científicos reais da nossa base de dados. Use essas evidências 
                  para fundamentar seu conteúdo e aumentar a credibilidade profissional.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal do visualizador de documento */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {selectedDocument?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {selectedDocument && (
              <div className="space-y-4 p-4">
                {/* Metadados */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg text-sm">
                  <div>
                    <span className="font-medium">Relevância:</span> {selectedDocument.relevanceScore}/10
                  </div>
                  {selectedDocument.publicationDate && (
                    <div>
                      <span className="font-medium">Data:</span> {selectedDocument.publicationDate}
                    </div>
                  )}
                  {selectedDocument.authors && selectedDocument.authors.length > 0 && (
                    <div className="col-span-2">
                      <span className="font-medium">Autores:</span> {selectedDocument.authors.join(", ")}
                    </div>
                  )}
                </div>

                {/* Conteúdo completo */}
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {selectedDocument.fullText || selectedDocument.summary}
                  </div>
                </div>

                {/* Keywords */}
                {selectedDocument.keywords && selectedDocument.keywords.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="text-sm font-medium mb-2">Palavras-chave</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedDocument.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RealScientificInsightsPanel;