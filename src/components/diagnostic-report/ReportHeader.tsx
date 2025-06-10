
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Calendar, Clock, Shield, Star } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { calculateStrategicScore } from '@/utils/calculateStrategicScore';
import ScoreBreakdownTooltip from './ScoreBreakdownTooltip';

interface ReportHeaderProps {
  session: DiagnosticSession;
  onBack: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ session, onBack }) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const isPaid = session.isPaidData || session.isCompleted;
  const { date, time } = formatDate(session.timestamp);
  const scoreBreakdown = calculateStrategicScore(session);

  return (
    <div className="space-y-6">
      {/* Botão de voltar */}
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar ao Histórico
      </Button>

      {/* Header principal */}
      <Card className="aurora-card border-aurora-electric-purple/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-aurora-gradient-primary rounded-full">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Diagnóstico Estratégico
                </h1>
                <p className="text-foreground/60">
                  Análise completa do potencial da sua clínica
                </p>
              </div>
            </div>

            {/* Score estratégico com tooltip */}
            <ScoreBreakdownTooltip session={session}>
              <div className="text-right">
                <div className="text-xs text-foreground/60 mb-1">Score Estratégico</div>
                <div className={`text-3xl font-bold ${scoreBreakdown.color}`}>
                  {scoreBreakdown.totalScore}
                </div>
                <div className={`text-sm ${scoreBreakdown.color}`}>
                  {scoreBreakdown.label}
                </div>
              </div>
            </ScoreBreakdownTooltip>
          </div>

          {/* Informações da clínica */}
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Informações da Clínica</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/60">Tipo:</span>
                  <Badge variant="outline" className="border-aurora-sage/30 text-aurora-sage">
                    {session.clinicTypeLabel}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/60">Especialidade:</span>
                  <span className="text-sm font-medium text-foreground">{session.specialty}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Detalhes do Relatório</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-foreground/60" />
                  <span className="text-sm text-foreground">{date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-foreground/60" />
                  <span className="text-sm text-foreground">{time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges de status */}
          <div className="flex items-center gap-2">
            <Badge variant={session.isCompleted ? "default" : "secondary"}>
              {session.isCompleted ? "Diagnóstico Completo" : "Em Progresso"}
            </Badge>
            
            {isPaid && (
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <Shield className="h-3 w-3 mr-1" />
                Relatório Premium
              </Badge>
            )}

            <Badge variant="outline" className="border-aurora-deep-purple/30 text-aurora-deep-purple">
              <Star className="h-3 w-3 mr-1" />
              Análise IA
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportHeader;
