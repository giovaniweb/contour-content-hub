
import React from "react";
import ScriptSlideCard from "./ScriptSlideCard";

interface ParagraphBlock {
  titulo?: string;
  conteudo: string;
}

interface ParagraphBoxFormatterProps {
  blocks: ParagraphBlock[];
}

/**
 * Mostra cada bloco/parágrafo do roteiro em um card separado,
 * com visual idêntico ao slide do carrossel/stories 10x.
 */
const ParagraphBoxFormatter: React.FC<ParagraphBoxFormatterProps> = ({ blocks }) => {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-7">
      {blocks.map((block, idx) => (
        <ScriptSlideCard
          key={idx}
          index={idx}
          total={blocks.length}
          titulo={block.titulo}
          conteudo={block.conteudo}
        />
      ))}
    </div>
  );
};

export default ParagraphBoxFormatter;
