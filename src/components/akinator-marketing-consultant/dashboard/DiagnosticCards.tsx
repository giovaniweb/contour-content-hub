
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, DollarSign, Target, Brain, Users } from "lucide-react";
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
  const getClinicProfile = () => {
    if (state.clinicType === 'clinica_medica') {
      const profiles = {
        'dermatologia': 'Dermatologia Estética',
        'nutrologia': 'Nutrologia Especializada',
        'ginecoestetica': 'Ginecoestética',
        'cirurgia_plastica': 'Cirurgia Plástica',
        'medicina_estetica': 'Medicina Estética',
        'outras': 'Medicina Especializada'
      };
      return profiles[state.medicalSpecialty as keyof typeof profiles] || 'Clínica Médica';
    } else {
      const profiles = {
        'corporal': 'Estética Corporal',
        'facial': 'Estética Facial',
        'ambos': 'Estética Completa',
        'depilacao': 'Depilação Especializada'
      };
      return profiles[state.aestheticFocus as keyof typeof profiles] || 'Clínica Estética';
    }
  };

  const getRevenueAnalysis = () => {
    const revenues = {
      'ate_15k': 'Faturamento Inicial - Fase de Crescimento',
      '15k_30k': 'Crescimento Consistente - Expandindo Base',
      '30k_60k': 'Faturamento Sólido - Otimizando Operações',
      'acima_60k': 'Alto Faturamento - Liderança no Mercado'
    };
    return revenues[state.currentRevenue as keyof typeof revenues] || 'Não informado';
  };

  const getMainObjective = () => {
    if (state.clinicType === 'clinica_medica') {
      const objectives = {
        'diferenciacao': 'Diferenciação no Mercado Médico',
        'escala': 'Escalar Atendimentos Médicos',
        'retencao': 'Melhorar Retenção de Pacientes',
        'autoridade': 'Construir Autoridade Médica'
      };
      return objectives[state.medicalObjective as keyof typeof objectives] || 'Objetivo não definido';
    } else {
      const objectives = {
        'mais_leads': 'Atrair Mais Leads Qualificados',
        'recorrencia': 'Aumentar Recorrência de Clientes',
        'ticket_medio': 'Aumentar Ticket Médio',
        'autoridade': 'Construir Autoridade na Região'
      };
      return objectives[state.aestheticObjective as keyof typeof objectives] || 'Objetivo não definido';
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
        📊 Diagnóstico da Clínica
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-aurora-neon-blue aurora-glass border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Building2 className="h-5 w-5 text-aurora-neon-blue" />
              Perfil do Negócio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80">{getClinicProfile()}</p>
            <p className="text-xs mt-2 text-aurora-neon-blue">
              {state.clinicType === 'clinica_medica' ? 'Clínica Médica Especializada' : 'Clínica Estética'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-aurora-emerald aurora-glass border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <DollarSign className="h-5 w-5 text-aurora-emerald" />
              Análise Financeira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80">{getRevenueAnalysis()}</p>
            <p className="text-xs mt-2 text-aurora-emerald">
              Meta: {state.revenueGoal === 'dobrar' ? 'Dobrar Faturamento' :
                      state.revenueGoal === 'crescer_50' ? 'Crescer 50%' :
                      state.revenueGoal === 'crescer_30' ? 'Crescer 30%' : 'Manter Estabilidade'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 aurora-glass border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Target className="h-5 w-5 text-red-400" />
              Objetivo Principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80">{getMainObjective()}</p>
            <Badge variant="secondary" className="mt-2 text-xs bg-red-500/20 text-red-400 border-red-500/30">
              Foco Estratégico
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-aurora-electric-purple md:col-span-2 aurora-glass border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Brain className="h-5 w-5 text-aurora-electric-purple" />
              Análise IA Personalizada
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderAIDiagnosticSummary()}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 aurora-glass border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Users className="h-5 w-5 text-orange-400" />
              Público-Alvo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80">
              {state.targetAudience ? `Público Definido: ${state.targetAudience}` : 'Público-alvo ainda não foi definido claramente'}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DiagnosticCards;
