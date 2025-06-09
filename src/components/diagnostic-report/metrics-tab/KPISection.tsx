
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Calendar } from "lucide-react";

const iconMap = {
  Target,
  TrendingUp,
  Calendar
};

interface KPIItem {
  name: string;
  current: string;
  target: string;
  status: string;
  icon: keyof typeof iconMap;
}

interface KPISectionProps {
  kpis: KPIItem[];
}

export const KPISection: React.FC<KPISectionProps> = ({ kpis }) => {
  return (
    <Card className="aurora-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Target className="h-5 w-5 text-aurora-deep-purple" />
          KPIs Principais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => {
            const IconComponent = iconMap[kpi.icon];
            return (
              <Card key={index} className="aurora-glass border-white/10">
                <CardContent className="p-4 text-center">
                  <IconComponent className="h-6 w-6 text-aurora-deep-purple mx-auto mb-2" />
                  <h4 className="text-sm font-medium text-foreground mb-2">{kpi.name}</h4>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-foreground">{kpi.current}</div>
                    <div className="text-xs text-foreground/60">Meta: {kpi.target}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
