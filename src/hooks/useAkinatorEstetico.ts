import { useState, useMemo } from "react";
import { Equipment } from "@/types/equipment";
import { perguntasInteligentes, PerguntaInteligente } from "@/components/mestre-da-beleza/perguntasInteligentes";

// Substituir banco de perguntas antigo pelo novo inteligente:
const PERGUNTAS: PerguntaInteligente[] = perguntasInteligentes;

// Embaralhe perguntas diferentes em cada sessão (simples):
function gerarSequenciaPerguntas() {
  // Coloque sempre as perguntas obrigatórias no início
  const obrigatorias = PERGUNTAS.filter(
    p => ["perfil_tipo", "sexo_genero", "profissional_tipo"].includes(p.id)
  );
  const restantes = PERGUNTAS.filter(
    p => !["perfil_tipo", "sexo_genero", "profissional_tipo"].includes(p.id)
  );
  for (let i = restantes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [restantes[i], restantes[j]] = [restantes[j], restantes[i]];
  }
  return [...obrigatorias, ...restantes];
}

export type Pergunta = {
  id: string;
  texto: string;
  opcoes: string[];
  contexto: string;
  tipo: "perfil" | "nostalgia" | "tecnica";
  nostalgiaValue?: number;
};

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
  // Trocar para sequência dinâmica (embaralhada por sessão)
  const [perguntasSequencia, setPerguntasSequencia] = useState<PerguntaInteligente[]>(() => gerarSequenciaPerguntas());
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [idxPergunta, setIdxPergunta] = useState(0);
  const [finalizou, setFinalizou] = useState(false);

  // Pergunta atual vinda da sequência
  const perguntaAtual = perguntasSequencia[idxPergunta] ?? null;
  
  const ranking = useMemo(
    () => calcularRanking(equipamentos, respostas),
    [equipamentos, respostas]
  );

  const idadeEstimada = useMemo(() => estimarIdade(respostas), [respostas]);

  const podeFinalizar = idxPergunta >= perguntasSequencia.length - 1;

  // Ramificação pós-resposta (perguntas com .ramifica)
  function responder(resposta: string) {
    const contexto = perguntasSequencia[idxPergunta]?.contexto;
    setRespostas(r => ({ ...r, [contexto]: resposta }));
    // Após responder, checa se precisa ramificar:
    const ramificaProx = perguntasSequencia[idxPergunta]?.ramifica?.({ ...respostas, [contexto]: resposta });
    if (ramificaProx) {
      // Descobre posição da ramificada (se tiver):
      const idxRamificada = perguntasSequencia.findIndex(q => q.id === ramificaProx);
      if (idxRamificada > idxPergunta + 1) setIdxPergunta(idxRamificada);
      else if (idxPergunta === perguntasSequencia.length - 1) setFinalizou(true);
      else setIdxPergunta(i => i + 1);
    } else {
      if (idxPergunta === perguntasSequencia.length - 1) setFinalizou(true);
      else setIdxPergunta(i => i + 1);
    }
  }

  function reset() {
    setRespostas({});
    setIdxPergunta(0);
    setFinalizou(false);
    setPerguntasSequencia(gerarSequenciaPerguntas());
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
