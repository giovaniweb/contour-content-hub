
import { useState, useMemo, useCallback } from "react";
import { Equipment } from "@/types/equipment";

// Estrutura para perguntas estratégicas do Akinator
export interface PerguntaAkinator {
  id: string;
  texto: string;
  opcoes: string[];
  tipo: "eliminacao" | "psicologica" | "comportamental" | "tecnica" | "nostalgia";
  peso: number;
  criterios: {
    campo: keyof Equipment | "meta";
    valores: string[];
    elimina?: boolean;
  }[];
}

// Estado do Akinator
interface EstadoAkinator {
  equipamentosAtivos: Equipment[];
  perguntasFeitas: string[];
  respostas: Record<string, string>;
  confianca: number;
  fase: "questionando" | "tentativa" | "revelacao" | "finalizado";
  tentativas: number;
  pensando: boolean;
  explicacaoEscolha: string;
}

// Banco de perguntas estratégicas otimizado
const PERGUNTAS_AKINATOR: PerguntaAkinator[] = [
  // === PERGUNTAS DE ELIMINAÇÃO BÁSICA ===
  {
    id: "area_principal",
    texto: "Onde você imagina usando este equipamento principalmente?",
    opcoes: ["No rosto", "No corpo", "Ambos", "Não tenho certeza"],
    tipo: "eliminacao",
    peso: 10,
    criterios: [
      { campo: "area_aplicacao", valores: ["facial", "rosto"], elimina: false },
      { campo: "area_aplicacao", valores: ["corporal", "corpo"], elimina: false }
    ]
  },
  {
    id: "invasividade_comfort",
    texto: "Como você se sente sobre procedimentos invasivos?",
    opcoes: ["Prefiro nada invasivo", "Um pouco invasivo é ok", "Não me importo", "Depende do resultado"],
    tipo: "eliminacao",
    peso: 9,
    criterios: [
      { campo: "tipo_acao", valores: ["Não invasivo"], elimina: false },
      { campo: "tipo_acao", valores: ["Minimante invasivo"], elimina: false }
    ]
  },
  {
    id: "flacidez_concern",
    texto: "A flacidez é uma preocupação para você?",
    opcoes: ["Sim, muito", "Um pouco", "Não muito", "Não é problema"],
    tipo: "tecnica",
    peso: 9,
    criterios: [
      { campo: "indicacoes", valores: ["flacidez", "firmeza", "lifting"], elimina: false }
    ]
  },
  {
    id: "gordura_localizada",
    texto: "Tem alguma 'gordurinha' que te incomoda?",
    opcoes: ["Sim, bastante", "Um pouco", "Quase nada", "Não tenho"],
    tipo: "tecnica",
    peso: 9,
    criterios: [
      { campo: "indicacoes", valores: ["gordura", "lipólise", "redução"], elimina: false }
    ]
  },
  {
    id: "manchas_pigmentacao",
    texto: "Manchas ou descoloração na pele te incomodam?",
    opcoes: ["Sim, muito", "Algumas manchas", "Poucas", "Não tenho"],
    tipo: "tecnica",
    peso: 9,
    criterios: [
      { campo: "indicacoes", valores: ["mancha", "melasma", "pigmentação"], elimina: false }
    ]
  },
  {
    id: "tecnologia_preferencia",
    texto: "Que tipo de tecnologia mais te atrai?",
    opcoes: ["Laser e luz", "Radiofrequência", "Ultrassom", "Qualquer uma"],
    tipo: "tecnica",
    peso: 8,
    criterios: [
      { campo: "tecnologia", valores: ["laser", "IPL"], elimina: false },
      { campo: "tecnologia", valores: ["radiofrequência", "RF"], elimina: false },
      { campo: "tecnologia", valores: ["ultrassom", "HIFU"], elimina: false }
    ]
  },

  // === PERGUNTAS PSICOLÓGICAS ===
  {
    id: "espelho_manha",
    texto: "Quando se olha no espelho de manhã...",
    opcoes: ["Sinto que preciso melhorar algo", "Me sinto bem", "Evito me olhar muito", "Analiso cada detalhe"],
    tipo: "psicologica",
    peso: 7,
    criterios: [
      { campo: "meta", valores: ["autoestima", "melhoria"], elimina: false }
    ]
  },
  {
    id: "idade_aparencia",
    texto: "Como se sente em relação à sua idade atual?",
    opcoes: ["Quero parecer mais jovem", "Estou ok com minha idade", "Idade não importa", "Quero envelhecer bem"],
    tipo: "psicologica",
    peso: 7,
    criterios: [
      { campo: "indicacoes", valores: ["rejuvenescimento", "anti-aging"], elimina: false }
    ]
  },
  {
    id: "exercicio_relacao",
    texto: "Qual sua relação com exercícios físicos?",
    opcoes: ["Pratico regularmente", "Às vezes", "Evito", "Quero complementar resultados"],
    tipo: "comportamental",
    peso: 6,
    criterios: [
      { campo: "meta", valores: ["corporal", "tonificacao"], elimina: false }
    ]
  },

  // === PERGUNTAS NOSTÁLGICAS ===
  {
    id: "novela_dancinha",
    texto: "Lembra das 'dancinhas' de novela dos anos 90?",
    opcoes: ["Sim, dancei muito!", "Lembro vagamente", "Não lembro", "Que dancinhas?"],
    tipo: "nostalgia",
    peso: 5,
    criterios: [
      { campo: "meta", valores: ["idade_35_45"], elimina: false }
    ]
  },
  {
    id: "orkut_memories",
    texto: "Teve Orkut ou Fotolog?",
    opcoes: ["Tive os dois!", "Só Orkut", "Só Fotolog", "Não tive"],
    tipo: "nostalgia",
    peso: 5,
    criterios: [
      { campo: "meta", valores: ["idade_25_35"], elimina: false }
    ]
  },

  // === PERGUNTAS ESPECÍFICAS TÉCNICAS ===
  {
    id: "musculo_tonus",
    texto: "Como avalia o tônus muscular do seu corpo?",
    opcoes: ["Muito flácido", "Pouco tônus", "Razoável", "Bem tonificado"],
    tipo: "tecnica",
    peso: 8,
    criterios: [
      { campo: "indicacoes", valores: ["tonificação", "músculo", "fortalecimento"], elimina: false }
    ]
  },
  {
    id: "tempo_resultado",
    texto: "Qual sua expectativa sobre resultados?",
    opcoes: ["Quero resultados rápidos", "Posso esperar", "Resultados graduais ok", "Não tenho pressa"],
    tipo: "comportamental",
    peso: 6,
    criterios: [
      { campo: "meta", valores: ["rapido", "imediato"], elimina: false }
    ]
  },
  {
    id: "investimento_disposicao",
    texto: "Como vê investimento em estética?",
    opcoes: ["Prioridade máxima", "Importante mas com limites", "Gasto ocasional", "Evito gastos"],
    tipo: "comportamental",
    peso: 6,
    criterios: [
      { campo: "nivel_investimento", valores: ["Alto", "Médio", "Baixo"], elimina: false }
    ]
  },
  {
    id: "profissao_aparencia",
    texto: "Sua profissão exige boa aparência?",
    opcoes: ["Sim, é fundamental", "Um pouco", "Não muito", "Não interfere"],
    tipo: "comportamental",
    peso: 5,
    criterios: [
      { campo: "meta", valores: ["profissional", "aparência"], elimina: false }
    ]
  },
  {
    id: "sessoes_preferencia",
    texto: "Qual frequência de sessões prefere?",
    opcoes: ["Poucas sessões intensas", "Muitas sessões suaves", "Depende do resultado", "Uma sessão só"],
    tipo: "comportamental",
    peso: 6,
    criterios: [
      { campo: "meta", valores: ["intensivo", "suave"], elimina: false }
    ]
  },
  {
    id: "dor_tolerancia",
    texto: "Como é sua tolerância à dor/desconforto?",
    opcoes: ["Muito baixa", "Baixa", "Média", "Alta"],
    tipo: "tecnica",
    peso: 7,
    criterios: [
      { campo: "tipo_acao", valores: ["Não invasivo"], elimina: false }
    ]
  }
];

// Frases mágicas do Akinator
const FRASES_PENSANDO = [
  "Hmm... sua energia está me revelando segredos... 🔮",
  "Estou vendo algo interessante em sua aura... ✨", 
  "As estrelas estão se alinhando para mim... ⭐",
  "Posso sentir suas intenções mais profundas... 💫",
  "Sua essência está sussurrando respostas... 🌟",
  "Algo está ficando cristalino... 💎",
  "Seu desejo verdadeiro está emergindo... 🌙",
  "Os ventos cósmicos trazem clareza... 🌌"
];

const FRASES_CONFIANCA = {
  baixa: ["Ainda estou decifrando seus mistérios...", "Preciso de mais pistas da sua alma...", "Algo ainda me escapa..."],
  media: ["Estou chegando perto da verdade...", "Sua essência está se revelando...", "Quase posso tocar sua escolha..."],
  alta: ["Já vejo claramente quem você é!", "Descobri o segredo do seu coração!", "Sua escolha está nua diante de mim!"]
};

export function useAkinatorMagico(equipamentos: Equipment[]) {
  const [estado, setEstado] = useState<EstadoAkinator>({
    equipamentosAtivos: equipamentos.filter(eq => eq.akinator_enabled && eq.ativo),
    perguntasFeitas: [],
    respostas: {},
    confianca: 0,
    fase: "questionando",
    tentativas: 0,
    pensando: false,
    explicacaoEscolha: ""
  });

  // Algoritmo para calcular entropia e escolher melhor pergunta
  const calcularEntropia = useCallback((equipamentosRestantes: Equipment[], pergunta: PerguntaAkinator) => {
    if (equipamentosRestantes.length <= 1) return 0;
    
    let entropia = 0;
    const total = equipamentosRestantes.length;
    
    pergunta.opcoes.forEach(opcao => {
      let equipamentosFiltrados = equipamentosRestantes.filter(eq => {
        return pergunta.criterios.some(criterio => {
          const valor = eq[criterio.campo as keyof Equipment];
          
          if (Array.isArray(valor)) {
            return criterio.valores.some(cv => 
              valor.some(v => String(v).toLowerCase().includes(cv.toLowerCase()))
            );
          }
          
          return criterio.valores.some(cv => 
            String(valor).toLowerCase().includes(cv.toLowerCase())
          );
        });
      });
      
      const proporcao = equipamentosFiltrados.length / total;
      if (proporcao > 0 && proporcao < 1) {
        entropia -= proporcao * Math.log2(proporcao) + (1 - proporcao) * Math.log2(1 - proporcao);
      }
    });
    
    return entropia * pergunta.peso;
  }, []);

  // Escolher próxima pergunta baseada em entropia
  const proximaPergunta = useMemo(() => {
    if (estado.fase !== "questionando") return null;
    
    const perguntasDisponiveis = PERGUNTAS_AKINATOR.filter(
      p => !estado.perguntasFeitas.includes(p.id)
    );
    
    if (perguntasDisponiveis.length === 0) return null;
    
    // Se temos poucos equipamentos, priorizar perguntas técnicas
    if (estado.equipamentosAtivos.length <= 5) {
      const perguntasTecnicas = perguntasDisponiveis.filter(p => p.tipo === "tecnica");
      if (perguntasTecnicas.length > 0) {
        return perguntasTecnicas.sort((a, b) => b.peso - a.peso)[0];
      }
    }
    
    // Calcular melhor pergunta por entropia
    let melhorPergunta = perguntasDisponiveis[0];
    let melhorEntropia = calcularEntropia(estado.equipamentosAtivos, melhorPergunta);
    
    perguntasDisponiveis.forEach(pergunta => {
      const entropia = calcularEntropia(estado.equipamentosAtivos, pergunta);
      if (entropia > melhorEntropia) {
        melhorEntropia = entropia;
        melhorPergunta = pergunta;
      }
    });
    
    return melhorPergunta;
  }, [estado.perguntasFeitas, estado.equipamentosAtivos, estado.fase, calcularEntropia]);

  // Calcular confiança baseada na eliminação
  const confiancaCalculada = useMemo(() => {
    const total = equipamentos.filter(eq => eq.akinator_enabled && eq.ativo).length;
    const restantes = estado.equipamentosAtivos.length;
    
    if (restantes <= 1) return 95;
    if (restantes <= 2) return 85;
    if (restantes <= 3) return 75;
    if (restantes <= 5) return 65;
    if (restantes <= 8) return 50;
    
    return Math.max(15, Math.round((total - restantes) / total * 100));
  }, [estado.equipamentosAtivos.length, equipamentos]);

  // Gerar explicação da escolha
  const gerarExplicacao = useCallback((equipamento: Equipment, respostas: Record<string, string>) => {
    const pontos = [];
    
    // Analisar respostas para criar explicação personalizada
    if (respostas.area_principal?.includes("rosto") && equipamento.area_aplicacao?.includes("facial")) {
      pontos.push("você mencionou foco no rosto");
    }
    if (respostas.area_principal?.includes("corpo") && equipamento.area_aplicacao?.includes("corporal")) {
      pontos.push("você indicou interesse no corpo");
    }
    if (respostas.flacidez_concern?.includes("Sim") && equipamento.indicacoes?.includes("flacidez")) {
      pontos.push("sua preocupação com flacidez");
    }
    if (respostas.gordura_localizada?.includes("Sim") && equipamento.indicacoes?.includes("gordura")) {
      pontos.push("seu interesse em redução de gordura");
    }
    if (respostas.manchas_pigmentacao?.includes("Sim") && equipamento.indicacoes?.includes("mancha")) {
      pontos.push("suas questões com pigmentação");
    }
    
    if (pontos.length === 0) {
      return "Através da análise mágica das suas respostas, pude detectar que este equipamento ressoa perfeitamente com sua energia!";
    }
    
    return `Detectei através de ${pontos.join(", ")} que este é exatamente o equipamento que sua alma busca!`;
  }, []);

  // Responder pergunta com eliminação progressiva
  const responder = useCallback(async (resposta: string) => {
    if (!proximaPergunta) return;
    
    setEstado(prev => ({ ...prev, pensando: true }));
    
    // Simular "pensamento" do Akinator
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const novasRespostas = { ...estado.respostas, [proximaPergunta.id]: resposta };
    
    // Filtrar equipamentos baseado na resposta
    let equipamentosFiltrados = estado.equipamentosAtivos.filter(eq => {
      return proximaPergunta.criterios.some(criterio => {
        const valor = eq[criterio.campo as keyof Equipment];
        const valorStr = Array.isArray(valor) ? valor.join(" ") : String(valor);
        
        const match = criterio.valores.some(cv => 
          valorStr.toLowerCase().includes(cv.toLowerCase())
        );
        
        // Se a resposta corresponde ao critério, manter equipamento
        const respostaMatch = criterio.valores.some(cv => 
          resposta.toLowerCase().includes(cv.toLowerCase())
        );
        
        return respostaMatch ? match : !match;
      });
    });
    
    // Se filtrou demais, usar algoritmo de backup
    if (equipamentosFiltrados.length === 0) {
      equipamentosFiltrados = estado.equipamentosAtivos.slice(0, Math.max(1, Math.floor(estado.equipamentosAtivos.length / 2)));
    }
    
    const novaConfianca = confiancaCalculada;
    const novasFeitasIds = [...estado.perguntasFeitas, proximaPergunta.id];
    
    // Determinar próxima fase
    let novaFase: "questionando" | "tentativa" | "revelacao" = "questionando";
    if (novaConfianca >= 75 || equipamentosFiltrados.length <= 1 || novasFeitasIds.length >= 10) {
      novaFase = "tentativa";
    }
    
    setEstado(prev => ({
      ...prev,
      equipamentosAtivos: equipamentosFiltrados,
      respostas: novasRespostas,
      perguntasFeitas: novasFeitasIds,
      confianca: novaConfianca,
      pensando: false,
      fase: novaFase
    }));
  }, [proximaPergunta, estado, confiancaCalculada]);

  // Fazer tentativa de adivinhação
  const fazerTentativa = useCallback(() => {
    const equipamentoEscolhido = estado.equipamentosAtivos[0];
    const explicacao = gerarExplicacao(equipamentoEscolhido, estado.respostas);
    
    setEstado(prev => ({
      ...prev,
      fase: "revelacao",
      tentativas: prev.tentativas + 1,
      explicacaoEscolha: explicacao
    }));
  }, [estado.equipamentosAtivos, estado.respostas, gerarExplicacao]);

  // Reset do jogo
  const reset = useCallback(() => {
    setEstado({
      equipamentosAtivos: equipamentos.filter(eq => eq.akinator_enabled && eq.ativo),
      perguntasFeitas: [],
      respostas: {},
      confianca: 0,
      fase: "questionando",
      tentativas: 0,
      pensando: false,
      explicacaoEscolha: ""
    });
  }, [equipamentos]);

  // Pegar frase mágica baseada na confiança
  const fraseMagica = useMemo(() => {
    if (estado.confianca >= 75) {
      return FRASES_CONFIANCA.alta[Math.floor(Math.random() * FRASES_CONFIANCA.alta.length)];
    } else if (estado.confianca >= 50) {
      return FRASES_CONFIANCA.media[Math.floor(Math.random() * FRASES_CONFIANCA.media.length)];
    } else {
      return FRASES_CONFIANCA.baixa[Math.floor(Math.random() * FRASES_CONFIANCA.baixa.length)];
    }
  }, [estado.confianca]);

  const frasePensando = useMemo(() => {
    return FRASES_PENSANDO[Math.floor(Math.random() * FRASES_PENSANDO.length)];
  }, [estado.perguntasFeitas.length]);

  return {
    perguntaAtual: proximaPergunta,
    equipamentosRestantes: estado.equipamentosAtivos,
    confianca: confiancaCalculada,
    fase: estado.fase,
    tentativas: estado.tentativas,
    pensando: estado.pensando,
    explicacaoEscolha: estado.explicacaoEscolha,
    historico: estado.perguntasFeitas.map(id => ({
      pergunta: PERGUNTAS_AKINATOR.find(p => p.id === id)?.texto || "",
      resposta: estado.respostas[id] || ""
    })),
    fraseMagica,
    frasePensando,
    responder,
    fazerTentativa,
    reset,
    progressoPerguntas: estado.perguntasFeitas.length,
    totalPerguntas: PERGUNTAS_AKINATOR.length
  };
}
