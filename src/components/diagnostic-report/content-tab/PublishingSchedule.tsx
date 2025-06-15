
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const FULL_WEEK_DAYS = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo"
];

export const PublishingSchedule: React.FC = () => {
  return (
    <Card className="aurora-card border-aurora-deep-purple/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calendar className="h-5 w-5 text-aurora-deep-purple" />
          Cronograma Sugerido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-7 gap-2 text-center">
          {FULL_WEEK_DAYS.map((day, index) => (
            <div key={day} className="p-2">
              <div className="text-xs font-medium text-foreground/60 mb-2">{day}</div>
              <div className="space-y-1">
                {index % 2 === 0 && (
                  <div className="p-1 bg-aurora-electric-purple/20 rounded text-xs text-aurora-electric-purple">
                    Post
                  </div>
                )}
                {index % 3 === 0 && (
                  <div className="p-1 bg-aurora-sage/20 rounded text-xs text-aurora-sage">
                    Stories
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 aurora-glass rounded-lg">
          <p className="text-sm text-foreground/80">
            <strong>Frequência recomendada:</strong> 3-4 posts por semana + stories diários
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
