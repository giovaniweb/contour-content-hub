
export const SCRIPT_INTENTION_TREE = {
  root: {
    id: 'root',
    question: '✨ Vamos começar a mágica: Qual o palco da sua história?',
    options: [
      {
        value: 'bigIdea',
        label: '💡 5 Ideias Virais',
        emoji: '💡',
        description: 'Preciso de inspiração criativa',
        leads_to: 'objetivo'
      },
      {
        value: 'stories',
        label: '📱 Stories Envolvente',
        emoji: '📱',
        description: 'Quero conexão íntima',
        leads_to: 'objetivo'
      },
      {
        value: 'carousel',
        label: '🎠 Carrossel Educativo',
        emoji: '🎠',
        description: 'Preciso educar e atrair',
        leads_to: 'objetivo'
      },
      {
        value: 'image',
        label: '🖼️ Imagem Impactante',
        emoji: '🖼️',
        description: 'Quero chamar atenção',
        leads_to: 'objetivo'
      },
      {
        value: 'video',
        label: '🎬 Vídeo Completo',
        emoji: '🎬',
        description: 'Preciso explicar detalhes',
        leads_to: 'objetivo'
      }
    ]
  },
  objetivo: {
    id: 'objetivo',
    question: '💫 O que seu coração quer despertar nas pessoas?',
    options: [
      {
        value: 'atrair',
        label: '✨ Preciso de atenção',
        emoji: '✨',
        description: 'Conquistar novos olhares',
        leads_to: 'canal'
      },
      {
        value: 'vender',
        label: '💎 Quero conversão',
        emoji: '💎',
        description: 'Transformar interesse em venda',
        leads_to: 'canal'
      },
      {
        value: 'educar',
        label: '🧠 Preciso ensinar',
        emoji: '🧠',
        description: 'Compartilhar conhecimento valioso',
        leads_to: 'canal'
      },
      {
        value: 'conectar',
        label: '❤️ Quero conexão profunda',
        emoji: '❤️',
        description: 'Criar vínculo emocional',
        leads_to: 'canal'
      },
      {
        value: 'posicionar',
        label: '👑 Mostrar autoridade',
        emoji: '👑',
        description: 'Estabelecer expertise',
        leads_to: 'canal'
      }
    ]
  },
  canal: {
    id: 'canal',
    question: '🌟 Onde sua história vai brilhar primeiro?',
    options: [
      {
        value: 'instagram',
        label: '📸 Instagram',
        emoji: '📸',
        description: 'Visual e inspiracional',
        leads_to: 'estilo'
      },
      {
        value: 'tiktok',
        label: '🎵 TikTok',
        emoji: '🎵',
        description: 'Dinâmico e viral',
        leads_to: 'estilo'
      },
      {
        value: 'youtube',
        label: '🎬 YouTube',
        emoji: '🎬',
        description: 'Educativo e detalhado',
        leads_to: 'estilo'
      },
      {
        value: 'linkedin',
        label: '💼 LinkedIn',
        emoji: '💼',
        description: 'Profissional e científico',
        leads_to: 'estilo'
      }
    ]
  },
  estilo: {
    id: 'estilo',
    question: '🎭 Que personalidade sua marca vai vestir hoje?',
    options: [
      {
        value: 'criativo',
        label: '🎨 Tom Criativo',
        emoji: '🎨',
        description: 'Inovador e artístico',
        sample: '"Transforme sua pele numa obra de arte"',
        leads_to: 'equipamento'
      },
      {
        value: 'cientifico',
        label: '🔬 Tom Científico',
        emoji: '🔬',
        description: 'Técnico e confiável',
        sample: '"Tecnologia comprovada cientificamente"',
        leads_to: 'equipamento'
      },
      {
        value: 'inspiracional',
        label: '✨ Tom Inspiracional',
        emoji: '✨',
        description: 'Motivador e transformador',
        sample: '"Sua melhor versão te espera"',
        leads_to: 'equipamento'
      },
      {
        value: 'conversacional',
        label: '💬 Tom Amigável',
        emoji: '💬',
        description: 'Próximo e caloroso',
        sample: '"Vem conversar comigo sobre isso"',
        leads_to: 'equipamento'
      }
    ]
  },
  equipamento: {
    id: 'equipamento',
    question: '🔧 Qual equipamento será o protagonista da história?',
    options: []
  },
  tema: {
    id: 'tema',
    question: '📝 Conta pra mim o que você quer criar...',
    isTextInput: true,
    mentorPhrase: 'Estou aqui para dar vida às suas ideias! ✨'
  }
};

export const MENTOR_PHRASES = {
  criativo: [
    "Deixa a criatividade fluir...",
    "A mágica está acontecendo...",
    "Criando algo único para você...",
    "Sua história está ganhando vida..."
  ],
  cientifico: [
    "Analisando dados científicos...",
    "Formulando estratégia baseada em evidências...",
    "Processando estudos mais recentes...",
    "Criando conteúdo comprovadamente eficaz..."
  ],
  inspiracional: [
    "Despertando a motivação...",
    "Criando inspiração pura...",
    "Sua transformação está sendo escrita...",
    "Preparando algo que vai tocar corações..."
  ],
  conversacional: [
    "Preparando nossa conversa...",
    "Criando conexão verdadeira...",
    "Pensando como uma amiga pensaria...",
    "Sua história íntima está nascendo..."
  ]
};
