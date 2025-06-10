
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const QuickTipsSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="aurora-card border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            💡 Dicas Rápidas do Consultor Fluida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="text-white font-medium mb-2">📊 Métricas Importantes</h4>
              <p className="text-white/70 text-sm">
                Acompanhe sempre: Taxa de conversão de leads, CAC (Custo de Aquisição de Cliente) e ROI das campanhas.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <h4 className="text-white font-medium mb-2">🎯 Foco em Resultados</h4>
              <p className="text-white/70 text-sm">
                Defina metas mensais claras e revise semanalmente o progresso das suas estratégias de marketing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickTipsSection;
