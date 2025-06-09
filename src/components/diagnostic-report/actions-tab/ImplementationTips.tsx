
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const tips = [
  {
    title: "📋 Organize as Tarefas",
    description: "Use ferramentas como Trello ou Notion para acompanhar o progresso das ações recomendadas."
  },
  {
    title: "⏰ Defina Prazos",
    description: "Estabeleça deadlines realistas e crie lembretes para cada ação planejada."
  },
  {
    title: "📊 Monitore Resultados",
    description: "Acompanhe métricas como engajamento, alcance e conversões para medir o sucesso."
  },
  {
    title: "🔄 Ajuste a Estratégia",
    description: "Revise e adapte as ações com base nos resultados obtidos e feedback dos pacientes."
  }
];

export const ImplementationTips: React.FC = () => {
  return (
    <Card className="aurora-card border-aurora-deep-purple/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Star className="h-5 w-5 text-aurora-deep-purple" />
          Dicas de Implementação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
            <div key={index} className="p-4 aurora-glass rounded-lg">
              <h4 className="font-medium text-foreground mb-2">{tip.title}</h4>
              <p className="text-sm text-foreground/80">{tip.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
