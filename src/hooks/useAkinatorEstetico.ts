
import { useState, useMemo } from "react";
import { Equipment } from "@/types/equipment";

// Perguntas (lúdicas + técnicas), adaptativas:
export type Pergunta = {
  id: string;
  texto: string;
  opcoes: string[];
  contexto: string;
  tipo: "perfil" | "nostalgia" | "tecnica";
  nostalgiaValue?: number;
};

const PERGUNTAS: Pergunta[] = [
  // Exemplo: pode crescer depois
  { id: "perfil", texto: "Quem é você na estética?", opcoes: ["Cliente final", "Profissional"], contexto: "perfil", tipo: "perfil" },
  { id: "nostalgia1", texto: "Você se lembra da Copa de 2002 (Penta)?", opcoes: ["Sim", "Não"], contexto: "brasil_penta", tipo: "nostalgia", nostalgiaValue: 2002 },
  { id: "flacidez_facial", texto: "Sente flacidez ou falta de firmeza no rosto?", opcoes: ["Sim", "Não"], contexto: "flacidez_facial", tipo: "tecnica" },
  { id: "gordura_localizada", texto: "Tem gordura localizada que incomoda?", opcoes: ["Sim", "Não"], contexto: "gordura_localizada", tipo: "tecnica" },
  { id: "melasma_manchas", texto: "Possui manchas/melasma no rosto?", opcoes: ["Sim", "Não"], contexto: "melasma_manchas", tipo: "tecnica" },
  // ... pode expandir com mais depois!
];

function estimarIdade(respostas: Record<string, string>) {
  // Avaliação simplista só de exemplo para nostalgia
  if (respostas.brasil_penta === "Sim") return new Date().getFullYear() - 2002 + 7;
  return undefined;
}

function calcularRanking(equipamentos: Equipment[], respostas: Record<string, string>) {
  // Exemplo: scoring best effort simples, fácil de expandir!
  let scores: Record<string, number> = {};
  equipamentos.forEach(eq => {
    let score = 0;
    if(respostas.flacidez_facial === "Sim" && String(eq.indicacoes).toLowerCase().includes("flacidez")) score += 10;
    if(respostas.gordura_localizada === "Sim" && String(eq.indicacoes).toLowerCase().includes("gordura")) score += 7;
    if(respostas.melasma_manchas === "Sim" && String(eq.indicacoes).toLowerCase().includes("mancha")) score += 6;
    scores[eq.id] = score;
  });
  // Top result
  return equipamentos
    .filter(e => e.akinator_enabled && e.ativo)
    .map(e => ({ ...e, _score: scores[e.id] || 0 }))
    .sort((a, b) => (b._score || 0) - (a._score || 0));
}

export function useAkinatorEstetico(equipamentos: Equipment[]) {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [idxPergunta, setIdxPergunta] = useState(0);
  const [finalizou, setFinalizou] = useState(false);

  const perguntaAtual = PERGUNTAS[idxPergunta] ?? null;
  
  const ranking = useMemo(
    () => calcularRanking(equipamentos, respostas),
    [equipamentos, respostas]
  );

  const idadeEstimada = useMemo(() => estimarIdade(respostas), [respostas]);

  const podeFinalizar = idxPergunta >= PERGUNTAS.length-1;

  function responder(resposta: string) {
    const contexto = PERGUNTAS[idxPergunta].contexto;
    setRespostas(r => ({ ...r, [contexto]: resposta }));
    if (idxPergunta === PERGUNTAS.length-1) setFinalizou(true);
    else setIdxPergunta(i => i+1);
  }

  function reset() {
    setRespostas({});
    setIdxPergunta(0);
    setFinalizou(false);
  }

  return {
    perguntaAtual,
    idxPergunta,
    respostas,
    idadeEstimada,
    ranking,
    responder,
    podeFinalizar,
    finalizou,
    reset
  };
}
