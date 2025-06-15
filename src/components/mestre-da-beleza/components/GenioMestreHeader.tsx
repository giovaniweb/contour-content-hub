
import React from "react";
import { Sparkles } from "lucide-react";

interface GenioMestreHeaderProps {
  step?: "intro" | "question" | "thinking" | "final";
  phrase?: string;
}

const defaultPhrases = {
  intro: "Ah... Vejo que você busca um segredo da beleza. O Gênio Fluido está pronto para revelar!",
  question: "Concentre-se... cada resposta revela um novo fragmento do seu mistério.",
  thinking: "O Gênio consulta os astros místicos... aguarde um momento!",
  final: "A resposta do além foi revelada. Eis sua visão mágica!"
};

export const GenioMestreHeader: React.FC<GenioMestreHeaderProps> = ({ step = "intro", phrase }) => (
  <div className="flex flex-col items-center gap-2 py-2">
    <div className="relative">
      <span className="animate-pulse shadow-lg crystal-pulse rounded-full p-2 bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600">
        <Sparkles className="text-white drop-shadow filter" size={44} />
      </span>
      {/* sparkles extra */}
      <span className="absolute -top-1 right-0 sparkle-animation text-pink-300 text-2xl">✨</span>
      <span className="absolute -bottom-1 left-0 sparkle-animation text-yellow-300 text-2xl">✨</span>
      <span className="absolute top-2 left-3 animate-bounce text-purple-400 text-lg">🔮</span>
    </div>
    <div className="mt-2 px-2 py-1 rounded-md bg-black/30 max-w-xl text-white text-base font-semibold text-center shadow-inner border border-purple-900/30 blur-none">
      {phrase || defaultPhrases[step]}
    </div>
  </div>
);

export default GenioMestreHeader;
