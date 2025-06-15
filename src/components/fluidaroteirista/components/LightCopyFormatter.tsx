
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, AudioWaveform } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";

interface Block {
  titulo: string;
  conteudo: string;
  descricao: string;
  emoji: string;
}

interface LightCopyFormatterProps {
  blocks: Block[];
  estimatedTime: number;
  wordCount: number;
  fullText: string;
}

const LightCopyFormatter: React.FC<LightCopyFormatterProps> = ({
  blocks,
  estimatedTime,
  wordCount,
  fullText,
}) => {
  return (
    <Card className="aurora-glass border border-cyan-500/30 relative overflow-hidden shadow-xl w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-aurora-electric-purple/10 via-aurora-neon-blue/10 to-aurora-soft-pink/5 opacity-40 pointer-events-none" />
      <CardHeader className="flex flex-col items-center z-10 relative pb-2">
        <div className="flex items-center gap-3 justify-center mb-2">
          <MessageSquare className="h-8 w-8 text-yellow-300 aurora-glow" />
          <CardTitle className="text-yellow-200 text-center text-2xl drop-shadow aurora-heading">
            Light Copy (Ladeira)
          </CardTitle>
        </div>
        <div className="flex gap-4 items-center justify-center mt-2">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-blue-200 font-semibold">
              ~{estimatedTime}s
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
            <AudioWaveform className="h-4 w-4 text-pink-400" />
            <span className="text-xs text-pink-200 font-semibold">Áudio</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
            <span className="font-mono text-xs text-purple-200">
              {wordCount} palavras
            </span>
          </div>
          <CopyButton
            text={fullText}
            successMessage="Roteiro copiado!"
            className="ml-2"
            position="relative"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 px-5 pb-7 relative z-10">
        <div className="relative w-full flex flex-col items-center text-center gap-6">
          <div className="w-full flex flex-col items-center gap-2">
            <h3 className="text-yellow-300 text-lg font-bold tracking-wide aurora-heading mb-1">
              ✨ Light Copy Framework por Ladeira
            </h3>
            <p className="text-xs text-yellow-100 mb-2">
              Estrutura baseada no método original de Leandro Ladeira
            </p>
          </div>
          <div className="w-full border-t border-aurora-electric-purple/20 my-2" />
          <div className="relative bg-slate-900/80 px-1 py-4 rounded-2xl shadow-inner aurora-glass border-aurora-neon-blue/10 w-full max-w-2xl mx-auto flex flex-col gap-6">
            {blocks.map((block, i) => (
              <div
                key={i}
                className="mb-5 last:mb-0 overflow-hidden p-0 sm:p-4 rounded-xl bg-gradient-to-tr from-yellow-300/10 via-white/0 to-aurora-neon-blue/5 border border-yellow-300/20 shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-lg aurora-heading text-yellow-300 drop-shadow">
                    {block.emoji}
                  </span>
                  <span className="text-lg font-semibold aurora-heading text-yellow-200">
                    {block.titulo}
                  </span>
                  <div className="flex-1 border-t border-yellow-100/10 ml-2" />
                </div>
                {block.descricao && (
                  <div className="text-xs text-yellow-100/80 mb-2 italic">
                    {block.descricao}
                  </div>
                )}
                <div
                  className="
                    text-left
                    text-slate-100
                    text-base md:text-lg
                    leading-relaxed
                    aurora-body
                    font-medium
                    whitespace-pre-line
                    rounded-md
                    px-2 py-2
                  "
                >
                  {block.conteudo
                    .split(/\n{2,}/)
                    .map((paragraph, idx) => (
                      <p key={idx} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex justify-center pt-4 gap-2">
          <button
            className="flex items-center gap-1 px-5 py-2 rounded-lg bg-yellow-500/90 hover:bg-yellow-400/90 text-white font-semibold shadow transition-all text-base disabled:opacity-60"
            disabled
            title="Funcionalidade futura"
          >
            <AudioWaveform className="h-5 w-5 animate-pulse text-white" />
            Ouvir Áudio
            <span className="ml-1 text-xs text-white/70">(em breve)</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LightCopyFormatter;
