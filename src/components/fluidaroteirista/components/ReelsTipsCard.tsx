
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, PlayCircle } from "lucide-react";

const tips = [
  "Gancho até 3s: chame MUITO a atenção rapidamente.",
  "Mostre o resultado antes do processo para criar curiosidade.",
  "Use legendas em todas as falas principais.",
  "Inclua uma chamada para ação nos 5 segundos finais.",
  "Agilidade nas trocas visuais prende mais.",
  "Evite textos longos na tela.",
  "Use músicas trendings (quando possível)."
];

const ReelsTipsCard: React.FC = () => {
  return (
    <Card className="aurora-glass border-aurora-electric-purple/30 relative overflow-hidden mt-8">
      <div className="absolute inset-0 bg-gradient-to-r from-aurora-neon-blue/10 to-aurora-emerald/5 opacity-50 pointer-events-none" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-aurora-electric-purple text-xl flex items-center gap-3 aurora-heading">
          <PlayCircle className="h-6 w-6 aurora-glow" />
          Dicas para Reels Impactantes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm relative z-10">
        <div className="flex flex-wrap gap-3">
          {tips.map((tip, i) => (
            <span
              key={i}
              className="flex items-center gap-2 px-3 py-1 bg-aurora-electric-purple/10 text-aurora-electric-purple rounded-full border border-aurora-electric-purple/20 text-xs font-medium aurora-body"
            >
              <Sparkles className="h-4 w-4" /> {tip}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReelsTipsCard;
