
import { useState, useMemo, useCallback } from "react";
import { Equipment } from "@/types/equipment";

// Tipos específicos para o novo sistema
export type PerfilUsuario = "profissional" | "cliente_final" | null;
export type FaseAkinator = "perfil" | "questionando" | "tentativa" | "revelacao";

export interface PerguntaAkinator {
  id: string;
  texto: string;
  opcoes: string[];
  tipo: "perfil" | "eliminacao" | "refinamento" | "nostalgia";
  aplicavel_para: ("profissional" | "cliente_final")[];
  peso: number;
  criterios: {
    campo: "tecnologia" | "indicacoes" | "nome" | "categoria";
    palavras_chave: string[];
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
}

// Banco de perguntas estratégicas que funcionam com dados reais
const PERGUNTAS_ESTRATEGICAS: PerguntaAkinator[] = [
  // === PERGUNTA INICIAL OBRIGATÓRIA ===
  {
    id: "perfil_inicial",
    texto: "Primeiro, preciso saber quem você é...",
    opcoes: ["Sou profissional da estética", "Sou cliente final", "Médico(a)", "Estudante da área"],
    tipo: "perfil",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 10,
    criterios: []
  },

  // === PERGUNTAS PARA PROFISSIONAIS ===
  {
    id: "foco_profissional",
    texto: "Qual é seu foco principal no atendimento?",
    opcoes: ["Resultados rápidos e visíveis", "Tratamentos não invasivos", "Tecnologia avançada", "Versatilidade de protocolos"],
    tipo: "eliminacao",
    aplicavel_para: ["profissional"],
    peso: 9,
    criterios: [
      { campo: "tecnologia", palavras_chave: ["laser", "radiofrequência", "ultrassom"], pontuacao: 8 },
      { campo: "indicacoes", palavras_chave: ["não invasivo", "lifting", "firmeza"], pontuacao: 7 }
    ]
  },
  {
    id: "publico_atendimento",
    texto: "Que tipo de público você mais atende?",
    opcoes: ["Clientes jovens (20-35)", "Meia idade (35-50)", "Público maduro (50+)", "Todos os perfis"],
    tipo: "refinamento",
    aplicavel_para: ["profissional"],
    peso: 7,
    criterios: [
      { campo: "indicacoes", palavras_chave: ["prevenção", "manutenção"], pontuacao: 6 },
      { campo: "indicacoes", palavras_chave: ["anti-aging", "rejuvenescimento"], pontuacao: 8 }
    ]
  },

  // === PERGUNTAS PARA CLIENTES FINAIS ===
  {
    id: "motivacao_pessoal",
    texto: "O que mais te motiva a buscar um tratamento estético?",
    opcoes: ["Quero me sentir mais jovem", "Tenho algo específico que me incomoda", "Quero prevenir o envelhecimento", "Curiosidade sobre novidades"],
    tipo: "eliminacao",
    aplicavel_para: ["cliente_final"],
    peso: 9,
    criterios: [
      { campo: "indicacoes", palavras_chave: ["rejuvenescimento", "lifting", "anti-aging"], pontuacao: 8 },
      { campo: "indicacoes", palavras_chave: ["flacidez", "rugas", "manchas"], pontuacao: 7 }
    ]
  },
  {
    id: "area_preocupacao",
    texto: "Qual área do seu corpo mais te preocupa?",
    opcoes: ["Rosto (rugas, flacidez)", "Corpo (gordura localizada)", "Pele (manchas, textura)", "Não tenho área específica"],
    tipo: "eliminacao",
    aplicavel_para: ["cliente_final"],
    peso: 9,
    criterios: [
      { campo: "indicacoes", palavras_chave: ["facial", "rosto", "rugas"], pontuacao: 8 },
      { campo: "indicacoes", palavras_chave: ["corporal", "gordura", "lipólise"], pontuacao: 8 },
      { campo: "indicacoes", palavras_chave: ["mancha", "melasma", "pigmentação"], pontuacao: 7 }
    ]
  },

  // === PERGUNTAS UNIVERSAIS (ELIMINAÇÃO TÉCNICA) ===
  {
    id: "tecnologia_preferencia",
    texto: "Que tipo de tecnologia mais desperta seu interesse?",
    opcoes: ["Laser e luz intensa", "Radiofrequência", "Ultrassom focado", "Não sei a diferença"],
    tipo: "eliminacao",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 8,
    criterios: [
      { campo: "tecnologia", palavras_chave: ["laser", "IPL", "luz"], pontuacao: 9 },
      { campo: "tecnologia", palavras_chave: ["radiofrequência", "RF"], pontuacao: 9 },
      { campo: "tecnologia", palavras_chave: ["ultrassom", "HIFU"], pontuacao: 9 }
    ]
  },
  {
    id: "invasividade_conforto",
    texto: "Como você se sente sobre procedimentos que causam desconforto?",
    opcoes: ["Prefiro totalmente indolor", "Um pouco de desconforto é ok", "Não me importo se for eficaz", "Depende do resultado"],
    tipo: "refinamento",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 6,
    criterios: [
      { campo: "indicacoes", palavras_chave: ["não invasivo", "conforto", "indolor"], pontuacao: 7 },
      { campo: "tecnologia", palavras_chave: ["laser", "agulhas"], pontuacao: 5 }
    ]
  },

  // === PERGUNTAS DE REFINAMENTO ===
  {
    id: "expectativa_resultado",
    texto: "Qual sua expectativa sobre resultados?",
    opcoes: ["Quero resultados imediatos", "Posso aguardar algumas sessões", "Prefiro resultados graduais", "Não tenho pressa"],
    tipo: "refinamento",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 5,
    criterios: [
      { campo: "indicacoes", palavras_chave: ["imediato", "rápido"], pontuacao: 6 },
      { campo: "indicacoes", palavras_chave: ["gradual", "progressivo"], pontuacao: 4 }
    ]
  },
  {
    id: "problema_principal",
    texto: "Se tivesse que escolher UM problema para resolver hoje, seria:",
    opcoes: ["Flacidez que me incomoda", "Gordura localizada", "Manchas na pele", "Rugas e linhas de expressão"],
    tipo: "eliminacao",
    aplicavel_para: ["profissional", "cliente_final"],
    peso: 9,
    criterios: [
      { campo: "indicacoes", palavras_chave: ["flacidez", "firmeza", "lifting"], pontuacao: 10 },
      { campo: "indicacoes", palavras_chave: ["gordura", "lipólise", "redução"], pontuacao: 10 },
      { campo: "indicacoes", palavras_chave: ["mancha", "melasma", "pigmentação"], pontuacao: 10 },
      { campo: "indicacoes", palavras_chave: ["rugas", "linhas", "anti-aging"], pontuacao: 10 }
    ]
  },

  // === PERGUNTAS NOSTÁLGICAS (SÓ CLIENTES) ===
  {
    id: "nostalgia_novela",
    texto: "Você lembra das novelas da Globo dos anos 90?",
    opcoes: ["Claro! Adorava as novelas", "Lembro vagamente", "Não lembro bem", "Não assistia novelas"],
    tipo: "nostalgia",
    aplicavel_para: ["cliente_final"],
    peso: 3,
    criterios: [
      { campo: "indicacoes", palavras_chave: ["anti-aging", "rejuvenescimento"], pontuacao: 5 }
    ]
  }
];

// Frases mágicas renovadas por perfil
const FRASES_PENSANDO = {
  profissional: [
    "Analisando seu perfil profissional... 💼",
    "Detectando suas necessidades clínicas... 🔬",
    "Interpretando sua experiência no mercado... 📊",
    "Lendo sua visão de negócio... 💡"
  ],
  cliente_final: [
    "Sentindo suas verdadeiras necessidades... ✨",
    "Decifrando seus desejos mais profundos... 🔮",
    "Captando sua energia estética... 🌟",
    "Descobrindo seus sonhos de beleza... 💫"
  ]
};

const FRASES_CONFIANCA = {
  profissional: {
    baixa: ["Ainda estou mapeando seu perfil clínico...", "Preciso entender melhor seu foco..."],
    media: ["Começando a ver seu padrão de atendimento...", "Sua especialidade está ficando clara..."],
    alta: ["Identifiquei exatamente seu equipamento ideal!", "Descobri o que vai revolucionar sua clínica!"]
  },
  cliente_final: {
    baixa: ["Ainda estou decifrando seus segredos...", "Sua essência está se revelando..."],
    media: ["Posso sentir suas necessidades emergindo...", "Seu desejo verdadeiro está se cristalizando..."],
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
    confianca_real: 0
  });

  // Algoritmo inteligente de correspondência semântica
  const calcularPontuacao = useCallback((equipamento: Equipment, respostas: Record<string, string>): number => {
    let pontuacao = 0;
    
    Object.entries(respostas).forEach(([perguntaId, resposta]) => {
      const pergunta = PERGUNTAS_ESTRATEGICAS.find(p => p.id === perguntaId);
      if (!pergunta) return;

      pergunta.criterios.forEach(criterio => {
        const textoEquipamento = String(equipamento[criterio.campo] || '').toLowerCase();
        const palavrasEncontradas = criterio.palavras_chave.filter(palavra => 
          textoEquipamento.includes(palavra.toLowerCase())
        );
        
        if (palavrasEncontradas.length > 0) {
          pontuacao += criterio.pontuacao * pergunta.peso * (palavrasEncontradas.length / criterio.palavras_chave.length);
        }
      });
    });

    return pontuacao;
  }, []);

  // Seleção inteligente da próxima pergunta
  const proximaPergunta = useMemo(() => {
    const perguntasDisponiveis = PERGUNTAS_ESTRATEGICAS.filter(p => {
      // Se ainda não definiu perfil, só pergunta de perfil
      if (estado.perfil_usuario === null) return p.tipo === "perfil";
      
      // Verifica se já foi feita
      if (estado.perguntas_feitas.includes(p.id)) return false;
      
      // Verifica se é aplicável ao perfil
      return p.aplicavel_para.includes(estado.perfil_usuario);
    });

    if (perguntasDisponiveis.length === 0) return null;

    // Prioriza perguntas de eliminação quando há muitos equipamentos
    if (estado.equipamentos_ativos.length > 3) {
      const eliminacao = perguntasDisponiveis.filter(p => p.tipo === "eliminacao");
      if (eliminacao.length > 0) return eliminacao.sort((a, b) => b.peso - a.peso)[0];
    }

    // Depois prioriza por peso
    return perguntasDisponiveis.sort((a, b) => b.peso - a.peso)[0];
  }, [estado.perguntas_feitas, estado.equipamentos_ativos.length, estado.perfil_usuario]);

  // Cálculo realístico de confiança
  const confiancaCalculada = useMemo(() => {
    const total = equipamentos.filter(eq => eq.akinator_enabled && eq.ativo).length;
    const restantes = estado.equipamentos_ativos.length;
    const perguntasFeitas = estado.perguntas_feitas.length;
    
    if (restantes <= 1) return 95;
    if (restantes <= 2) return 85;
    if (restantes <= 3 && perguntasFeitas >= 4) return 75;
    if (restantes <= 5 && perguntasFeitas >= 6) return 65;
    if (perguntasFeitas >= 8) return 60;
    
    return Math.max(5, Math.round(((total - restantes) / total) * 60 + (perguntasFeitas * 3)));
  }, [estado.equipamentos_ativos.length, estado.perguntas_feitas.length, equipamentos]);

  // Responder com eliminação inteligente
  const responder = useCallback(async (resposta: string) => {
    if (!proximaPergunta) return;
    
    setEstado(prev => ({ ...prev, pensando: true }));
    
    await new Promise(resolve => setTimeout(resolve, 2500)); // Suspense realístico
    
    const novasRespostas = { ...estado.respostas, [proximaPergunta.id]: resposta };
    
    // Definir perfil na primeira pergunta
    let novoPerfil = estado.perfil_usuario;
    if (proximaPergunta.tipo === "perfil") {
      novoPerfil = resposta.includes("profissional") || resposta.includes("Médico") ? "profissional" : "cliente_final";
    }

    // Recalcular pontuações para todos os equipamentos
    const novasPontuacoes: Record<string, number> = {};
    estado.equipamentos_ativos.forEach(eq => {
      novasPontuacoes[eq.id] = calcularPontuacao(eq, novasRespostas);
    });

    // Filtrar por equipamentos que fazem sentido (pontuação > 0)
    const equipamentosFiltrados = estado.equipamentos_ativos
      .filter(eq => novasPontuacoes[eq.id] > 0 || Object.keys(novasRespostas).length <= 2)
      .sort((a, b) => novasPontuacoes[b.id] - novasPontuacoes[a.id]);

    // Se filtrou demais, manter os top 3
    const equipamentosFinais = equipamentosFiltrados.length > 0 
      ? equipamentosFiltrados 
      : estado.equipamentos_ativos.slice(0, 3);

    const novaConfianca = confiancaCalculada;
    const novasFeitasIds = [...estado.perguntas_feitas, proximaPergunta.id];
    
    // Determinar fase: só tentativa se confiança alta E poucas opções
    let novaFase: FaseAkinator = "questionando";
    if ((novaConfianca >= 75 && equipamentosFinais.length <= 2) || novasFeitasIds.length >= 8) {
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
      fase: novaFase
    }));
  }, [proximaPergunta, estado, confiancaCalculada, calcularPontuacao]);

  // Gerar explicação baseada em dados reais
  const gerarExplicacao = useCallback((equipamento: Equipment, respostas: Record<string, string>, perfil: PerfilUsuario): string => {
    const pontos = [];
    
    // Análise específica por perfil
    if (perfil === "profissional") {
      pontos.push("sua experiência profissional na área");
      if (respostas.foco_profissional) {
        pontos.push(`seu foco em ${respostas.foco_profissional.toLowerCase()}`);
      }
    } else {
      pontos.push("suas necessidades pessoais únicas");
      if (respostas.motivacao_pessoal) {
        pontos.push(`sua motivação: ${respostas.motivacao_pessoal.toLowerCase()}`);
      }
    }

    // Análise técnica baseada em dados reais
    if (respostas.tecnologia_preferencia && equipamento.tecnologia) {
      const tecPreferida = respostas.tecnologia_preferencia.toLowerCase();
      const tecEquipamento = equipamento.tecnologia.toLowerCase();
      if (tecEquipamento.includes(tecPreferida.split(' ')[0])) {
        pontos.push(`sua preferência por tecnologia ${tecPreferida}`);
      }
    }

    if (respostas.problema_principal && equipamento.indicacoes) {
      const problema = respostas.problema_principal.toLowerCase();
      const indicacoes = String(equipamento.indicacoes).toLowerCase();
      if (indicacoes.includes(problema.split(' ')[0])) {
        pontos.push(`seu foco no problema: ${problema}`);
      }
    }

    const explicacaoBase = pontos.length > 0 
      ? `Através da análise de ${pontos.join(", ")}, pude detectar que` 
      : "Analisando cuidadosamente suas respostas, descobri que";
      
    return `${explicacaoBase} o ${equipamento.nome} é exatamente o que ${perfil === "profissional" ? "sua clínica" : "você"} precisa!`;
  }, []);

  // Fazer tentativa com equipamento melhor pontuado
  const fazerTentativa = useCallback(() => {
    const equipamentoEscolhido = estado.equipamentos_ativos[0]; // Já ordenado por pontuação
    const explicacao = gerarExplicacao(equipamentoEscolhido, estado.respostas, estado.perfil_usuario);
    
    setEstado(prev => ({
      ...prev,
      fase: "revelacao",
      tentativas: prev.tentativas + 1,
      explicacao_escolha: explicacao
    }));
  }, [estado, gerarExplicacao]);

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
      confianca_real: 0
    });
  }, [equipamentos]);

  // Frases contextuais baseadas no perfil
  const fraseMagica = useMemo(() => {
    if (!estado.perfil_usuario) return "Preparando a análise...";
    
    const frasesConf = FRASES_CONFIANCA[estado.perfil_usuario];
    if (estado.confianca_real >= 75) return frasesConf.alta[0];
    if (estado.confianca_real >= 50) return frasesConf.media[0];
    return frasesConf.baixa[0];
  }, [estado.confianca_real, estado.perfil_usuario]);

  const frasePensando = useMemo(() => {
    if (!estado.perfil_usuario) return "Inicializando sistema...";
    const frases = FRASES_PENSANDO[estado.perfil_usuario];
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
      pergunta: PERGUNTAS_ESTRATEGICAS.find(p => p.id === id)?.texto || "",
      resposta: estado.respostas[id] || ""
    })),
    fraseMagica,
    frasePensando,
    responder,
    fazerTentativa,
    reset,
    progressoPerguntas: estado.perguntas_feitas.length,
    totalPerguntas: PERGUNTAS_ESTRATEGICAS.filter(p => 
      estado.perfil_usuario ? p.aplicavel_para.includes(estado.perfil_usuario) : true
    ).length
  };
}
