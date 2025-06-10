
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Brain, AlertTriangle, Lightbulb, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { 
  getLatestInstagramAnalytics, 
  analyzeInstagramEngagement,
  type InstagramAnalytics,
  type InstagramAnalysis 
} from "@/services/instagramService";

interface InstagramAnalysisProps {
  isConnected: boolean;
}

export const InstagramAnalysisComponent: React.FC<InstagramAnalysisProps> = ({ isConnected }) => {
  const [analytics, setAnalytics] = useState<InstagramAnalytics | null>(null);
  const [analysis, setAnalysis] = useState<InstagramAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadAnalytics();
    }
  }, [isConnected]);

  const loadAnalytics = async () => {
    try {
      const data = await getLatestInstagramAnalytics();
      if (data) {
        setAnalytics(data);
        
        // Load existing analysis if available
        if (data.analysis_result) {
          try {
            const parsedAnalysis = JSON.parse(data.analysis_result);
            setAnalysis(parsedAnalysis);
          } catch (e) {
            console.error('Error parsing analysis result:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeInstagramEngagement();
      if (result) {
        setAnalysis(result);
        await loadAnalytics(); // Reload to get updated data
      }
    } catch (error) {
      console.error('Error analyzing engagement:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="aurora-glass border-aurora-lavender/30">
        <CardContent className="p-6 text-center">
          <Instagram className="h-12 w-12 mx-auto text-foreground/40 mb-4" />
          <p className="text-foreground/60">
            Conecte o Instagram para ver a análise de engajamento
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="aurora-glass border-aurora-lavender/30">
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-12 w-12 mx-auto text-foreground/40 mb-4" />
          <p className="text-foreground/60 mb-4">
            Nenhum dado de analytics encontrado
          </p>
          <Button onClick={loadAnalytics} variant="outline">
            Recarregar Dados
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Summary */}
      <Card className="aurora-glass border-aurora-turquoise/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-500" />
            Dados Reais do Instagram
            <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
              Conectado
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">
                {analytics.followers_count?.toLocaleString()}
              </div>
              <div className="text-sm text-foreground/60">Seguidores</div>
            </div>
            <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">
                {analytics.engagement_rate}%
              </div>
              <div className="text-sm text-foreground/60">Engajamento</div>
            </div>
            <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">
                {analytics.reach?.toLocaleString()}
              </div>
              <div className="text-sm text-foreground/60">Alcance Médio</div>
            </div>
            <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-400">
                {analytics.post_frequency}
              </div>
              <div className="text-sm text-foreground/60">Posts/Semana</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      <Card className="aurora-glass border-aurora-lavender/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Análise IA de Engajamento
            </CardTitle>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              variant="outline"
              className="border-purple-500/30 text-purple-400"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  {analysis ? 'Reanalisar' : 'Analisar'}
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {analysis ? (
            <div className="space-y-6">
              {/* Diagnóstico */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  📊 Diagnóstico de Engajamento
                </h4>
                <p className="text-foreground/80 leading-relaxed">
                  {analysis.diagnostico}
                </p>
              </div>

              {/* Alertas */}
              {analysis.alertas && analysis.alertas.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                    Alertas Estratégicos
                  </h4>
                  <div className="space-y-2">
                    {analysis.alertas.map((alerta, index) => (
                      <div key={index} className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <p className="text-orange-200 text-sm">{alerta}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recomendações */}
              {analysis.recomendacoes && analysis.recomendacoes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-green-400" />
                    Recomendações Inteligentes
                  </h4>
                  <div className="space-y-2">
                    {analysis.recomendacoes.map((recomendacao, index) => (
                      <div key={index} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="text-green-200 text-sm">{recomendacao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-foreground/40 mb-4" />
              <p className="text-foreground/60 mb-4">
                Clique em "Analisar" para gerar insights inteligentes baseados nos seus dados reais do Instagram
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
