import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Brain, 
  TrendingUp, 
  Users, 
  Lightbulb,
  Loader2,
  Star,
  Award
} from "lucide-react";

interface ScientificInsight {
  id: string;
  title: string;
  summary: string;
  relevanceScore: number;
  keywords: string[];
  source: string;
}

interface ScientificInsightsPanelProps {
  insights: ScientificInsight[];
  isLoading: boolean;
}

const ScientificInsightsPanel: React.FC<ScientificInsightsPanelProps> = ({
  insights,
  isLoading
}) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              Insights Científicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-slate-400 text-sm text-center">
                  Analisando artigos científicos...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Insights Científicos
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Base científica encontrada para seu roteiro
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Estatísticas */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">ARTIGOS</span>
              </div>
              <div className="text-xl font-bold text-white">{insights.length}</div>
            </div>

            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">RELEVÂNCIA</span>
              </div>
              <div className="text-xl font-bold text-white">
                {insights.length > 0 ? Math.round(insights.reduce((acc, insight) => acc + insight.relevanceScore, 0) / insights.length) : 0}%
              </div>
            </div>
          </motion.div>

          {/* Lista de Insights */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-blue-500/30 transition-colors cursor-pointer"
                >
                  {/* Header do insight */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-white font-medium text-sm leading-tight">
                      {insight.title}
                    </h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-slate-400">
                        {Math.round(insight.relevanceScore)}%
                      </span>
                    </div>
                  </div>

                  {/* Relevance bar */}
                  <Progress 
                    value={insight.relevanceScore} 
                    className="h-1 mb-3" 
                  />

                  {/* Summary */}
                  <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-3">
                    {insight.summary}
                  </p>

                  {/* Keywords */}
                  {insight.keywords && insight.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {insight.keywords.slice(0, 3).map((keyword, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="text-xs px-2 py-0 bg-blue-500/10 text-blue-400 border-blue-500/20"
                        >
                          {keyword}
                        </Badge>
                      ))}
                      {insight.keywords.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs px-2 py-0 bg-slate-500/10 text-slate-400 border-slate-500/20"
                        >
                          +{insight.keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Source */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="w-3 h-3" />
                    <span className="truncate">{insight.source}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-500 opacity-50" />
                <p className="text-slate-400 text-sm">
                  Nenhum insight científico encontrado
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Tente especificar um equipamento ou tópico mais específico
                </p>
              </motion.div>
            )}
          </div>

          {/* Pro tip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-400 font-medium">DICA PRO</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Quanto mais insights científicos encontrados, maior será a qualidade e credibilidade do seu roteiro.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScientificInsightsPanel;