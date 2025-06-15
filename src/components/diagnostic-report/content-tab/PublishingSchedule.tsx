
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
        {/* Grid responsivo igual ao SmartWeeklySchedule */}
        <div
          className={`
            grid gap-3 md:gap-2
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-7
            w-full
            transition-all
            mb-2
            overflow-x-auto
          `}
          style={{
            minWidth: 0,
          }}
        >
          {FULL_WEEK_DAYS.map((day, index) => (
            <div
              key={day}
              className={`
                flex flex-col gap-1 flex-1
                bg-muted rounded-md border
                border-border
                p-2 md:p-3 min-w-0
              `}
            >
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
