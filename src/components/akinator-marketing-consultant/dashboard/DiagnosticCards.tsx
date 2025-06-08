
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  DollarSign, 
  Target, 
  Users, 
  TrendingUp,
  Brain,
  MessageSquare,
  Calendar
} from "lucide-react";
import { MarketingConsultantState } from '../types';

interface DiagnosticCardsProps {
  state: MarketingConsultantState;
  aiSections: any;
  renderAIDiagnosticSummary: () => React.ReactNode;
}

const DiagnosticCards: React.FC<DiagnosticCardsProps> = ({ 
  state, 
  aiSections, 
  renderAIDiagnosticSummary 
}) => {
  const getClinicTypeInfo = () => {
    const isMedical = state.clinicType === 'clinica_medica';
    return {
      type: isMedical ? 'Clínica Médica' : 'Clínica Estética',
      icon: isMedical ? '🧪' : '💆‍♀️',
      color: isMedical ? 'from-blue-500/20 to-cyan-500/20' : 'from-pink-500/20 to-purple-500/20',
      borderColor: isMedical ? 'border-blue-500/30' : 'border-pink-500/30'
    };
  };

  const getRevenueInfo = () => {
    const revenueMap: { [key: string]: string } = {
      'ate_15k': 'Até R$ 15.000',
      '15k_30k': 'R$ 15.000 - R$ 30.000', 
      '30k_60k': 'R$ 30.000 - R$ 60.000',
      'acima_60k': 'Acima de R$ 60.000'
    };
    return revenueMap[state.currentRevenue] || 'Não informado';
  };

  const getGoalInfo = () => {
    const goalMap: { [key: string]: string } = {
      'crescer_30': 'Crescer 30%',
      'crescer_50': 'Crescer 50%', 
      'dobrar': 'Dobrar faturamento',
      'triplicar': 'Triplicar faturamento',
      'manter_estavel': 'Manter estabilidade'
    };
    return goalMap[state.revenueGoal] || 'Não informado';
  };

  const getCommunicationStyle = () => {
    const styleMap: { [key: string]: string } = {
      'emocional_inspirador': 'Emocional e Inspirador',
      'tecnico_didatico': 'Técnico e Didático',
      'humanizado_proximo': 'Humanizado e Próximo',
      'direto_objetivo': 'Direto e Objetivo'
    };
    return styleMap[state.communicationStyle] || 'Não informado';
  };

  const getMainObjective = () => {
    if (state.clinicType === 'clinica_medica') {
      const objectiveMap: { [key: string]: string } = {
        'autoridade_medica': 'Aumentar autoridade médica',
        'escalar_consultorio': 'Escalar consultório',
        'fidelizar_pacientes': 'Melhorar retenção',
        'diferenciar_mercado': 'Diferenciar no mercado'
      };
      return objectiveMap[state.medicalObjective] || 'Não informado';
    } else {
      const objectiveMap: { [key: string]: string } = {
        'atrair_leads': 'Atrair leads qualificados',
        'aumentar_recorrencia': 'Aumentar recorrência',
        'elevar_ticket': 'Aumentar ticket médio',
        'autoridade_regiao': 'Ser referência na região'
      };
      return objectiveMap[state.aestheticObjective] || 'Não informado';
    }
  };

  const clinicInfo = getClinicTypeInfo();

  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground mb-1">
            📊 Diagnóstico da Clínica
          </h2>
          <p className="text-foreground/60 text-lg">
            Análise completa do perfil e situação atual
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Perfil da Clínica */}
        <Card className={`aurora-glass ${clinicInfo.borderColor} bg-gradient-to-br ${clinicInfo.color}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Perfil do Negócio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">
                {clinicInfo.type}
              </p>
              <Badge variant="secondary" className="text-xs">
                {clinicInfo.icon} {state.clinicType === 'clinica_medica' ? 'Médica' : 'Estética'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Situação Financeira */}
        <Card className="aurora-glass border-green-500/30 bg-gradient-to-br from-green-500/20 to-emerald-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Situação Financeira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-bold text-foreground">
                {getRevenueInfo()}
              </p>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span className="text-xs text-green-400">
                  Meta: {getGoalInfo()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objetivo Principal */}
        <Card className="aurora-glass border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Objetivo Principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-bold text-foreground leading-tight">
                {getMainObjective()}
              </p>
              <Badge variant="outline" className="text-xs text-orange-400 border-orange-400/30">
                Prioridade Alta
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Comunicação */}
        <Card className="aurora-glass border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Estilo de Comunicação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-bold text-foreground leading-tight">
                {getCommunicationStyle()}
              </p>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-purple-400" />
                <span className="text-xs text-purple-400">
                  {state.contentFrequency || 'Não definido'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card de Análise da IA */}
      <Card className="aurora-glass border-aurora-electric-purple/50 bg-gradient-to-br from-gray-900/60 to-gray-800/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Brain className="h-5 w-5 text-aurora-electric-purple" />
            🧠 Análise Estratégica do Consultor Fluida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderAIDiagnosticSummary()}
            <div className="pt-3 border-t border-aurora-electric-purple/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-foreground/60">
                  Análise completa disponível no relatório abaixo
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DiagnosticCards;
