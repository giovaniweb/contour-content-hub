
import { useState, useMemo } from "react";
import { Equipment } from "@/types/equipment";

// Relação sintoma-equipamento para lógica base.
type SintomaEquipRelation = {
  sintoma: string;
  equipamentos: { id: string; score: number }[];
};

const SINTOMAS_EQUIPAMENTOS: SintomaEquipRelation[] = [
  { sintoma: "flacidez_facial", equipamentos: [
    { id: "hipro", score: 10 }, { id: "ultrassom", score: 6 }
  ] },
  { sintoma: "flacidez_corporal", equipamentos: [
    { id: "endolaser", score: 9 }, { id: "criolipolise", score: 5 }
  ] },
  { sintoma: "gordura_localizada", equipamentos: [
    { id: "criolipolise", score: 10 }, { id: "endolaser", score: 8 }
  ] },
  { sintoma: "melasma_manchas", equipamentos: [
    { id: "laser", score: 12 }
  ] },
  // Adapte para mais relações!
];

// Banco simples de perguntas para demo.
// Na prática podem ser DEZENAS, incluindo nostalgia, idade etc.
export const AKINATOR_QUESTIONS = [
  {
    context: "flacidez_facial",
    text: "Você percebe sinais de flacidez no rosto?",
    options: ["Sim", "Um pouco", "Não"]
  },
  {
    context: "flacidez_corporal",
    text: "Você sente flacidez no corpo?",
    options: ["Sim", "Um pouco", "Não"]
  },
  {
    context: "gordura_localizada",
    text: "Tem gordura localizada que te incomoda?",
    options: ["Sim", "Não"]
  },
  {
    context: "melasma_manchas",
    text: "Possui manchas ou melasma no rosto?",
    options: ["Sim", "Não"]
  },
];

function calculateScores(responses: Record<string, string>): Record<string, number> {
  const pontuacoes: Record<string, number> = {};
  for (const sintoma in responses) {
    if (!responses[sintoma]) continue;
    const rel = SINTOMAS_EQUIPAMENTOS.find(e => e.sintoma === sintoma);
    if (!rel) continue;
    if (responses[sintoma]?.toLowerCase().includes("não")) {
      rel.equipamentos.forEach(eq => { pontuacoes[eq.id] = (pontuacoes[eq.id] || 0) - eq.score; });
    } else {
      rel.equipamentos.forEach(eq => { pontuacoes[eq.id] = (pontuacoes[eq.id] || 0) + eq.score; });
    }
  }
  return pontuacoes;
}

export function useEsteticaAkinator(equipamentos: Equipment[]) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<{ context: string; answer: string }[]>([]);
  const [ended, setEnded] = useState(false);

  // Ranking
  const scores = useMemo(() => calculateScores(responses), [responses]);
  const ranking = useMemo(() => {
    return equipamentos
      .filter(eq => eq.akinator_enabled && eq.ativo)
      .map(eq => ({
        ...eq,
        _score: scores[eq.id] || 0,
      }))
      .sort((a, b) => (b._score || 0) - (a._score || 0));
  }, [equipamentos, scores]);

  // Próxima pergunta = próxima do banco que não foi respondida
  const nextQuestion = useMemo(() => {
    for (let q of AKINATOR_QUESTIONS) {
      if (!responses[q.context]) return q;
    }
    // Se todas já estão respondidas, acabou
    return null;
  }, [responses]);

  // Confiança = pontuação do primeiro / soma das outras (+ estabilidade)
  const confidence = useMemo(() => {
    if (!ranking.length) return 0;
    const winner = ranking[0]?._score || 0;
    const sum = ranking.reduce((acc, r) => acc + Math.abs(r._score || 0), 0);
    if (sum === 0) return 0;
    return Math.round(100 * winner / sum);
  }, [ranking]);

  // Handler de resposta do usuário
  function answer(context: string, answer: string) {
    setResponses(prev => ({ ...prev, [context]: answer }));
    setHistory(prev => ([ ...prev, { context, answer }]));
    // If confidência passa de 85 ou todas perguntas
    if (confidence >= 85 || Object.keys(responses).length + 1 >= AKINATOR_QUESTIONS.length) {
      setEnded(true);
    }
  }
  function reset() {
    setResponses({});
    setHistory([]);
    setEnded(false);
  }

  return {
    responses, history, nextQuestion, ranking, confidence, ended, answer, reset
  };
}
