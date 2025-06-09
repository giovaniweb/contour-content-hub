
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp } from "lucide-react";

interface MetricsCardsProps {
  currentMetrics: {
    followers: number;
    engagement: string;
    reach: number;
    leads: number;
  };
  projectedMetrics: {
    followers: number;
    engagement: string;
    reach: number;
    leads: number;
  };
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ 
  currentMetrics, 
  projectedMetrics 
}) => {
  return (
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
  );
};
