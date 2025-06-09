
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, Calendar, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';

interface MetricsTabProps {
  session: DiagnosticSession;
}

const MetricsTab: React.FC<MetricsTabProps> = ({ session }) => {
  // Simular métricas baseadas no perfil
  const currentMetrics = {
    followers: Math.floor(Math.random() * 5000) + 1000,
    engagement: (Math.random() * 3 + 1).toFixed(1),
    reach: Math.floor(Math.random() * 10000) + 2000,
    leads: Math.floor(Math.random() * 50) + 10
  };

  const projectedMetrics = {
    followers: Math.floor(currentMetrics.followers * 1.5),
    engagement: (parseFloat(currentMetrics.engagement) * 1.3).toFixed(1),
    reach: Math.floor(currentMetrics.reach * 2),
    leads: Math.floor(currentMetrics.leads * 2.5)
  };

  const kpis = [
    {
      name: "Taxa de Conversão",
      current: "2.5%",
      target: "4.0%",
      status: "improvement",
      icon: Target
    },
    {
      name: "Custo por Lead",
      current: "R$ 45",
      target: "R$ 30",
      status: "improvement",
      icon: TrendingUp
    },
    {
      name: "ROI Marketing",
      current: "180%",
      target: "250%",
      status: "improvement", 
      icon: TrendingUp
    },
    {
      name: "Tempo Médio de Conversão",
      current: "7 dias",
      target: "5 dias",
      status: "improvement",
      icon: Calendar
    }
  ];

  const engagementMetrics = [
    { name: "Curtidas", value: "1.2K", growth: "+15%", icon: Heart, color: "text-red-400" },
    { name: "Comentários", value: "89", growth: "+22%", icon: MessageCircle, color: "text-blue-400" },
    { name: "Compartilhamentos", value: "156", growth: "+8%", icon: Share2, color: "text-green-400" },
    { name: "Visualizações", value: "8.5K", growth: "+18%", icon: Eye, color: "text-purple-400" }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Atuais vs Projetadas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="aurora-card border-aurora-electric-purple/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5 text-aurora-electric-purple" />
              Métricas Atuais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/70">Seguidores</span>
              <span className="font-medium text-foreground">{currentMetrics.followers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/70">Taxa de Engajamento</span>
              <span className="font-medium text-foreground">{currentMetrics.engagement}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/70">Alcance Mensal</span>
              <span className="font-medium text-foreground">{currentMetrics.reach.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/70">Leads/Mês</span>
              <span className="font-medium text-foreground">{currentMetrics.leads}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-card border-aurora-sage/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-aurora-sage" />
              Projeção (6 meses)
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                Crescimento
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/70">Seguidores</span>
              <div className="text-right">
                <span className="font-medium text-foreground">{projectedMetrics.followers.toLocaleString()}</span>
                <div className="text-xs text-green-400">+{Math.floor(((projectedMetrics.followers - currentMetrics.followers) / currentMetrics.followers) * 100)}%</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/70">Taxa de Engajamento</span>
              <div className="text-right">
                <span className="font-medium text-foreground">{projectedMetrics.engagement}%</span>
                <div className="text-xs text-green-400">+30%</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/70">Alcance Mensal</span>
              <div className="text-right">
                <span className="font-medium text-foreground">{projectedMetrics.reach.toLocaleString()}</span>
                <div className="text-xs text-green-400">+100%</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/70">Leads/Mês</span>
              <div className="text-right">
                <span className="font-medium text-foreground">{projectedMetrics.leads}</span>
                <div className="text-xs text-green-400">+150%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs Principais */}
      <Card className="aurora-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-aurora-deep-purple" />
            KPIs Principais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
              <Card key={index} className="aurora-glass border-white/10">
                <CardContent className="p-4 text-center">
                  <kpi.icon className="h-6 w-6 text-aurora-deep-purple mx-auto mb-2" />
                  <h4 className="text-sm font-medium text-foreground mb-2">{kpi.name}</h4>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-foreground">{kpi.current}</div>
                    <div className="text-xs text-foreground/60">Meta: {kpi.target}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Engajamento */}
      <Card className="aurora-card border-aurora-turquoise/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Heart className="h-5 w-5 text-aurora-turquoise" />
            Engajamento (30 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {engagementMetrics.map((metric, index) => (
              <Card key={index} className="aurora-glass border-white/10">
                <CardContent className="p-4 text-center">
                  <metric.icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
                  <div className="text-lg font-bold text-foreground">{metric.value}</div>
                  <div className="text-xs text-foreground/60 mb-1">{metric.name}</div>
                  <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                    {metric.growth}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Objetivos e Metas */}
      <Card className="aurora-card border-aurora-lavender/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5 text-aurora-lavender" />
            Metas Estratégicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 aurora-glass rounded-lg">
              <h4 className="font-medium text-foreground mb-2">🎯 30 Dias</h4>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Aumentar engajamento em 20%</li>
                <li>• Gerar 50+ leads qualificados</li>
                <li>• Alcançar 2K novos seguidores</li>
              </ul>
            </div>
            <div className="p-4 aurora-glass rounded-lg">
              <h4 className="font-medium text-foreground mb-2">🚀 90 Dias</h4>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Dobrar alcance orgânico</li>
                <li>• ROI de 200%+ em marketing</li>
                <li>• 100+ consultas agendadas</li>
              </ul>
            </div>
            <div className="p-4 aurora-glass rounded-lg">
              <h4 className="font-medium text-foreground mb-2">💎 6 Meses</h4>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Top 3 na região</li>
                <li>• 10K+ seguidores engajados</li>
                <li>• 30% aumento no faturamento</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsTab;
