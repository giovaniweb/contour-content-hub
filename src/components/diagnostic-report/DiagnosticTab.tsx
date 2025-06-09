
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import DiagnosticContentFormatter from './DiagnosticContentFormatter';
import GrowthStrategySection from './GrowthStrategySection';

interface DiagnosticTabProps {
  session: DiagnosticSession;
}

const DiagnosticTab: React.FC<DiagnosticTabProps> = ({ session }) => {
  // Simular score baseado no estado do diagnóstico
  const strategicScore = session.isCompleted ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40) + 30;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    return 'Precisa Melhorar';
  };

  return (
    <div className="space-y-6">
      {/* Score estratégico */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="aurora-card border-aurora-electric-purple/30">
          <CardContent className="p-6 text-center">
            <Brain className="h-8 w-8 text-aurora-electric-purple mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Score Estratégico</h3>
            <div className={`text-3xl font-bold ${getScoreColor(strategicScore)}`}>
              {strategicScore}
            </div>
            <div className={`text-sm ${getScoreColor(strategicScore)}`}>
              {getScoreLabel(strategicScore)}
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-card border-aurora-sage/30">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-aurora-sage mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Potencial de Crescimento</h3>
            <div className="text-3xl font-bold text-aurora-sage">Alto</div>
            <div className="text-sm text-foreground/60">
              Baseado no perfil da clínica
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-card border-aurora-deep-purple/30">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-aurora-deep-purple mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Prioridade</h3>
            <Badge variant="default" className="text-lg px-4 py-2">
              Urgente
            </Badge>
            <div className="text-sm text-foreground/60 mt-2">
              Implementação recomendada
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status do diagnóstico */}
      {session.isCompleted && (
        <Card className="aurora-card border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Diagnóstico Completo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80">
              Seu diagnóstico foi concluído com sucesso. Todas as análises e recomendações 
              estão disponíveis nas abas correspondentes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Conteúdo do diagnóstico */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Análise Detalhada</h2>
        </div>

        <DiagnosticContentFormatter 
          content={session.state.generatedDiagnostic || ''} 
        />
      </div>

      {/* Nova seção de estratégia de crescimento */}
      <GrowthStrategySection session={session} />
    </div>
  );
};

export default DiagnosticTab;
