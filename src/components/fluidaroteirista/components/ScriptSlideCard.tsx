
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Exibe um bloco do roteiro com visual de 'slide', igual ao carrossel.
 */
interface ScriptSlideCardProps {
  index: number;
  total: number;
  titulo?: string;
  conteudo: string;
}

const ScriptSlideCard: React.FC<ScriptSlideCardProps> = ({ index, total, titulo, conteudo }) => {
  return (
    <Card className="border-2 border-aurora-electric-purple/60 bg-gradient-to-br from-aurora-neon-blue/10 via-aurora-electric-purple/15 to-slate-900/30 rounded-2xl aurora-glass shadow-lg transition-transform duration-200 hover:scale-105 animate-fade-in relative">
      <div className="absolute -top-5 left-6 z-10 flex items-center">
        <span className="bg-aurora-electric-purple text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg ring-2 ring-aurora-neon-blue/50 text-lg">
          {index + 1}
        </span>
        <span className="ml-2 text-xs text-aurora-electric-purple/90 font-bold">{`/ ${total}`}</span>
      </div>
      <CardContent className="py-7 px-7 flex flex-col items-center text-center min-h-[120px]">
        {titulo && (
          <h3 className="text-lg font-bold text-aurora-electric-purple drop-shadow mb-2 aurora-heading">
            {titulo}
          </h3>
        )}
        <div className="text-base md:text-lg text-slate-100 leading-relaxed font-medium whitespace-pre-line aurora-body">
          {conteudo
            .split(/\n{2,}/)
            .map((paragraph, idx) => (
              <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptSlideCard;
