import { useState, useMemo, useCallback } from "react";
import { Equipment } from "@/types/equipment";

// Tipos específicos para o novo sistema
export type PerfilUsuario = "profissional" | "cliente_final" | null;
export type FaseAkinator = "perfil" | "questionando" | "tentativa" | "revelacao";

export interface PerguntaAkinator {
  id: string;
  texto: string;
  opcoes: string[];
  tipo: "comportamental" | "psicologica" | "nostalgica" | "lifestyle" | "emocional";
  aplicavel_para: ("profissional" | "cliente_final")[];
  peso: number;
  mapeamento_sutil: {
    resposta_padrao: string;
    indicacoes_alvo: string[];
    tecnologias_alvo: string[];
    perfil_comportamental: string;
    pontuacao: number;
  }[];
}

// Estado do Akinator renovado
interface EstadoAkinator {
  perfil_usuario: PerfilUsuario;
  equipamentos_ativos: Equipment[];
  equipamentos_pontuacao: Record<string, number>;
  perguntas_feitas: string[];
  respostas: Record<string, string>;
  fase: FaseAkinator;
  tentativas: number;
  pensando: boolean;
  explicacao_escolha: string;
  confianca_real: number;
  insights_comportamentais: string[];
}

// Banco de perguntas intuitivas e indiretas
const PERGUNTAS_INTUITIVAS: PerguntaAkinator[] = [
  // === PERGUNTA INICIAL DISFARÇADA ===
  {
    id: "ajudar_pessoas",
    texto: "Você gosta de ajudar outras pessoas a se sentirem melhor consigo mesmas?",
    opcoes: ["É minha profissão e paixão", "Gosto, mas como hobby", "Às vezes, quando posso", "Prefiro focar em mim"],
    tipo: "comportamental",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 10,
    mapeamento_sutil: [
      {
        resposta_padrao: "É minha profissão e paixão",
        indicacoes_alvo: [],
        tecnologias_alvo: [],
        perfil_comportamental: "profissional",
        pontuacao: 10
      },
      {
        resposta_padrao: "Gosto, mas como hobby",
        indicacoes_alvo: [],
        tecnologias_alvo: [],
        perfil_comportamental: "cliente_final",
        pontuacao: 8
      }
    ]
  },

  // === PERGUNTAS COMPORTAMENTAIS INDIRETAS ===
  {
    id: "espelho_manha",
    texto: "Quando você se olha no espelho pela manhã, qual é seu primeiro pensamento?",
    opcoes: ["'Que bom dia!' - sou otimista", "'Hmm, algo diferente hoje' - analítico", "'Ai, meu Deus...' - autocrítico", "'Não reparo muito' - prático"],
    tipo: "psicologica",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 8,
    mapeamento_sutil: [
      {
        resposta_padrao: "'Hmm, algo diferente hoje' - analítico",
        indicacoes_alvo: ["anti-aging", "rejuvenescimento", "prevenção"],
        tecnologias_alvo: ["laser", "radiofrequência"],
        perfil_comportamental: "perfeccionista_analitico",
        pontuacao: 8
      },
      {
        resposta_padrao: "'Ai, meu Deus...' - autocrítico",
        indicacoes_alvo: ["flacidez", "rugas", "manchas", "lifting"],
        tecnologias_alvo: ["ultrassom", "radiofrequência", "laser"],
        perfil_comportamental: "insatisfeito_buscador",
        pontuacao: 9
      }
    ]
  },

  {
    id: "festa_comportamento",
    texto: "Em uma festa, você geralmente...",
    opcoes: ["Fica mais no canto observando", "Conversa com algumas pessoas próximas", "É o centro das atenções", "Prefere não ir a festas"],
    tipo: "comportamental",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 6,
    mapeamento_sutil: [
      {
        resposta_padrao: "É o centro das atenções",
        indicacoes_alvo: ["rejuvenescimento", "lifting", "firmeza"],
        tecnologias_alvo: ["radiofrequência", "ultrassom"],
        perfil_comportamental: "extrovertido_confiante",
        pontuacao: 7
      },
      {
        resposta_padrao: "Fica mais no canto observando",
        indicacoes_alvo: ["prevenção", "manutenção", "sutil"],
        tecnologias_alvo: ["laser", "luz"],
        perfil_comportamental: "introvertido_observador",
        pontuacao: 6
      }
    ]
  },

  // === PERGUNTAS NOSTÁLGICAS E DE LIFESTYLE ===
  {
    id: "musica_preferida",
    texto: "Que tipo de música mais combina com você?",
    opcoes: ["Clássicos dos anos 80/90", "Pop atual e hits do momento", "MPB e música brasileira", "Eletrônica e sons modernos"],
    tipo: "nostalgica",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 5,
    mapeamento_sutil: [
      {
        resposta_padrao: "Clássicos dos anos 80/90",
        indicacoes_alvo: ["anti-aging", "rejuvenescimento", "lifting"],
        tecnologias_alvo: ["radiofrequência", "ultrassom"],
        perfil_comportamental: "nostalgico_maduro",
        pontuacao: 8
      },
      {
        resposta_padrao: "Pop atual e hits do momento",
        indicacoes_alvo: ["prevenção", "manutenção", "brilho"],
        tecnologias_alvo: ["laser", "luz", "IPL"],
        perfil_comportamental: "jovem_conectado",
        pontuacao: 6
      }
    ]
  },

  {
    id: "fim_de_semana",
    texto: "Seu fim de semana ideal seria...",
    opcoes: ["Netflix e relaxar em casa", "Sair para almoçar e passear", "Academia e cuidados pessoais", "Trabalhar em projetos pessoais"],
    tipo: "lifestyle",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 7,
    mapeamento_sutil: [
      {
        resposta_padrao: "Academia e cuidados pessoais",
        indicacoes_alvo: ["firmeza", "tonificação", "definição", "gordura"],
        tecnologias_alvo: ["radiofrequência", "ultrassom", "lipólise"],
        perfil_comportamental: "fitness_disciplinado",
        pontuacao: 9
      },
      {
        resposta_padrao: "Netflix e relaxar em casa",
        indicacoes_alvo: ["stress", "relaxamento", "wellness"],
        tecnologias_alvo: ["luz", "terapia", "bioestimulação"],
        perfil_comportamental: "relaxado_caseiro",
        pontuacao: 5
      }
    ]
  },

  // === PERGUNTAS EMOCIONAIS PROFUNDAS ===
  {
    id: "motivacao_mudanca",
    texto: "O que mais te motiva a fazer mudanças na vida?",
    opcoes: ["Quero me sentir mais confiante", "Busco resultados que outros notem", "Gosto de me cuidar constantemente", "Só mudo quando algo me incomoda muito"],
    tipo: "emocional",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 9,
    mapeamento_sutil: [
      {
        resposta_padrao: "Quero me sentir mais confiante",
        indicacoes_alvo: ["autoestima", "rejuvenescimento", "lifting"],
        tecnologias_alvo: ["radiofrequência", "ultrassom"],
        perfil_comportamental: "autoestima_baixa",
        pontuacao: 8
      },
      {
        resposta_padrao: "Busco resultados que outros notem",
        indicacoes_alvo: ["visível", "dramático", "lifting", "rejuvenescimento"],
        tecnologias_alvo: ["ultrassom", "radiofrequência"],
        perfil_comportamental: "busca_reconhecimento",
        pontuacao: 9
      }
    ]
  },

  {
    id: "compras_decisao",
    texto: "Na hora de comprar algo importante, você...",
    opcoes: ["Pesquisa muito antes de decidir", "Compra por impulso se gostou", "Pede opinião de várias pessoas", "Demora mas sempre escolhe o melhor"],
    tipo: "comportamental",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 6,
    mapeamento_sutil: [
      {
        resposta_padrao: "Demora mas sempre escolhe o melhor",
        indicacoes_alvo: ["premium", "duradouro", "eficaz"],
        tecnologias_alvo: ["ultrassom", "radiofrequência"],
        perfil_comportamental: "perfeccionista_exigente",
        pontuacao: 8
      },
      {
        resposta_padrao: "Pesquisa muito antes de decidir",
        indicacoes_alvo: ["seguro", "comprovado", "científico"],
        tecnologias_alvo: ["laser", "luz"],
        perfil_comportamental: "cauteloso_informado",
        pontuacao: 7
      }
    ]
  },

  // === PERGUNTAS ESPECÍFICAS PARA PROFISSIONAIS ===
  {
    id: "lideranca_natural",
    texto: "As pessoas costumam pedir sua opinião sobre assuntos importantes?",
    opcoes: ["Sempre, sou uma referência", "Às vezes, em certas áreas", "Raramente, prefiro escutar", "Depende do assunto"],
    tipo: "comportamental",
    aplicavel_para: ["profissional"],
    peso: 8,
    mapeamento_sutil: [
      {
        resposta_padrao: "Sempre, sou uma referência",
        indicacoes_alvo: ["profissional", "clínica", "multiple"],
        tecnologias_alvo: ["radiofrequência", "ultrassom", "laser"],
        perfil_comportamental: "lider_especialista",
        pontuacao: 9
      }
    ]
  },

  {
    id: "inovacao_trabalho",
    texto: "No seu trabalho, você prefere...",
    opcoes: ["Usar as técnicas mais modernas", "Misturar tradição com inovação", "Focar no que já domino bem", "Adaptar conforme cada situação"],
    tipo: "comportamental",
    aplicavel_para: ["profissional"],
    peso: 8,
    mapeamento_sutil: [
      {
        resposta_padrao: "Usar as técnicas mais modernas",
        indicacoes_alvo: ["tecnologia", "avançado", "inovação"],
        tecnologias_alvo: ["ultrassom", "laser", "radiofrequência"],
        perfil_comportamental: "inovador_early_adopter",
        pontuacao: 9
      }
    ]
  },

  // === PERGUNTAS PARA CLIENTES FINAIS ===
  {
    id: "autocuidado_ritual",
    texto: "Sua rotina de autocuidado é...",
    opcoes: ["Super elaborada, tenho vários produtos", "Básica mas constante", "Só quando lembro ou tenho tempo", "Minimal, o essencial"],
    tipo: "lifestyle",
    aplicavel_para: ["cliente_final"],
    peso: 7,
    mapeamento_sutil: [
      {
        resposta_padrao: "Super elaborada, tenho vários produtos",
        indicacoes_alvo: ["anti-aging", "prevenção", "manutenção"],
        tecnologias_alvo: ["luz", "laser", "bioestimulação"],
        perfil_comportamental: "skincare_enthusiast",
        pontuacao: 8
      },
      {
        resposta_padrao: "Só quando lembro ou tenho tempo",
        indicacoes_alvo: ["prático", "rápido", "eficaz"],
        tecnologias_alvo: ["radiofrequência", "ultrassom"],
        perfil_comportamental: "pratico_resultado_rapido",
        pontuacao: 7
      }
    ]
  },

  {
    id: "redes_sociais",
    texto: "Nas redes sociais você...",
    opcoes: ["Posta regularmente sua rotina", "Posta só ocasiões especiais", "Mais observa que posta", "Usa pouco ou não gosta"],
    tipo: "comportamental",
    aplicavel_para: ["cliente_final"],
    peso: 6,
    mapeamento_sutil: [
      {
        resposta_padrao: "Posta regularmente sua rotina",
        indicacoes_alvo: ["visível", "photogenic", "selfie"],
        tecnologias_alvo: ["luz", "laser", "rejuvenescimento"],
        perfil_comportamental: "influencer_wannabe",
        pontuacao: 8
      }
    ]
  },

  // === PERGUNTAS UNIVERSAIS SUTIS ===
  {
    id: "temporadas_preferencia",
    texto: "Qual estação do ano mais combina com sua personalidade?",
    opcoes: ["Primavera - renovação e energia", "Verão - alegria e exposição", "Outono - reflexão e mudança", "Inverno - introspecção e cuidado"],
    tipo: "psicologica",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 5,
    mapeamento_sutil: [
      {
        resposta_padrao: "Primavera - renovação e energia",
        indicacoes_alvo: ["renovação", "bioestimulação", "energia"],
        tecnologias_alvo: ["luz", "bioestimulação"],
        perfil_comportamental: "renovador_otimista",
        pontuacao: 7
      },
      {
        resposta_padrao: "Outono - reflexão e mudança",
        indicacoes_alvo: ["transformação", "anti-aging", "mudança"],
        tecnologias_alvo: ["radiofrequência", "ultrassom"],
        perfil_comportamental: "reflexivo_transformador",
        pontuacao: 8
      }
    ]
  },

  {
    id: "perfeccionismo",
    texto: "Você se considera uma pessoa perfeccionista?",
    opcoes: ["Muito, detalhes fazem diferença", "Um pouco, mas sei quando parar", "Não muito, 80% já está bom", "Para nada, gosto do imperfeito"],
    tipo: "psicologica",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 7,
    mapeamento_sutil: [
      {
        resposta_padrao: "Muito, detalhes fazem diferença",
        indicacoes_alvo: ["precisão", "refinamento", "detalhes"],
        tecnologias_alvo: ["laser", "ultrassom"],
        perfil_comportamental: "perfeccionista_exigente",
        pontuacao: 9
      }
    ]
  },

  {
    id: "paciencia_resultados",
    texto: "Para coisas que valem a pena, você...",
    opcoes: ["Tem toda paciência do mundo", "Aguarda, mas quer ver progresso", "Prefere resultados mais rápidos", "Quer tudo para ontem"],
    tipo: "comportamental",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 6,
    mapeamento_sutil: [
      {
        resposta_padrao: "Tem toda paciência do mundo",
        indicacoes_alvo: ["gradual", "progressivo", "duradouro"],
        tecnologias_alvo: ["bioestimulação", "luz"],
        perfil_comportamental: "paciente_persistente",
        pontuacao: 6
      },
      {
        resposta_padrao: "Quer tudo para ontem",
        indicacoes_alvo: ["rápido", "imediato", "dramático"],
        tecnologias_alvo: ["radiofrequência", "ultrassom"],
        perfil_comportamental: "impaciente_resultados",
        pontuacao: 8
      }
    ]
  }
];

// Frases mágicas renovadas e mais impressionantes
const FRASES_PENSANDO_MAGICAS = {
  profissional: [
    "Hmm... sinto uma energia de liderança... 💫",
    "Detectando padrões de expertise... 🔬",
    "Sua essência profissional está se revelando... ✨",
    "Percebo alguém que transforma vidas... 🌟"
  ],
  cliente_final: [
    "Sentindo sua personalidade única... ✨",
    "Decifrando seus desejos mais profundos... 🔮",
    "Sua alma está sussurrando segredos... 💫",
    "Captando vibrações muito interessantes... 🌟"
  ]
};

const INSIGHTS_MAGICOS = {
  perfissional: {
    perfeccionista_analitico: "Você é alguém que enxerga potencial onde outros não veem...",
    lider_especialista: "Sinto que você é uma referência para muitas pessoas...",
    inovador_early_adopter: "Você sempre está um passo à frente, não é?"
  },
  cliente_final: {
    autocuidado_entusiasta: "Você tem um ritual de beleza que é quase um momento sagrado...",
    busca_reconhecimento: "Sinto que você gosta quando notam as mudanças positivas em você...",
    perfeccionista_exigente: "Você não aceita qualquer coisa, só o que realmente funciona..."
  }
};

const FRASES_CONFIANCA_MAGICAS = {
  profissional: {
    baixa: ["Ainda decifrando seu perfil clínico único...", "Sua especialidade está emergindo..."],
    media: ["Começando a ver seu diferencial profissional...", "Seu padrão de excelência está ficando claro..."],
    alta: ["Descobri exatamente o que sua clínica precisa!", "Identifiquei seu equipamento ideal com precisão!"]
  },
  cliente_final: {
    baixa: ["Interpretando as pistas da sua personalidade...", "Seus desejos estão se cristalizando..."],
    media: ["Posso sentir suas necessidades se revelando...", "Sua verdadeira essência está aparecendo..."],
    alta: ["Vejo claramente o que sua alma busca!", "Descobri o segredo da sua transformação!"]
  }
};

export function useAkinatorMagico(equipamentos: Equipment[]) {
  const [estado, setEstado] = useState<EstadoAkinator>({
    perfil_usuario: null,
    equipamentos_ativos: equipamentos.filter(eq => eq.akinator_enabled && eq.ativo),
    equipamentos_pontuacao: {},
    perguntas_feitas: [],
    respostas: {},
    fase: "perfil",
    tentativas: 0,
    pensando: false,
    explicacao_escolha: "",
    confianca_real: 0,
    insights_comportamentais: []
  });

  // Algoritmo sutil de correspondência comportamental
  const calcularPontuacaoSutil = useCallback((equipamento: Equipment, respostas: Record<string, string>): number => {
    let pontuacao = 0;
    let insights: string[] = [];
    
    Object.entries(respostas).forEach(([perguntaId, resposta]) => {
      const pergunta = PERGUNTAS_INTUITIVAS.find(p => p.id === perguntaId);
      if (!pergunta) return;

      pergunta.mapeamento_sutil.forEach(mapeamento => {
        if (mapeamento.resposta_padrao === resposta) {
          // Correspondência com indicações
          const textoIndicacoes = String(equipamento.indicacoes || '').toLowerCase();
          const indicacoesEncontradas = mapeamento.indicacoes_alvo.filter(indicacao =>
            textoIndicacoes.includes(indicacao.toLowerCase())
          );
          
          // Correspondência com tecnologia
          const textoTecnologia = String(equipamento.tecnologia || '').toLowerCase();
          const tecnologiasEncontradas = mapeamento.tecnologias_alvo.filter(tech =>
            textoTecnologia.includes(tech.toLowerCase())
          );
          
          if (indicacoesEncontradas.length > 0 || tecnologiasEncontradas.length > 0) {
            pontuacao += mapeamento.pontuacao * pergunta.peso;
            insights.push(mapeamento.perfil_comportamental);
          }
        }
      });
    });

    return pontuacao;
  }, []);

  // Seleção inteligente da próxima pergunta
  const proximaPergunta = useMemo(() => {
    const perguntasDisponiveis = PERGUNTAS_INTUITIVAS.filter(p => {
      // Se ainda não definiu perfil, só pergunta comportamental inicial
      if (estado.perfil_usuario === null) return p.id === "ajudar_pessoas";
      
      // Verifica se já foi feita
      if (estado.perguntas_feitas.includes(p.id)) return false;
      
      // Verifica se é aplicável ao perfil
      return p.aplicavel_para.includes(estado.perfil_usuario);
    });

    if (perguntasDisponiveis.length === 0) return null;

    // Priorizar por peso e tipo
    return perguntasDisponiveis.sort((a, b) => {
      // Priorizar perguntas emocionais quando há muitos equipamentos
      if (estado.equipamentos_ativos.length > 5 && a.tipo === "emocional") return -1;
      if (estado.equipamentos_ativos.length > 5 && b.tipo === "emocional") return 1;
      
      return b.peso - a.peso;
    })[0];
  }, [estado.perguntas_feitas, estado.equipamentos_ativos.length, estado.perfil_usuario]);

  // Cálculo realístico de confiança
  const confiancaCalculada = useMemo(() => {
    const total = equipamentos.filter(eq => eq.akinator_enabled && eq.ativo).length;
    const restantes = estado.equipamentos_ativos.length;
    const perguntasFeitas = estado.perguntas_feitas.length;
    
    // Só alta confiança com poucos equipamentos E muitas perguntas
    if (restantes <= 1 && perguntasFeitas >= 6) return 95;
    if (restantes <= 2 && perguntasFeitas >= 8) return 85;
    if (restantes <= 3 && perguntasFeitas >= 6) return 75;
    if (restantes <= 4 && perguntasFeitas >= 5) return 65;
    
    // Confiança baixa até ter perguntado o suficiente
    if (perguntasFeitas < 5) return Math.max(10, perguntasFeitas * 8);
    
    return Math.max(15, Math.round(((total - restantes) / total) * 50 + (perguntasFeitas * 4)));
  }, [estado.equipamentos_ativos.length, estado.perguntas_feitas.length, equipamentos]);

  // Responder com análise comportamental sutil
  const responder = useCallback(async (resposta: string) => {
    if (!proximaPergunta) return;
    
    setEstado(prev => ({ ...prev, pensando: true }));
    
    await new Promise(resolve => setTimeout(resolve, 3000)); // Mais suspense
    
    const novasRespostas = { ...estado.respostas, [proximaPergunta.id]: resposta };
    
    // Detectar perfil na primeira pergunta
    let novoPerfil = estado.perfil_usuario;
    if (proximaPergunta.id === "ajudar_pessoas") {
      novoPerfil = resposta.includes("profissão") ? "profissional" : "cliente_final";
    }

    // Recalcular pontuações com algoritmo sutil
    const novasPontuacoes: Record<string, number> = {};
    const novosInsights: string[] = [];
    
    estado.equipamentos_ativos.forEach(eq => {
      const pontuacao = calcularPontuacaoSutil(eq, novasRespostas);
      novasPontuacoes[eq.id] = pontuacao;
    });

    // Filtrar apenas equipamentos com pontuação significativa
    const equipamentosRankeados = estado.equipamentos_ativos
      .filter(eq => novasPontuacoes[eq.id] > 0)
      .sort((a, b) => novasPontuacoes[b.id] - novasPontuacoes[a.id]);

    // Manter pelo menos top 3 se filtrou demais
    const equipamentosFinais = equipamentosRankeados.length > 0 
      ? equipamentosRankeados.slice(0, Math.max(3, Math.floor(equipamentosRankeados.length * 0.6)))
      : estado.equipamentos_ativos.slice(0, 3);

    const novaConfianca = confiancaCalculada;
    const novasFeitasIds = [...estado.perguntas_feitas, proximaPergunta.id];
    
    // Só ir para tentativa com condições realistas
    let novaFase: FaseAkinator = "questionando";
    if ((novaConfianca >= 75 && equipamentosFinais.length <= 2 && novasFeitasIds.length >= 6) || 
        novasFeitasIds.length >= 12) {
      novaFase = "tentativa";
    }
    
    setEstado(prev => ({
      ...prev,
      perfil_usuario: novoPerfil,
      equipamentos_ativos: equipamentosFinais,
      equipamentos_pontuacao: novasPontuacoes,
      respostas: novasRespostas,
      perguntas_feitas: novasFeitasIds,
      confianca_real: novaConfianca,
      pensando: false,
      fase: novaFase,
      insights_comportamentais: novosInsights
    }));
  }, [proximaPergunta, estado, confiancaCalculada, calcularPontuacaoSutil]);

  // Gerar explicação baseada em insights comportamentais
  const gerarExplicacaoMagica = useCallback((equipamento: Equipment, respostas: Record<string, string>, perfil: PerfilUsuario): string => {
    const pontosComportamentais = [];
    const insightsUnicos = [];
    
    // Analisar padrões comportamentais
    if (respostas.espelho_manha && respostas.espelho_manha.includes("analítico")) {
      insightsUnicos.push("sua natureza analítica e perfeccionista");
    }
    
    if (respostas.motivacao_mudanca) {
      if (respostas.motivacao_mudanca.includes("confiante")) {
        insightsUnicos.push("seu desejo profundo de se sentir mais segura(o)");
      }
      if (respostas.motivacao_mudanca.includes("outros notem")) {
        insightsUnicos.push("sua vontade de que as pessoas percebam sua transformação");
      }
    }
    
    if (respostas.temporadas_preferencia && respostas.temporadas_preferencia.includes("renovação")) {
      insightsUnicos.push("seu espírito renovador e otimista");
    }

    // Conexão com o equipamento
    const conexaoMagica = perfil === "profissional" 
      ? `Através da análise do seu perfil profissional único, especialmente ${insightsUnicos.join(" e ")}, pude identificar que` 
      : `Decifrando sua personalidade fascinante, principalmente ${insightsUnicos.join(" e ")}, descobri que`;
      
    return `${conexaoMagica} o ${equipamento.nome} é exatamente o que ${perfil === "profissional" ? "sua clínica" : "você"} estava buscando sem nem saber!`;
  }, []);

  // Fazer tentativa com equipamento melhor pontuado
  const fazerTentativa = useCallback(() => {
    const equipamentoEscolhido = estado.equipamentos_ativos[0];
    const explicacao = gerarExplicacaoMagica(equipamentoEscolhido, estado.respostas, estado.perfil_usuario);
    
    setEstado(prev => ({
      ...prev,
      fase: "revelacao",
      tentativas: prev.tentativas + 1,
      explicacao_escolha: explicacao
    }));
  }, [estado, gerarExplicacaoMagica]);

  // Reset inteligente
  const reset = useCallback(() => {
    setEstado({
      perfil_usuario: null,
      equipamentos_ativos: equipamentos.filter(eq => eq.akinator_enabled && eq.ativo),
      equipamentos_pontuacao: {},
      perguntas_feitas: [],
      respostas: {},
      fase: "perfil",
      tentativas: 0,
      pensando: false,
      explicacao_escolha: "",
      confianca_real: 0,
      insights_comportamentais: []
    });
  }, [equipamentos]);

  // Frases contextuais mágicas
  const fraseMagica = useMemo(() => {
    if (!estado.perfil_usuario) return "Preparando leitura da sua essência...";
    
    const frasesConf = FRASES_CONFIANCA_MAGICAS[estado.perfil_usuario];
    if (estado.confianca_real >= 75) return frasesConf.alta[Math.floor(Math.random() * frasesConf.alta.length)];
    if (estado.confianca_real >= 50) return frasesConf.media[Math.floor(Math.random() * frasesConf.media.length)];
    return frasesConf.baixa[Math.floor(Math.random() * frasesConf.baixa.length)];
  }, [estado.confianca_real, estado.perfil_usuario]);

  const frasePensando = useMemo(() => {
    if (!estado.perfil_usuario) return "Conectando com sua energia...";
    const frases = FRASES_PENSANDO_MAGICAS[estado.perfil_usuario];
    return frases[Math.floor(Math.random() * frases.length)];
  }, [estado.perguntas_feitas.length, estado.perfil_usuario]);

  return {
    perguntaAtual: proximaPergunta,
    equipamentosRestantes: estado.equipamentos_ativos,
    confianca: confiancaCalculada,
    fase: estado.fase,
    perfil: estado.perfil_usuario,
    tentativas: estado.tentativas,
    pensando: estado.pensando,
    explicacaoEscolha: estado.explicacao_escolha,
    historico: estado.perguntas_feitas.map(id => ({
      pergunta: PERGUNTAS_INTUITIVAS.find(p => p.id === id)?.texto || "",
      resposta: estado.respostas[id] || ""
    })),
    fraseMagica,
    frasePensando,
    responder,
    fazerTentativa,
    reset,
    progressoPerguntas: estado.perguntas_feitas.length,
    totalPerguntas: PERGUNTAS_INTUITIVAS.filter(p => 
      estado.perfil_usuario ? p.aplicavel_para.includes(estado.perfil_usuario) : true
    ).length,
    insightsComportamentais: estado.insights_comportamentais
  };
}
