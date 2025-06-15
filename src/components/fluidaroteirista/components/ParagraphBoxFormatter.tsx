
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ParagraphBlock {
  titulo?: string;
  conteudo: string;
}

interface ParagraphBoxFormatterProps {
  blocks: ParagraphBlock[];
}

/**
 * Mostra cada bloco/parágrafo do roteiro em um card separado, visual “clean”
 */
const ParagraphBoxFormatter: React.FC<ParagraphBoxFormatterProps> = ({ blocks }) => {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5">
      {blocks.map((block, idx) => (
        <Card
          key={idx}
          className="bg-gradient-to-br from-aurora-neon-blue/10 via-aurora-electric-purple/10 to-slate-900/30 border border-aurora-neon-blue/20 aurora-glass shadow-lg"
        >
          <CardContent className="py-6 px-6 flex flex-col items-center text-center">
            {block.titulo && (
              <h3 className="text-lg font-bold text-aurora-electric-purple drop-shadow mb-2 aurora-heading">
                {block.titulo}
              </h3>
            )}
            <div className="text-base md:text-lg text-slate-100 leading-relaxed font-medium whitespace-pre-line aurora-body">
              {block.conteudo
                .split(/\n{2,}/)
                .map((paragraph, pidx) => (
                  <p key={pidx} className="mb-4 last:mb-0">{paragraph}</p>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ParagraphBoxFormatter;
