
export const ELEMENTOS_CONFIG = [
  { key: 'storytelling', label: 'Storytelling', icon: '📖', cor: 'purple' },
  { key: 'copywriting', label: 'Copywriting', icon: '✍️', cor: 'green' },
  { key: 'conhecimento_publico', label: 'Público-alvo', icon: '🎯', cor: 'blue' },
  { key: 'equipamentos', label: 'Equipamentos', icon: '🔧', cor: 'orange' },
  { key: 'analises_dados', label: 'Análise de Dados', icon: '📊', cor: 'yellow' },
  { key: 'gatilhos_mentais', label: 'Gatilhos Mentais', icon: '🧠', cor: 'red' },
  { key: 'logica_argumentativa', label: 'Lógica', icon: '🔍', cor: 'indigo' },
  { key: 'premissas_educativas', label: 'Educação', icon: '🎓', cor: 'pink' },
  { key: 'mapas_empatia', label: 'Empatia', icon: '❤️', cor: 'cyan' },
  { key: 'headlines', label: 'Headlines', icon: '🔥', cor: 'gray' },
  { key: 'ferramentas_especificas', label: 'Ferramentas', icon: '🛠️', cor: 'purple' }
];

export const ELEMENTOS_UNIVERSAIS_TREE: Record<string, any> = {
  storytelling: {
    titulo: "📖 Storytelling",
    subtitulo: "Como você quer contar sua história?",
    descricao: "O storytelling é a base de toda comunicação envolvente.",
    question: "Qual abordagem narrativa combina mais com você?",
    options: [
      {
        value: "casos_reais",
        label: "Casos Reais",
        description: "Histórias de transformação de pacientes",
        leads_to: "copywriting"
      },
      {
        value: "jornada_heroi",
        label: "Jornada do Herói",
        description: "Narrativa épica de superação",
        leads_to: "copywriting"
      },
      {
        value: "metaforas",
        label: "Metáforas",
        description: "Comparações criativas e marcantes",
        leads_to: "copywriting"
      },
      {
        value: "testemunhos",
        label: "Testemunhos",
        description: "Depoimentos autênticos",
        leads_to: "copywriting"
      }
    ]
  },

  copywriting: {
    titulo: "✍️ Copywriting",
    subtitulo: "Qual é o seu estilo de escrita?",
    descricao: "O copy define como sua mensagem será percebida.",
    question: "Como você prefere se comunicar?",
    options: [
      {
        value: "direto_objetivo",
        label: "Direto e Objetivo",
        description: "Vai direto ao ponto, sem rodeios",
        leads_to: "conhecimento_publico"
      },
      {
        value: "emocional_envolvente",
        label: "Emocional e Envolvente",
        description: "Toca o coração antes da razão",
        leads_to: "conhecimento_publico"
      },
      {
        value: "cientifico_tecnico",
        label: "Científico e Técnico",
        description: "Baseado em evidências e dados",
        leads_to: "conhecimento_publico"
      },
      {
        value: "conversacional_amigavel",
        label: "Conversacional e Amigável",
        description: "Como uma conversa entre amigos",
        leads_to: "conhecimento_publico"
      }
    ]
  },

  conhecimento_publico: {
    titulo: "🎯 Conhecimento do Público-alvo",
    subtitulo: "Quem é o seu público ideal?",
    descricao: "Conhecer profundamente seu público é essencial para criar conteúdo relevante.",
    question: "Qual é o perfil do seu público principal?",
    options: [
      {
        value: "mulheres_25_40",
        label: "Mulheres 25-40 anos",
        description: "Jovens adultas focadas em prevenção",
        leads_to: "equipamentos"
      },
      {
        value: "mulheres_40_60",
        label: "Mulheres 40-60 anos",
        description: "Maduras buscando rejuvenescimento",
        leads_to: "equipamentos"
      },
      {
        value: "homens_30_50",
        label: "Homens 30-50 anos",
        description: "Profissionais cuidando da aparência",
        leads_to: "equipamentos"
      },
      {
        value: "publico_geral",
        label: "Público Geral",
        description: "Diversificado em idade e gênero",
        leads_to: "equipamentos"
      }
    ]
  },

  equipamentos: {
    titulo: "🔧 Equipamentos da Clínica",
    subtitulo: "Quais equipamentos você possui?",
    descricao: "Seus equipamentos são seus diferenciais. Vamos destacá-los no roteiro.",
    question: "Selecione os equipamentos que você quer destacar:",
    isMultipleChoice: true,
    options: [], // Será preenchido dinamicamente
    leads_to: "analises_dados"
  },

  analises_dados: {
    titulo: "📊 Análise de Dados",
    subtitulo: "Como você usa dados na comunicação?",
    descricao: "Dados bem apresentados aumentam a credibilidade e persuasão.",
    question: "Qual sua abordagem com dados e métricas?",
    options: [
      {
        value: "resultados_numericos",
        label: "Resultados Numéricos",
        description: "Percentuais e estatísticas claras",
        leads_to: "gatilhos_mentais"
      },
      {
        value: "antes_depois",
        label: "Antes e Depois",
        description: "Transformações visuais",
        leads_to: "gatilhos_mentais"
      },
      {
        value: "estudos_cientificos",
        label: "Estudos Científicos",
        description: "Pesquisas e evidências",
        leads_to: "gatilhos_mentais"
      },
      {
        value: "minimo_dados",
        label: "Mínimo de Dados",
        description: "Foco na experiência emocional",
        leads_to: "gatilhos_mentais"
      }
    ]
  },

  gatilhos_mentais: {
    titulo: "🧠 Gatilhos Mentais",
    subtitulo: "Qual estratégia de persuasão prefere?",
    descricao: "Gatilhos mentais éticos que movem as pessoas à ação.",
    question: "Que tipo de gatilho você quer usar?",
    options: [
      {
        value: "escassez",
        label: "Escassez",
        description: "Urgência e oportunidade limitada",
        leads_to: "logica_argumentativa"
      },
      {
        value: "prova_social",
        label: "Prova Social",
        description: "Outros já fizeram e aprovaram",
        leads_to: "logica_argumentativa"
      },
      {
        value: "autoridade",
        label: "Autoridade",
        description: "Expertise e credibilidade",
        leads_to: "logica_argumentativa"
      },
      {
        value: "reciprocidade",
        label: "Reciprocidade",
        description: "Dar valor antes de pedir algo",
        leads_to: "logica_argumentativa"
      }
    ]
  },

  logica_argumentativa: {
    titulo: "🔍 Lógica Argumentativa",
    subtitulo: "Como você estrutura seus argumentos?",
    descricao: "A lógica por trás dos seus argumentos define a força da persuasão.",
    question: "Qual estrutura argumentativa você prefere?",
    options: [
      {
        value: "problema_solucao",
        label: "Problema → Solução",
        description: "Identifica dor e oferece alívio",
        leads_to: "premissas_educativas"
      },
      {
        value: "beneficio_prova",
        label: "Benefício → Prova",
        description: "Promete e depois comprova",
        leads_to: "premissas_educativas"
      },
      {
        value: "comparacao",
        label: "Comparação",
        description: "Mostra vantagens vs. concorrência",
        leads_to: "premissas_educativas"
      },
      {
        value: "storytelling_logico",
        label: "Storytelling Lógico",
        description: "História que prova o ponto",
        leads_to: "premissas_educativas"
      }
    ]
  },

  premissas_educativas: {
    titulo: "🎓 Premissas Educativas",
    subtitulo: "Quanto você quer educar seu público?",
    descricao: "Educar antes de vender cria confiança e autoridade.",
    question: "Qual é seu nível de educação no conteúdo?",
    options: [
      {
        value: "educacao_completa",
        label: "Educação Completa",
        description: "Explicar tudo detalhadamente",
        leads_to: "mapas_empatia"
      },
      {
        value: "educacao_essencial",
        label: "Educação Essencial",
        description: "Só o que precisa saber",
        leads_to: "mapas_empatia"
      },
      {
        value: "dicas_rapidas",
        label: "Dicas Rápidas",
        description: "Informações práticas e diretas",
        leads_to: "mapas_empatia"
      },
      {
        value: "foco_acao",
        label: "Foco na Ação",
        description: "Mínima educação, máxima persuasão",
        leads_to: "mapas_empatia"
      }
    ]
  },

  mapas_empatia: {
    titulo: "❤️ Mapas de Empatia",
    subtitulo: "Como você se conecta emocionalmente?",
    descricao: "A empatia cria conexão verdadeira com seu público.",
    question: "Qual conexão emocional você quer criar?",
    options: [
      {
        value: "compreensao_profunda",
        label: "Compreensão Profunda",
        description: "Entender completamente as dores",
        leads_to: "headlines"
      },
      {
        value: "motivacao_inspiradora",
        label: "Motivação Inspiradora",
        description: "Inspirar a buscar o melhor",
        leads_to: "headlines"
      },
      {
        value: "acolhimento_cuidado",
        label: "Acolhimento e Cuidado",
        description: "Ser um porto seguro",
        leads_to: "headlines"
      },
      {
        value: "confianca_seguranca",
        label: "Confiança e Segurança",
        description: "Transmitir tranquilidade",
        leads_to: "headlines"
      }
    ]
  },

  headlines: {
    titulo: "🔥 Headlines",
    subtitulo: "Como você chama a atenção?",
    descricao: "O título é o que decide se vão ler ou passar para o próximo.",
    question: "Que estilo de título você prefere?",
    options: [
      {
        value: "curiosidade_intriga",
        label: "Curiosidade e Intriga",
        description: "Desperta curiosidade irresistível",
        leads_to: "ferramentas_especificas"
      },
      {
        value: "beneficio_claro",
        label: "Benefício Claro",
        description: "Promessa direta e objetiva",
        leads_to: "ferramentas_especificas"
      },
      {
        value: "urgencia_acao",
        label: "Urgência e Ação",
        description: "Motiva ação imediata",
        leads_to: "ferramentas_especificas"
      },
      {
        value: "pergunta_provocativa",
        label: "Pergunta Provocativa",
        description: "Questiona e engaja",
        leads_to: "ferramentas_especificas"
      }
    ]
  },

  ferramentas_especificas: {
    titulo: "🛠️ Ferramentas Específicas",
    subtitulo: "Como você quer finalizar?",
    descricao: "A ferramenta certa no final garante a conversão.",
    question: "Qual call-to-action você quer usar?",
    options: [
      {
        value: "agendamento_direto",
        label: "Agendamento Direto",
        description: "Link para agendamento online",
        leads_to: "tema"
      },
      {
        value: "whatsapp_conversa",
        label: "WhatsApp para Conversa",
        description: "Convite para conversar no WhatsApp",
        leads_to: "tema"
      },
      {
        value: "material_educativo",
        label: "Material Educativo",
        description: "E-book, guia ou vídeo gratuito",
        leads_to: "tema"
      },
      {
        value: "promocao_limitada",
        label: "Promoção Limitada",
        description: "Oferta especial por tempo limitado",
        leads_to: "tema"
      }
    ]
  },

  tema: {
    titulo: "💭 Tema do Conteúdo",
    subtitulo: "Sobre o que você quer falar?",
    descricao: "Descreva o tema principal do seu roteiro.",
    mentorPhrase: "Com todos os elementos definidos, agora me conte especificamente sobre o que você quer criar conteúdo!",
    isTextInput: true,
    next: null
  }
};
