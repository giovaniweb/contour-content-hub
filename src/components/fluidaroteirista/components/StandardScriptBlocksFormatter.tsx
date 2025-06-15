
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, AudioWaveform } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";

interface Block {
  titulo: string;
  conteudo: string;
}

interface StandardScriptBlocksFormatterProps {
  blocks: Block[];
  estimatedTime: number;
  wordCount: number;
  fullText: string;
}

const ICONS: Record<string, string> = {
  Ganho: "🎯",
  Desenvolvimento: "💡",
  Solução: "🔬",
  CTA: "🚀",
};

const StandardScriptBlocksFormatter: React.FC<StandardScriptBlocksFormatterProps> = ({
  blocks,
  estimatedTime,
  wordCount,
  fullText,
}) => (
  <Card className="aurora-glass border border-cyan-500/30 relative overflow-hidden shadow-xl w-full">
    <div className="absolute inset-0 bg-gradient-to-br from-aurora-electric-purple/10 via-aurora-neon-blue/10 to-aurora-soft-pink/5 opacity-40 pointer-events-none" />
    <CardHeader className="flex flex-col items-center z-10 relative pb-2">
      <div className="flex items-center gap-3 justify-center mb-2">
        <MessageSquare className="h-8 w-8 text-aurora-electric-purple aurora-glow" />
        <CardTitle className="text-cyan-300 text-center text-2xl drop-shadow aurora-heading">
          Fala do Roteiro
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
          <h3 className="text-aurora-electric-purple text-lg font-bold tracking-wide aurora-heading mb-1">
            🎬 Fala do Roteiro
          </h3>
        </div>
        <div className="w-full border-t border-aurora-electric-purple/20 my-2" />
        {/* Bloco central com cada seção separada */}
        <div className="relative bg-slate-900/80 px-0 py-6 rounded-2xl shadow-inner aurora-glass border-aurora-neon-blue/10 min-h-[180px] w-full max-w-2xl mx-auto flex flex-col gap-8">
          {blocks.map((block, i) => (
            <div key={i} className="mb-6 last:mb-0 p-0 sm:p-5 rounded-xl">
              {block.titulo && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-lg aurora-heading text-aurora-electric-purple">
                    {ICONS[block.titulo] || ""} {block.titulo}
                  </span>
                  <div className="flex-1 border-t border-aurora-neon-blue/20 ml-2" />
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
                  rounded-lg
                  bg-slate-800/30
                  border border-aurora-neon-blue/10
                  shadow
                  px-5 py-4
                  transition
                  duration-200
                  hover:bg-aurora-neon-blue/10
                  "
                style={{
                  marginBottom: 0,
                }}
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
          className="flex items-center gap-1 px-5 py-2 rounded-lg bg-aurora-electric-purple/90 hover:bg-aurora-emerald/80 text-white font-semibold shadow transition-all text-base disabled:opacity-60"
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

export default StandardScriptBlocksFormatter;
