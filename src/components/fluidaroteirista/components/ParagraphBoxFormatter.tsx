
import React from "react";

interface ParagraphBlock {
  titulo?: string;
  conteudo: string;
}

interface ParagraphBoxFormatterProps {
  blocks: ParagraphBlock[];
}

/**
 * Mostra cada bloco/parágrafo do roteiro em um layout minimalista,
 * alinhado ao estilo geral do site, sem caixas/"cards" chamativos.
 */
const ParagraphBoxFormatter: React.FC<ParagraphBoxFormatterProps> = ({ blocks }) => {
  return (
    <section className="w-full max-w-3xl mx-auto space-y-6">
      {blocks.map((block, idx) => (
        <article key={idx} className="space-y-2">
          {block.titulo && (
            <h3 className="text-lg font-semibold text-foreground/90 tracking-tight">
              {block.titulo}
            </h3>
          )}
          <div className="text-base leading-relaxed text-foreground/80">
            {block.conteudo
              .split(/\n+/)
              .map((paragraph, pIdx) => (
                <p key={pIdx} className="mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
          </div>
        </article>
      ))}
    </section>
  );
};

export default ParagraphBoxFormatter;
