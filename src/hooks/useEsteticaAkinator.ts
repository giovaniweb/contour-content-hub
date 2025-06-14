import { useState, useMemo } from "react";
import { Equipment } from "@/types/equipment";

// MATRIZ de sintomas/mapas para palavras-chave e pesos REALISTAS (todos campos possíveis dos equipamentos)
const SINTOMAS_MAPA = [
  {
    sintoma: "flacidez_facial",
    chaves: [
      { palavra: "flacidez facial", peso: 16 },
      { palavra: "flacidez", peso: 8 },
      { palavra: "lifting facial", peso: 15 },
      { palavra: "lifting", peso: 8 },
      { palavra: "firmeza facial", peso: 10 },
      { palavra: "firmeza", peso: 5 },
      { palavra: "contorno facial", peso: 12 },
      { palavra: "rosto", peso: 10 }
    ]
  },
  {
    sintoma: "flacidez_corporal",
    chaves: [
      { palavra: "flacidez corporal", peso: 16 },
      { palavra: "flacidez", peso: 8 },
      { palavra: "firmeza corporal", peso: 10 },
      { palavra: "tonificação", peso: 8 },
      { palavra: "corpo", peso: 10 }
    ]
  },
  {
    sintoma: "gordura_localizada",
    chaves: [
      { palavra: "gordura localizada", peso: 17 },
      { palavra: "redução de gordura", peso: 15 },
      { palavra: "queima de gordura", peso: 15 },
      { palavra: "gordura", peso: 8 },
      { palavra: "lipólise", peso: 8 },
      { palavra: "modelagem corporal", peso: 10 }
    ]
  },
  {
    sintoma: "melasma_manchas",
    chaves: [
      { palavra: "melasma", peso: 18 },
      { palavra: "manchas", peso: 14 },
      { palavra: "hiperpigmentação", peso: 12 }
    ]
  },
  // Adicione outros contextos conforme demanda...
  {
    sintoma: "musculatura",
    chaves: [
      { palavra: "tonificação muscular", peso: 18},
      { palavra: "eletroestimulação", peso: 15 },
      { palavra: "musculatura", peso: 10 },
      { palavra: "fortalecimento muscular", peso: 8 },
      { palavra: "definição muscular", peso: 14 },
      { palavra: "contração muscular", peso: 10 }
    ]
  },
  {
    sintoma: "tratamento_intimo",
    chaves: [
      { palavra: "intima", peso: 15 },
      { palavra: "tratamento íntimo", peso: 16 },
      { palavra: "rejuvenescimento íntimo", peso: 15 },
    ]
  },
  {
    sintoma: "depilacao",
    chaves: [
      { palavra: "depilação", peso: 18 },
      { palavra: "remoção de pelos", peso: 13 },
      { palavra: "fotodepilação", peso: 17 },
      { palavra: "pêlos", peso: 8 }
    ]
  }
];

// Perguntas nostálgicas
const NOSTALGIC_QUESTIONS = [
  {
    context: "tv_colosso",
    text: "Você já assistiu TV Colosso quando era criança?",
    options: ["Sim", "Não", "Nem sei o que é isso!"],
    nostalgiaValue: 1993, // Ano de estreia ~ para cálculo de idade
  },
  {
    context: "xuxa",
    text: "As músicas da Xuxa fizeram parte da sua infância/adolescência?",
    options: ["Sim", "Não", "Só um pouco"],
    nostalgiaValue: 1987,
  },
  {
    context: "video_game",
    text: "Você se lembra (ou jogou) Super Nintendo ou Mega Drive?",
    options: ["Sim", "Não", "Nunca ouvi falar"],
    nostalgiaValue: 1991,
  },
  {
    context: "brasil_penta",
    text: "Você se recorda da Copa do Mundo de 2002? (Brasil Pentacampeão!)",
    options: ["Sim", "Não", "Não lembro disso"],
    nostalgiaValue: 2002,
  },
];

// Novo banco de perguntas (maior variedade estratégica e mais diferenciais)
export const AKINATOR_QUESTIONS = [
  // Intercala lúdicas e técnicas!
  NOSTALGIC_QUESTIONS[0],
  {
    context: "flacidez_facial",
    text: "Você percebe sinais de flacidez ou falta de firmeza no rosto?",
    options: ["Sim", "Um pouco", "Não", "Não sei"],
  },
  NOSTALGIC_QUESTIONS[1],
  {
    context: "flacidez_corporal",
    text: "Você sente flacidez ou falta de firmeza no corpo?",
    options: ["Sim", "Um pouco", "Não", "Não sei"],
  },
  NOSTALGIC_QUESTIONS[2],
  {
    context: "gordura_localizada",
    text: "Gostaria de reduzir gordura localizada em alguma área do corpo?",
    options: ["Sim", "Não"],
  },
  NOSTALGIC_QUESTIONS[3],
  {
    context: "musculatura",
    text: "Você quer tonificar ou fortalecer a musculatura?",
    options: ["Sim", "Não", "Não sei"],
  },
  {
    context: "melasma_manchas",
    text: "Possui manchas, melasma ou hiperpigmentação no rosto?",
    options: ["Sim", "Não", "Não sei"],
  },
  {
    context: "depilacao",
    text: "Você busca tratamento para depilação definitiva ou fotodepilação?",
    options: ["Sim", "Não"],
  },
  {
    context: "tratamento_intimo",
    text: "Tem interesse em tratamentos íntimos para rejuvenescimento ou funcionalidade?",
    options: ["Sim", "Não"],
  },
];

// Função de limpeza de string
function sanitize(str: string = "") {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Novo algoritmo avançado: para cada resposta, pontua todos os equipamentos conforme presença das palavras-chave em todos os campos descritivos. Salva explicação por equipamento.
function calcularPontuacoes(intl_respostas: Record<string, string>, equipamentos: Equipment[]) {
  const scores: Record<string, number> = {};
  const matchExplicacao: Record<string, { fatores: Array<{chave: string, campo: string, peso: number}>; negativo?: boolean }> = {};
  
  // Campos para analisar por peso (importância para decisão)
  const CAMPO_PESOS: Record<string, number> = {
    indicacoes: 16, // maior peso!
    tecnologia: 13,
    beneficios: 12,
    diferenciais: 9,
    descricao: 5,
    area_aplicacao: 8,
    nome: 8
  };

  Object.entries(intl_respostas).forEach(([contextoSintoma, resposta]) => {
    if (!resposta) return;
    const isNegativa = resposta.toLowerCase().includes("não");
    const sintomaInfo = SINTOMAS_MAPA.find((s) => s.sintoma === contextoSintoma);
    if (!sintomaInfo) return;
    equipamentos.forEach((eq) => {
      let eqScore = 0;
      let matchFatores: Array<{chave: string, campo: string, peso: number}> = [];
      // Para cada campo relevante
      Object.entries(CAMPO_PESOS).forEach(([campo, campoPeso]) => {
        let strCampos: string[] = [];
        if (Array.isArray((eq as any)[campo])) {
          strCampos = ((eq as any)[campo] as string[]).map(sanitize);
        } else if (typeof (eq as any)[campo] === "string") {
          strCampos = [sanitize((eq as any)[campo])];
        }
        sintomaInfo.chaves.forEach(({ palavra, peso }) => {
          const palavraS = sanitize(palavra);
          const hit = strCampos.some(val => val.includes(palavraS));
          if (hit) {
            // Score = peso da palavra no sintoma * peso do campo
            const scoreFator = peso + campoPeso;
            eqScore += scoreFator;
            matchFatores.push({ chave: palavra, campo, peso: scoreFator });
          }
        });
      });
      // Penalização negativa
      if (isNegativa && eqScore > 0) {
        eqScore *= -0.5;
        matchExplicacao[eq.id] = { fatores: matchFatores, negativo: true };
      } else if (eqScore !== 0) {
        if (!matchExplicacao[eq.id]) matchExplicacao[eq.id] = { fatores: [] };
        matchExplicacao[eq.id].fatores.push(...matchFatores);
      }
      if (!scores[eq.id]) scores[eq.id] = 0;
      scores[eq.id] += eqScore;
    });
  });

  // Eliminação bruta por contexto: se área não faz sentido (fazer smart depois)
  // TODO: Expandir se desejar
  return { scores, matchExplicacao };
}

// Função auxiliar para estimar faixa etária pelas respostas nostálgicas
function inferNostalgicAge(responses: Record<string, string>) {
  // Mais respostas "Sim" em nostálgicas antigas = usuário mais velho
  let ageScore = 0;
  let count = 0;
  const currentYear = new Date().getFullYear();

  NOSTALGIC_QUESTIONS.forEach(q => {
    const val = responses[q.context];
    if (val === "Sim") {
      // Assume que a pessoa lembra desse evento com no mínimo 7 anos na época
      const estimatedBirth = q.nostalgiaValue - 7;
      const edad = currentYear - estimatedBirth;
      ageScore += edad;
      count++;
    }
    if (val === "Nem sei o que é isso!" || val === "Nunca ouvi falar" || val === "Não lembro disso") {
      // Assume pessoa mais nova (17 anos para trás)
      const minAge = currentYear - (q.nostalgiaValue + 15);
      ageScore += minAge;
      count++;
    }
  });

  if (count === 0) return null;
  return Math.round(ageScore / count);
}

export function useEsteticaAkinator(equipamentos: Equipment[]) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<{ context: string; answer: string }[]>([]);
  const [ended, setEnded] = useState(false);

  // Cálculo do ranking com explicação
  const { scores, matchExplicacao } = useMemo(() => calcularPontuacoes(responses, equipamentos), [responses, equipamentos]);

  const ranking = useMemo(() => {
    return equipamentos
      .filter((eq) => eq.akinator_enabled && eq.ativo)
      .map((eq) => ({
        ...eq,
        _score: scores[eq.id] || 0,
        _explicacao: matchExplicacao[eq.id]?.fatores || [],
        _neg: matchExplicacao[eq.id]?.negativo,
      }))
      .sort((a, b) => (b._score || 0) - (a._score || 0));
  }, [equipamentos, scores, matchExplicacao]);

  // Pergunta não respondida
  const nextQuestion = useMemo(() => {
    for (let q of AKINATOR_QUESTIONS) {
      if (!responses[q.context]) return q;
    }
    return null;
  }, [responses]);

  const confidence = useMemo(() => {
    if (!ranking.length) return 0;
    const top = ranking[0]?._score || 0;
    const sum = ranking.reduce((acc, r) => acc + Math.abs(r._score || 0), 0);
    if (sum === 0) return 0;
    // Confiança relativa ~ diferença entre 1º e 2º
    if (ranking[1]) {
      const diff = top - (ranking[1]._score || 0);
      return Math.max(10, Math.round(100 * diff / sum));
    }
    return Math.round(100 * top / sum);
  }, [ranking]);

  const faixaEtaria = useMemo(
    () => inferNostalgicAge(responses), [responses]
  );

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
    explicacoes: matchExplicacao,
    faixaEtaria,
  };
}
