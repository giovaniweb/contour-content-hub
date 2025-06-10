
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import StructuredDiagnosticSections from './StructuredDiagnosticSections';
import { calculateStrategicScore } from '@/utils/calculateStrategicScore';

interface DiagnosticTabProps {
  session: DiagnosticSession;
}

const DiagnosticTab: React.FC<DiagnosticTabProps> = ({ session }) => {
  // Usar cálculo real do score
  const scoreBreakdown = calculateStrategicScore(session);

  return (
    <div className="space-y-8">
      {/* Score estratégico */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="aurora-card border-aurora-electric-purple/30 backdrop-blur-xl bg-gradient-to-br from-aurora-electric-purple/10 to-aurora-neon-blue/5 hover:shadow-aurora-glow transition-all duration-300 group">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-aurora-electric-purple/20 rounded-full w-fit mx-auto mb-3 group-hover:bg-aurora-electric-purple/30 transition-colors">
              <Brain className="h-8 w-8 text-aurora-electric-purple group-hover:animate-pulse" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Score Estratégico</h3>
            <div className={`text-3xl font-bold ${scoreBreakdown.color} aurora-text-gradient animate-aurora-pulse`}>
              {scoreBreakdown.totalScore}
            </div>
            <div className={`text-sm ${scoreBreakdown.color} flex items-center justify-center gap-1`}>
              <Sparkles className="h-3 w-3" />
              {scoreBreakdown.label}
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-card border-aurora-sage/30 backdrop-blur-xl bg-gradient-to-br from-aurora-sage/10 to-aurora-emerald/5 hover:shadow-aurora-glow-emerald transition-all duration-300 group">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-aurora-sage/20 rounded-full w-fit mx-auto mb-3 group-hover:bg-aurora-sage/30 transition-colors">
              <Target className="h-8 w-8 text-aurora-sage group-hover:animate-pulse" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Potencial de Crescimento</h3>
            <div className="text-3xl font-bold text-aurora-sage aurora-text-gradient">
              {scoreBreakdown.totalScore >= 70 ? 'Alto' : scoreBreakdown.totalScore >= 50 ? 'Médio' : 'Emergente'}
            </div>
            <div className="text-sm text-foreground/60">
              Baseado no perfil da clínica
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-card border-aurora-deep-purple/30 backdrop-blur-xl bg-gradient-to-br from-aurora-deep-purple/10 to-aurora-lavender/5 hover:shadow-aurora-glow-intense transition-all duration-300 group">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-aurora-deep-purple/20 rounded-full w-fit mx-auto mb-3 group-hover:bg-aurora-deep-purple/30 transition-colors">
              <TrendingUp className="h-8 w-8 text-aurora-deep-purple group-hover:animate-pulse" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Prioridade</h3>
            <Badge variant="default" className="text-lg px-4 py-2 bg-aurora-gradient-primary backdrop-blur-sm animate-aurora-pulse">
              {scoreBreakdown.totalScore >= 80 ? 'Manutenção' : scoreBreakdown.totalScore >= 60 ? 'Otimização' : 'Urgente'}
            </Badge>
            <div className="text-sm text-foreground/60 mt-2">
              Implementação recomendada
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status do diagnóstico */}
      {session.isCompleted && (
        <Card className="aurora-card border-green-500/30 backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 hover:shadow-aurora-glow-emerald transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-400 animate-pulse" />
              </div>
              <span className="aurora-text-gradient">Diagnóstico Completo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 leading-relaxed">
              Seu diagnóstico foi concluído com sucesso. Todas as análises e recomendações 
              estão disponíveis nas abas correspondentes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Seções do diagnóstico estruturadas */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground aurora-text-gradient flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-aurora-electric-purple animate-pulse" />
            Análise Detalhada
          </h2>
        </div>

        <StructuredDiagnosticSections 
          diagnostic={session.state.generatedDiagnostic || ''}
          state={session.state}
        />
      </div>
    </div>
  );
};

export default DiagnosticTab;
