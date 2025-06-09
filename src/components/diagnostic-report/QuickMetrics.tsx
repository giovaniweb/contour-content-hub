
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Target, Calendar } from "lucide-react";
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';

interface QuickMetricsProps {
  state: MarketingConsultantState;
}

const QuickMetrics: React.FC<QuickMetricsProps> = ({ state }) => {
  const getCurrentRevenue = () => {
    const revenueMap = {
      'ate_15k': 'Até R$ 15.000',
      '15k_30k': 'R$ 15.000 - R$ 30.000',
      '30k_60k': 'R$ 30.000 - R$ 60.000',
      'acima_60k': 'Acima de R$ 60.000'
    };
    return revenueMap[state.currentRevenue as keyof typeof revenueMap] || 'Não informado';
  };

  const getRevenueGoal = () => {
    const goalMap = {
      'crescer_30': 'Crescer 30% em 6 meses',
      'crescer_50': 'Crescer 50% em 6 meses',
      'dobrar': 'Dobrar em 1 ano',
      'triplicar': 'Triplicar em 1 ano',
      'manter_estavel': 'Manter estabilidade'
    };
    return goalMap[state.revenueGoal as keyof typeof goalMap] || 'Não informado';
  };

  const getContentFrequency = () => {
    const frequencyMap = {
      'diario': 'Diário',
      'semanal': '3-4x por semana',
      'quinzenal': 'Quinzenal',
      'mensal': 'Mensal'
    };
    return frequencyMap[state.contentFrequency as keyof typeof frequencyMap] || 'Não definido';
  };

  const getMainChallenge = () => {
    const challengeMap = {
      'gerar_leads': 'Gerar Leads',
      'converter_vendas': 'Converter Vendas',
      'fidelizar_pacientes': 'Fidelizar Pacientes',
      'aumentar_ticket': 'Aumentar Ticket Médio',
      'melhorar_marca': 'Melhorar Marca'
    };
    return challengeMap[state.mainChallenges as keyof typeof challengeMap] || 'Não informado';
  };

  const metrics = [
    {
      title: 'Faturamento Atual',
      value: getCurrentRevenue(),
      icon: TrendingUp,
      color: 'text-aurora-electric-purple',
      bgColor: 'border-aurora-electric-purple/20'
    },
    {
      title: 'Meta de Crescimento',
      value: getRevenueGoal(),
      icon: Target,
      color: 'text-aurora-sage',
      bgColor: 'border-aurora-sage/20'
    },
    {
      title: 'Público-Alvo',
      value: state.targetAudience || 'Não definido',
      icon: Users,
      color: 'text-aurora-deep-purple',
      bgColor: 'border-aurora-deep-purple/20'
    },
    {
      title: 'Frequência de Conteúdo',
      value: getContentFrequency(),
      icon: Calendar,
      color: 'text-aurora-turquoise',
      bgColor: 'border-aurora-turquoise/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className={`aurora-card ${metric.bgColor}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground/60 mb-1">{metric.title}</p>
                <p className="text-sm font-medium text-foreground truncate">{metric.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickMetrics;
