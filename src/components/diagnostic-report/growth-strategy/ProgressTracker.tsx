
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ProgressTracker: React.FC = () => {
  return (
    <Card className="aurora-glass border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Progresso da Estratégia</h4>
          <Badge variant="outline" className="border-aurora-sage/30 text-aurora-sage">
            0% Concluído
          </Badge>
        </div>
        
        <div className="w-full bg-foreground/10 rounded-full h-3 mb-3">
          <div 
            className="bg-aurora-sage h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: '0%' }}
          />
        </div>
        
        <p className="text-sm text-foreground/60">
          Complete as ações semanais para acelerar o crescimento da sua clínica
        </p>
        
        {/* Week progress indicators */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[1, 2, 3, 4].map((week) => (
            <div key={week} className="text-center">
              <div className="w-full bg-foreground/10 rounded-full h-2 mb-1">
                <div className="bg-foreground/20 h-2 rounded-full" style={{ width: '0%' }} />
              </div>
              <span className="text-xs text-foreground/60">Sem. {week}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
