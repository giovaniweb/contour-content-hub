
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
  const estimateSeconds = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 2.5)); // ~150 wpm => 2.5 wps
  };

  return (
    <section className="w-full max-w-3xl mx-auto space-y-5">
      {blocks.map((block, idx) => {
        const secs = estimateSeconds(block.conteudo || "");
        const label = `[${(block.titulo || 'Bloco')} • ${secs} segundos]`;
        return (
          <article
            key={idx}
            className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-primary/10 via-background/40 to-secondary/10 p-5 shadow-sm"
          >
            <div
              className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
              aria-hidden
            />

            <header className="mb-3">
              <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-foreground/80">
                {label}
              </span>
            </header>

            <div className="text-base leading-relaxed text-foreground/80">
              {(block.conteudo || '')
                .split(/\n+/)
                .map((paragraph, pIdx) => (
                  <p key={pIdx} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default ParagraphBoxFormatter;
