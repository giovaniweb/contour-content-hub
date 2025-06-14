
import { useState, useCallback } from "react";
import { Equipment } from "@/types/equipment";

type SintomaEquipRelation = {
  sintoma: string;
  equipamentos: { id: string; score: number }[];
};

export interface AkinatorState {
  pontuacoes: Record<string, number>;
  ranking: Equipment[];
  eliminados: string[];
}

const SINTOMAS_EQUIPAMENTOS: SintomaEquipRelation[] = [
  // Exemplo de matriz para lógica inicial.
  // Melhore esta matriz para casos reais!
  {
    sintoma: "flacidez_facial",
    equipamentos: [
      { id: "hipro", score: 10 },
      { id: "ultrassom", score: 5 },
    ],
  },
  {
    sintoma: "flacidez_corporal",
    equipamentos: [
      { id: "endolaser", score: 10 },
      { id: "criolipolise", score: 5 },
    ],
  },
  {
    sintoma: "gordura_localizada",
    equipamentos: [
      { id: "criolipolise", score: 9 },
      { id: "endolaser", score: 6 },
    ],
  },
  {
    sintoma: "melasma_manchas",
    equipamentos: [
      { id: "laser", score: 10 }
    ]
  },
  // Adicione mais relações conforme evoluir o sistema
];

export function useAkinatorInferencia(equipamentos: Equipment[]) {
  const [pontuacoes, setPontuacoes] = useState<Record<string, number>>({});
  const [eliminados, setEliminados] = useState<string[]>([]);

  // Processa uma resposta -> Atualiza pontuação dos equipamentos
  const processarSintoma = useCallback(
    (sintoma: string, resposta: string) => {
      // Resposta negativa elimina equipamentos relacionados.
      if (resposta === "não" || resposta.startsWith("Não")) {
        const elim = SINTOMAS_EQUIPAMENTOS.find(
          (rel) => rel.sintoma === sintoma
        );
        if (elim) {
          setEliminados((prev) => [
            ...prev,
            ...elim.equipamentos.map((e) => e.id),
          ]);
        }
        return;
      }
      // Resposta positiva aumenta score dos relacionados.
      const relac = SINTOMAS_EQUIPAMENTOS.find((rel) => rel.sintoma === sintoma);
      if (relac) {
        setPontuacoes((prev) => {
          const next = { ...prev };
          relac.equipamentos.forEach((eq) => {
            const curr = next[eq.id] || 0;
            next[eq.id] = curr + eq.score;
          });
          return next;
        });
      }
    },
    []
  );

  // Calcula ranking considerando eliminados.
  const ranking = equipamentos
    .filter(
      (eq) =>
        !eliminados.includes(eq.id) && eq.akinator_enabled && eq.ativo
    )
    .map((eq) => ({
      ...eq,
      _akinator_score: pontuacoes[eq.id] || 0,
    }))
    .sort((a, b) => (b._akinator_score || 0) - (a._akinator_score || 0));

  return {
    pontuacoes,
    eliminados,
    ranking,
    processarSintoma,
    reset: () => {
      setPontuacoes({});
      setEliminados([]);
    },
  };
}
