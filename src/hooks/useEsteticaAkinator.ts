
import { useState, useMemo } from "react";
import { Equipment } from "@/types/equipment";

// MATRIZ de sintomas/mapas para palavras-chave e pesos nos campos dos equipamentos reais
const SINTOMAS_REAIS = [
  {
    sintoma: "flacidez_facial",
    chaves: [
      { palavra: "flacidez facial", peso: 12 },
      { palavra: "facial", peso: 9 },
      { palavra: "rosto", peso: 8 },
      { palavra: "lifting", peso: 7 },
      { palavra: "firmeza", peso: 7 },
    ],
  },
  {
    sintoma: "flacidez_corporal",
    chaves: [
      { palavra: "flacidez corporal", peso: 12 },
      { palavra: "corporal", peso: 9 },
      { palavra: "corpo", peso: 8 },
      { palavra: "tonificação", peso: 7 },
    ],
  },
  {
    sintoma: "gordura_localizada",
    chaves: [
      { palavra: "gordura localizada", peso: 12 },
      { palavra: "gordura", peso: 9 },
      { palavra: "lipólise", peso: 8 },
      { palavra: "redução de gordura", peso: 7 },
    ],
  },
  {
    sintoma: "melasma_manchas",
    chaves: [
      { palavra: "melasma", peso: 12 },
      { palavra: "manchas", peso: 9 },
      { palavra: "hiperpigmentação", peso: 7 },
    ],
  },
  // Adapte e expanda para novas perguntas/áreas!
];

// Banco simples de perguntas (pode ser expandido)
export const AKINATOR_QUESTIONS = [
  {
    context: "flacidez_facial",
    text: "Você percebe sinais de flacidez no rosto?",
    options: ["Sim", "Um pouco", "Não"],
  },
  {
    context: "flacidez_corporal",
    text: "Você sente flacidez no corpo?",
    options: ["Sim", "Um pouco", "Não"],
  },
  {
    context: "gordura_localizada",
    text: "Tem gordura localizada que te incomoda?",
    options: ["Sim", "Não"],
  },
  {
    context: "melasma_manchas",
    text: "Possui manchas ou melasma no rosto?",
    options: ["Sim", "Não"],
  },
];

function sanitize(str: string = "") {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Algoritmo dinâmico: Pontua para cada equipamento do banco de acordo com a correspondência sintoma ↔️ campos descritivos
function calcularPontuacoes(intl_respostas: Record<string, string>, equipamentos: Equipment[]) {
  const scores: Record<string, number> = {};
  // Para cada resposta, avalia nos campos do equipamento
  Object.entries(intl_respostas).forEach(([sintoma, resposta]) => {
    // Skip se não respondeu
    if (!resposta) return;
    // Baixo peso se "Não"
    const isNegativa = resposta.toLowerCase().includes("não");
    const sintomaInfo = SINTOMAS_REAIS.find((s) => s.sintoma === sintoma);
    if (!sintomaInfo) return;

    equipamentos.forEach((eq) => {
      let eqScore = 0;
      // Busca nas propriedades principais: indicacoes, beneficios, tecnologia, nome, area_aplicacao, etc.
      const searchSpace = [
        ...(Array.isArray(eq.indicacoes) ? eq.indicacoes : [eq.indicacoes]),
        eq.nome,
        eq.tecnologia,
        eq.beneficios,
        eq.diferenciais,
        eq.descricao || "",
        ...(eq.area_aplicacao || [])
      ]
        .map(sanitize)
        .join(" ");
      // Para cada palavra-chave desse sintoma, soma se encontrar no equipamento
      sintomaInfo.chaves.forEach(({ palavra, peso }) => {
        if (searchSpace.includes(sanitize(palavra))) {
          eqScore += peso;
        }
      });
      // Penalização se negativa
      if (isNegativa && eqScore > 0) eqScore = eqScore * -0.4;
      if (!scores[eq.id]) scores[eq.id] = 0;
      scores[eq.id] += eqScore;
    });
  });
  // Contraindicação: se encontrar contexto negativo de resposta e nome do eq, zera o score
  equipamentos.forEach((eq) => {
    // Exemplo: usuário diz que não quer "laser" → penaliza equipamentos com laser
    Object.entries(intl_respostas).forEach(([sintoma, resposta]) => {
      if (resposta.toLowerCase().includes("não") && sanitize(eq.nome).includes(sanitize(sintoma.split("_")[0]))) {
        scores[eq.id] = (scores[eq.id] || 0) * 0.3;
      }
    });
  });
  return scores;
}

export function useEsteticaAkinator(equipamentos: Equipment[]) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<{ context: string; answer: string }[]>([]);
  const [ended, setEnded] = useState(false);

  // Cálculo do ranking com dados reais
  const scores = useMemo(() => calcularPontuacoes(responses, equipamentos), [responses, equipamentos]);
  const ranking = useMemo(() => {
    return equipamentos
      .filter((eq) => eq.akinator_enabled && eq.ativo)
      .map((eq) => ({
        ...eq,
        _score: scores[eq.id] || 0,
      }))
      .sort((a, b) => (b._score || 0) - (a._score || 0));
  }, [equipamentos, scores]);

  // Pergunta não respondida
  const nextQuestion = useMemo(() => {
    for (let q of AKINATOR_QUESTIONS) {
      if (!responses[q.context]) return q;
    }
    return null;
  }, [responses]);

  // Nova confiança baseada no ranking real
  const confidence = useMemo(() => {
    if (!ranking.length) return 0;
    const top = ranking[0]?._score || 0;
    const sum = ranking.reduce((acc, r) => acc + Math.abs(r._score || 0), 0);
    if (sum === 0) return 0;
    return Math.round(100 * top / sum);
  }, [ranking]);

  function answer(context: string, answer: string) {
    setResponses((prev) => ({ ...prev, [context]: answer }));
    setHistory((prev) => [...prev, { context, answer }]);
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
    responses,
    history,
    nextQuestion,
    ranking,
    confidence,
    ended,
    answer,
    reset,
  };
}
