
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const StrategicGoals: React.FC = () => {
  return (
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
  );
};
