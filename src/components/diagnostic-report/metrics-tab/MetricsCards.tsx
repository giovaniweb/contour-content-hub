
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, BarChart3 } from "lucide-react";

interface Metric {
  name: string;
  current: string;
  projected: string;
  growth: string;
  icon: string;
  color: string;
}

interface MetricsCardsProps {
  currentMetrics: Metric[];
  projectedMetrics: Metric[];
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ currentMetrics, projectedMetrics }) => {
  const iconMap = {
    'Target': Target,
    'BarChart3': BarChart3,
    'TrendingUp': TrendingUp,
    'TrendingDown': TrendingDown
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">📊 Métricas Principais</h3>
      
      <div className="space-y-3">
        {currentMetrics.map((metric, index) => {
          const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || BarChart3;
          const projectedMetric = projectedMetrics[index];
          
          return (
            <Card key={index} className="aurora-glass border-aurora-turquoise/30 hover:shadow-aurora-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Left side - Icon and metric name */}
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${metric.color} bg-opacity-20`}>
                      <IconComponent className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">{metric.name}</h4>
                      <p className="text-foreground/60 text-sm">Comparação atual vs projetada</p>
                    </div>
                  </div>

                  {/* Right side - Current and projected values */}
                  <div className="flex items-center gap-8">
                    {/* Current value */}
                    <div className="text-center">
                      <div className="text-sm text-foreground/60 mb-1">Atual</div>
                      <div className="text-2xl font-bold text-foreground">{metric.current}</div>
                    </div>

                    {/* Arrow */}
                    <TrendingUp className="h-5 w-5 text-green-400" />

                    {/* Projected value */}
                    <div className="text-center">
                      <div className="text-sm text-foreground/60 mb-1">Projetado</div>
                      <div className="text-2xl font-bold text-green-400">{projectedMetric.projected}</div>
                    </div>

                    {/* Growth badge */}
                    <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10 px-3 py-1">
                      {metric.growth}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
