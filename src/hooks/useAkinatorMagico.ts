
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
}

// Banco de perguntas estratégicas (50+ perguntas)
const PERGUNTAS_AKINATOR: PerguntaAkinator[] = [
  // === PERGUNTAS DE ELIMINAÇÃO TÉCNICA ===
  {
    id: "area_rosto_corpo",
    texto: "O que você imagina sendo tratado principalmente?",
    opcoes: ["Meu rosto", "Meu corpo", "Ambos igualmente", "Não sei ainda"],
    tipo: "eliminacao",
    peso: 10,
    criterios: [
      { campo: "area_aplicacao", valores: ["facial", "rosto"], elimina: false },
      { campo: "area_aplicacao", valores: ["corporal", "corpo"], elimina: false }
    ]
  },
  {
    id: "invasividade",
    texto: "Como você se sente em relação a procedimentos?",
    opcoes: ["Prefiro nada invasivo", "Aceito algo minimamente invasivo", "Não me importo com invasividade", "Tenho medo de dor"],
    tipo: "eliminacao",
    peso: 9,
    criterios: [
      { campo: "tipo_acao", valores: ["Não invasivo"], elimina: false },
      { campo: "tipo_acao", valores: ["Minimante invasivo"], elimina: false }
    ]
  },
  {
    id: "tempo_resultado",
    texto: "Qual sua expectativa sobre resultados?",
    opcoes: ["Quero ver resultados imediatos", "Posso esperar algumas semanas", "Resultados graduais são ok", "Não tenho pressa"],
    tipo: "psicologica",
    peso: 7,
    criterios: [
      { campo: "meta", valores: ["rapido", "imediato"], elimina: false }
    ]
  },

  // === PERGUNTAS PSICOLÓGICAS E COMPORTAMENTAIS ===
  {
    id: "espelho_manha",
    texto: "Quando você se olha no espelho de manhã...",
    opcoes: ["Sinto que algo precisa melhorar", "Geralmente me sinto bem", "Evito me olhar muito", "Analiso cada detalhe"],
    tipo: "psicologica",
    peso: 8,
    criterios: [
      { campo: "meta", valores: ["autoestima", "melhoria"], elimina: false }
    ]
  },
  {
    id: "roupas_esconder",
    texto: "Você já escolheu roupas para esconder alguma parte do corpo?",
    opcoes: ["Sim, sempre faço isso", "Às vezes", "Raramente", "Nunca pensei nisso"],
    tipo: "comportamental",
    peso: 8,
    criterios: [
      { campo: "meta", valores: ["contorno", "modelagem"], elimina: false }
    ]
  },
  {
    id: "fotos_selfies",
    texto: "Como você se sente ao tirar selfies?",
    opcoes: ["Sempre procuro o melhor ângulo", "Natural, sem muito drama", "Prefiro evitar", "Amo tirar fotos"],
    tipo: "psicologica",
    peso: 6,
    criterios: [
      { campo: "meta", valores: ["facial", "rosto"], elimina: false }
    ]
  },
  {
    id: "exercicio_frequencia",
    texto: "Qual sua relação com exercícios físicos?",
    opcoes: ["Pratico regularmente", "Pratico às vezes", "Evito exercícios", "Gostaria de complementar os resultados"],
    tipo: "comportamental",
    peso: 7,
    criterios: [
      { campo: "meta", valores: ["corporal", "tonificacao"], elimina: false }
    ]
  },

  // === PERGUNTAS NOSTÁLGICAS ===
  {
    id: "novela_dancinha",
    texto: "Você se lembra da época das 'dancinhas' de novela?",
    opcoes: ["Sim, dancei muito!", "Lembro vagamente", "Não me lembro", "Que dancinhas?"],
    tipo: "nostalgia",
    peso: 5,
    criterios: [
      { campo: "meta", valores: ["idade_35_45"], elimina: false }
    ]
  },
  {
    id: "orkut_fotolog",
    texto: "Você teve Orkut ou Fotolog?",
    opcoes: ["Tive os dois!", "Só Orkut", "Só Fotolog", "Não tive nenhum"],
    tipo: "nostalgia",
    peso: 5,
    criterios: [
      { campo: "meta", valores: ["idade_25_35"], elimina: false }
    ]
  },
  {
    id: "tv_colosso",
    texto: "Assistiu TV Colosso quando criança?",
    opcoes: ["Assistia todo dia!", "Às vezes", "Não lembro", "Nunca ouvi falar"],
    tipo: "nostalgia",
    peso: 5,
    criterios: [
      { campo: "meta", valores: ["idade_30_40"], elimina: false }
    ]
  },

  // === PERGUNTAS ESPECÍFICAS DE SINTOMAS ===
  {
    id: "pele_firmeza",
    texto: "Como você avalia a firmeza da sua pele?",
    opcoes: ["Perdeu muita firmeza", "Um pouco flácida", "Razoavelmente firme", "Muito firme"],
    tipo: "tecnica",
    peso: 9,
    criterios: [
      { campo: "indicacoes", valores: ["flacidez", "firmeza", "lifting"], elimina: false }
    ]
  },
  {
    id: "gordura_incomoda",
    texto: "Existe alguma 'pochete' ou gordurinha que te incomoda?",
    opcoes: ["Sim, me incomoda bastante", "Um pouco", "Não muito", "Não tenho isso"],
    tipo: "tecnica",
    peso: 9,
    criterios: [
      { campo: "indicacoes", valores: ["gordura", "lipólise", "redução"], elimina: false }
    ]
  },
  {
    id: "manchas_sol",
    texto: "Você tem manchas na pele ou melasma?",
    opcoes: ["Sim, várias manchas", "Algumas manchas", "Poucas manchas", "Não tenho"],
    tipo: "tecnica",
    peso: 9,
    criterios: [
      { campo: "indicacoes", valores: ["mancha", "melasma", "pigmentação"], elimina: false }
    ]
  },
  {
    id: "musculo_tonus",
    texto: "Como está seu tônus muscular?",
    opcoes: ["Muito flácido", "Pouco tônus", "Razoável", "Bem tonificado"],
    tipo: "tecnica",
    peso: 8,
    criterios: [
      { campo: "indicacoes", valores: ["tonificação", "músculo", "fortalecimento"], elimina: false }
    ]
  },

  // === PERGUNTAS DE ESTILO DE VIDA ===
  {
    id: "tempo_cuidados",
    texto: "Quanto tempo você dedica aos cuidados pessoais?",
    opcoes: ["Muito tempo, sou detalhista", "Tempo moderado", "Pouco tempo", "Quase nenhum tempo"],
    tipo: "comportamental",
    peso: 6,
    criterios: [
      { campo: "meta", valores: ["cuidado", "rotina"], elimina: false }
    ]
  },
  {
    id: "investimento_beleza",
    texto: "Como você vê investimento em beleza/estética?",
    opcoes: ["Prioridade máxima", "Importante, mas com limites", "Gasto ocasional", "Evito gastos"],
    tipo: "psicologica",
    peso: 7,
    criterios: [
      { campo: "nivel_investimento", valores: ["Alto", "Médio", "Baixo"], elimina: false }
    ]
  },
  {
    id: "profissao_exposicao",
    texto: "Sua profissão exige boa aparência?",
    opcoes: ["Sim, é fundamental", "Um pouco", "Não muito", "Não interfere"],
    tipo: "comportamental",
    peso: 6,
    criterios: [
      { campo: "meta", valores: ["profissional", "aparência"], elimina: false }
    ]
  },

  // === PERGUNTAS AVANÇADAS DE ELIMINAÇÃO ===
  {
    id: "tecnologia_preferencia",
    texto: "Que tipo de tecnologia te atrai mais?",
    opcoes: ["Laser e luz", "Radiofrequência", "Ultrassom", "Não tenho preferência"],
    tipo: "tecnica",
    peso: 8,
    criterios: [
      { campo: "tecnologia", valores: ["laser", "IPL"], elimina: false },
      { campo: "tecnologia", valores: ["radiofrequência", "RF"], elimina: false },
      { campo: "tecnologia", valores: ["ultrassom", "HIFU"], elimina: false }
    ]
  },
  {
    id: "sessoes_frequencia",
    texto: "Qual frequência de sessões você prefere?",
    opcoes: ["Poucas sessões intensas", "Muitas sessões suaves", "Depende do resultado", "Uma sessão só"],
    tipo: "comportamental",
    peso: 6,
    criterios: [
      { campo: "meta", valores: ["intensivo", "suave"], elimina: false }
    ]
  },

  // === MAIS PERGUNTAS ESTRATÉGICAS ===
  {
    id: "relacionamento_status",
    texto: "Atualmente você está...",
    opcoes: ["Solteiro(a) e ativo(a)", "Em relacionamento", "Casado(a)", "Focado(a) em mim"],
    tipo: "psicologica",
    peso: 5,
    criterios: [
      { campo: "meta", valores: ["autoestima", "confiança"], elimina: false }
    ]
  },
  {
    id: "idade_aparencia",
    texto: "Como você se sente em relação à sua idade?",
    opcoes: ["Quero parecer mais jovem", "Estou bem com minha idade", "Idade não me preocupa", "Quero envelhecer bem"],
    tipo: "psicologica",
    peso: 7,
    criterios: [
      { campo: "indicacoes", valores: ["rejuvenescimento", "anti-aging"], elimina: false }
    ]
  },
  {
    id: "eventos_especiais",
    texto: "Você tem algum evento especial se aproximando?",
    opcoes: ["Sim, em breve", "Talvez no futuro", "Nada específico", "Sempre me preparo"],
    tipo: "comportamental",
    peso: 6,
    criterios: [
      { campo: "meta", valores: ["evento", "preparação"], elimina: false }
    ]
  },
  {
    id: "dor_tolerancia",
    texto: "Como é sua tolerância à dor/desconforto?",
    opcoes: ["Muito baixa", "Baixa", "Média", "Alta"],
    tipo: "tecnica",
    peso: 8,
    criterios: [
      { campo: "tipo_acao", valores: ["Não invasivo"], elimina: false }
    ]
  },
  {
    id: "resultados_anteriores",
    texto: "Já fez algum tratamento estético antes?",
    opcoes: ["Sim, vários", "Alguns", "Poucos", "Nunca fiz"],
    tipo: "comportamental",
    peso: 7,
    criterios: [
      { campo: "meta", valores: ["experiência"], elimina: false }
    ]
  }
];

// Frases mágicas do Akinator
const FRASES_PENSANDO = [
  "Hmm... interessante escolha... 🤔",
  "Estou vendo algo em você... ✨",
  "Sua aura está me revelando segredos... 🔮",
  "As estrelas estão se alinhando... ⭐",
  "Posso sentir sua energia... 💫",
  "Estou lendo sua essência... 🌟",
  "Algo está ficando claro... 💡",
  "Seu desejo está se manifestando... 🌙"
];

const FRASES_CONFIANCA = {
  baixa: ["Ainda estou investigando...", "Preciso de mais pistas...", "Algo me escapa ainda..."],
  media: ["Estou chegando lá...", "A verdade está emergindo...", "Quase posso ver..."],
  alta: ["Já sei quem você é!", "Descobri seu segredo!", "Sua escolha está clara!"]
};

export function useAkinatorMagico(equipamentos: Equipment[]) {
  const [estado, setEstado] = useState<EstadoAkinator>({
    equipamentosAtivos: equipamentos.filter(eq => eq.akinator_enabled && eq.ativo),
    perguntasFeitas: [],
    respostas: {},
    confianca: 0,
    fase: "questionando",
    tentativas: 0,
    pensando: false
  });

  // Algoritmo para calcular entropia e escolher melhor pergunta
  const calcularEntropia = useCallback((equipamentosRestantes: Equipment[], pergunta: PerguntaAkinator) => {
    let entropia = 0;
    
    pergunta.opcoes.forEach(opcao => {
      const equipamentosFiltrados = equipamentosRestantes.filter(eq => {
        return pergunta.criterios.some(criterio => {
          const valor = eq[criterio.campo];
          if (Array.isArray(valor)) {
            return criterio.valores.some(cv => valor.some(v => v.toLowerCase().includes(cv.toLowerCase())));
          }
          return criterio.valores.some(cv => String(valor).toLowerCase().includes(cv.toLowerCase()));
        });
      });
      
      const proporcao = equipamentosFiltrados.length / equipamentosRestantes.length;
      if (proporcao > 0) {
        entropia -= proporcao * Math.log2(proporcao);
      }
    });
    
    return entropia;
  }, []);

  // Escolher próxima pergunta baseada em entropia
  const proximaPergunta = useMemo(() => {
    if (estado.fase !== "questionando") return null;
    
    const perguntasDisponiveis = PERGUNTAS_AKINATOR.filter(
      p => !estado.perguntasFeitas.includes(p.id)
    );
    
    if (perguntasDisponiveis.length === 0) return null;
    
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
    if (restantes <= 3) return 85;
    if (restantes <= 5) return 70;
    if (restantes <= 10) return 50;
    
    return Math.max(10, Math.round((total - restantes) / total * 100));
  }, [estado.equipamentosAtivos.length, equipamentos]);

  // Responder pergunta com eliminação progressiva
  const responder = useCallback(async (resposta: string) => {
    if (!proximaPergunta) return;
    
    setEstado(prev => ({ ...prev, pensando: true }));
    
    // Simular "pensamento" do Akinator
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const novasRespostas = { ...estado.respostas, [proximaPergunta.id]: resposta };
    
    // Filtrar equipamentos baseado na resposta
    let equipamentosFiltrados = estado.equipamentosAtivos.filter(eq => {
      return proximaPergunta.criterios.some(criterio => {
        const valor = eq[criterio.campo];
        const match = criterio.valores.some(cv => {
          if (Array.isArray(valor)) {
            return valor.some(v => v.toLowerCase().includes(cv.toLowerCase()));
          }
          return String(valor).toLowerCase().includes(cv.toLowerCase());
        });
        
        // Se a resposta corresponde ao critério, manter equipamento
        const respostaMatch = criterio.valores.some(cv => 
          resposta.toLowerCase().includes(cv.toLowerCase())
        );
        
        return respostaMatch ? match : !match;
      });
    });
    
    // Se filtrou demais, manter alguns equipamentos
    if (equipamentosFiltrados.length === 0) {
      equipamentosFiltrados = estado.equipamentosAtivos.slice(0, Math.max(1, Math.floor(estado.equipamentosAtivos.length / 2)));
    }
    
    const novaConfianca = confiancaCalculada;
    const novasFeitasIds = [...estado.perguntasFeitas, proximaPergunta.id];
    
    setEstado(prev => ({
      ...prev,
      equipamentosAtivos: equipamentosFiltrados,
      respostas: novasRespostas,
      perguntasFeitas: novasFeitasIds,
      confianca: novaConfianca,
      pensando: false,
      fase: novaConfianca >= 85 || equipamentosFiltrados.length <= 1 ? "tentativa" : "questionando"
    }));
  }, [proximaPergunta, estado, confiancaCalculada]);

  // Fazer tentativa de adivinhação
  const fazerTentativa = useCallback(() => {
    setEstado(prev => ({
      ...prev,
      fase: "revelacao",
      tentativas: prev.tentativas + 1
    }));
  }, []);

  // Reset do jogo
  const reset = useCallback(() => {
    setEstado({
      equipamentosAtivos: equipamentos.filter(eq => eq.akinator_enabled && eq.ativo),
      perguntasFeitas: [],
      respostas: {},
      confianca: 0,
      fase: "questionando",
      tentativas: 0,
      pensando: false
    });
  }, [equipamentos]);

  // Pegar frase mágica baseada na confiança
  const fraseMagica = useMemo(() => {
    if (estado.confianca >= 80) {
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
