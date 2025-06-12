

export const AKINATOR_TREE: Record<string, any> = {
  canal: {
    pergunta: "Onde você vai publicar o conteúdo?",
    titulo: "📢 Canal de Publicação",
    subtitulo: "Escolha a plataforma para seu conteúdo",
    descricao: "Cada canal tem formatos específicos e limitações técnicas.",
    options: [
      {
        value: "instagram",
        label: "Instagram",
        emoji: "📸",
        description: "Stories, Carrossel, Post Estático, Reels (60s)",
        exemplo: "Visual, jovem e engajado"
      },
      {
        value: "youtube",
        label: "YouTube",
        emoji: "📺",
        description: "Short (40s) ou Vídeo (3 min)",
        exemplo: "Conteúdo detalhado e educativo"
      },
      {
        value: "tiktok", 
        label: "TikTok",
        emoji: "🎵",
        description: "Reels até 60 segundos",
        exemplo: "Conteúdo viral e dinâmico"
      },
      {
        value: "ads",
        label: "Criativo para Ads",
        emoji: "🎯", 
        description: "Post ou Reels (30s)",
        exemplo: "Foco em conversão e vendas"
      }
    ],
    next: "formato"
  },

  formato: {
    pergunta: "Que formato você quer criar?",
    titulo: "🎬 Formato do Conteúdo",
    subtitulo: "Escolha o formato ideal baseado no canal",
    descricao: "Formatos disponíveis para o canal selecionado.",
    conditional: true,
    options: {
      instagram: [
        {
          value: "stories",
          label: "Stories",
          emoji: "📱",
          description: "Vertical, 15 segundos por card",
          tempo_limite: "60s total",
          output_tipo: "roteiro_temporal"
        },
        {
          value: "carrossel",
          label: "Carrossel", 
          emoji: "🎠",
          description: "Múltiplas imagens educativas",
          tempo_limite: "Texto por card",
          output_tipo: "cards_estruturados"
        },
        {
          value: "post_estatico",
          label: "Post Estático",
          emoji: "🖼️",
          description: "Imagem única impactante",
          tempo_limite: "Leitura rápida",
          output_tipo: "imagem_legenda"
        },
        {
          value: "reels",
          label: "Reels",
          emoji: "🎥",
          description: "Vídeo vertical dinâmico",
          tempo_limite: "60 segundos",
          output_tipo: "roteiro_temporal"
        }
      ],
      youtube: [
        {
          value: "short",
          label: "YouTube Short",
          emoji: "⚡",
          description: "Vídeo vertical curto",
          tempo_limite: "40 segundos",
          output_tipo: "roteiro_temporal"
        },
        {
          value: "video",
          label: "Vídeo YouTube",
          emoji: "📹",
          description: "Conteúdo horizontal detalhado",
          tempo_limite: "3 minutos",
          output_tipo: "roteiro_detalhado"
        }
      ],
      tiktok: [
        {
          value: "reels",
          label: "TikTok Reels",
          emoji: "🎵",
          description: "Vídeo viral e dinâmico",
          tempo_limite: "60 segundos",
          output_tipo: "roteiro_temporal"
        }
      ],
      ads: [
        {
          value: "post_ads",
          label: "Post para Ads",
          emoji: "📝",
          description: "Imagem com copy persuasivo",
          tempo_limite: "Leitura rápida",
          output_tipo: "copy_ads"
        },
        {
          value: "reels_ads",
          label: "Reels para Ads",
          emoji: "🎬",
          description: "Vídeo focado em conversão",
          tempo_limite: "30 segundos",
          output_tipo: "roteiro_ads"
        }
      ]
    },
    next: "objetivo"
  },

  objetivo: {
    pergunta: "Qual é o seu objetivo principal?",
    titulo: "🎯 Objetivo do Conteúdo",
    subtitulo: "Defina a intenção por trás da sua mensagem",
    descricao: "Cada objetivo requer uma abordagem estratégica diferente.",
    options: [
      {
        value: "atrair",
        label: "Atrair Novos Clientes",
        emoji: "🧲",
        description: "Despertar interesse e curiosidade",
        exemplo: "Conteúdos educativos, transformações"
      },
      {
        value: "vender",
        label: "Vender Tratamentos",
        emoji: "💰",
        description: "Converter interesse em vendas",
        exemplo: "Promoções, urgência, benefícios"
      },
      {
        value: "conectar",
        label: "Conectar com Audiência",
        emoji: "❤️",
        description: "Criar vínculo emocional e confiança", 
        exemplo: "Histórias pessoais, valores da clínica"
      },
      {
        value: "educar",
        label: "Educar o Público",
        emoji: "📚",
        description: "Informar sobre procedimentos e cuidados",
        exemplo: "Explicações técnicas, mitos e verdades"
      }
    ],
    next: "estilo"
  },

  estilo: {
    pergunta: "Que estilo combina com você?",
    titulo: "🎨 Estilo de Comunicação",
    subtitulo: "Defina a personalidade da sua mensagem",
    descricao: "Seu estilo deve refletir a identidade da sua clínica.",
    options: [
      {
        value: "criativo",
        label: "Criativo e Inovador",
        emoji: "🎨",
        description: "Original, artístico e diferenciado",
        exemplo: "Metáforas, storytelling visual"
      },
      {
        value: "cientifico",
        label: "Científico e Técnico", 
        emoji: "🔬",
        description: "Baseado em evidências e dados",
        exemplo: "Estudos, procedimentos detalhados"
      },
      {
        value: "emocional",
        label: "Emocional e Inspirador",
        emoji: "💫",
        description: "Focado em sentimentos e transformação",
        exemplo: "Histórias de superação, autoestima"
      },
      {
        value: "direto",
        label: "Direto e Objetivo",
        emoji: "🎯",
        description: "Claro, sem rodeios",
        exemplo: "Resultados rápidos, soluções práticas"
      }
    ],
    next: "equipamento"
  },

  equipamento: {
    pergunta: "Quais equipamentos você tem? (pode escolher mais de 1)",
    titulo: "🔧 Equipamentos Disponíveis",
    subtitulo: "Selecione os equipamentos da sua clínica",
    descricao: "Vamos criar conteúdo baseado nos seus recursos.",
    multiSelect: true,
    options: [
      // Estes serão substituídos pelos equipamentos do banco de dados
      {
        value: "laser",
        label: "Laser",
        emoji: "💡",
        description: "Tratamentos a laser"
      }
    ],
    next: "tema"
  },

  tema: {
    pergunta: "Sobre o que você quer falar?",
    titulo: "💭 Tema do Conteúdo",
    subtitulo: "Descreva uma dor, característica do público ou data comemorativa",
    descricao: "Campo aberto para personalizar seu conteúdo.",
    placeholder: "Ex: Manchas no rosto incomodam muito / Público que quer autoestima / Dia da Mulher",
    mentorPhrase: "Quanto mais específico você for, melhor será o roteiro!",
    isTextInput: true,
    next: null // Final da árvore
  }
};

// Configurações de tempo por formato
export const FORMATO_CONFIGS: Record<string, any> = {
  stories: {
    tempo_limite_segundos: 60,
    palavras_max: 100,
    estrutura: "cards_temporais"
  },
  carrossel: {
    tempo_limite_segundos: null,
    palavras_por_card: 25,
    cards_max: 8,
    estrutura: "slides_educativos"
  },
  post_estatico: {
    tempo_limite_segundos: null,
    palavras_max: 150,
    estrutura: "imagem_texto"
  },
  reels: {
    tempo_limite_segundos: 60,
    palavras_max: 120,
    estrutura: "roteiro_video"
  },
  short: {
    tempo_limite_segundos: 40,
    palavras_max: 80,
    estrutura: "roteiro_video"
  },
  video: {
    tempo_limite_segundos: 180,
    palavras_max: 400,
    estrutura: "roteiro_detalhado"
  },
  post_ads: {
    tempo_limite_segundos: null,
    palavras_max: 100,
    estrutura: "copy_persuasivo"
  },
  reels_ads: {
    tempo_limite_segundos: 30,
    palavras_max: 60,
    estrutura: "roteiro_conversao"
  }
};

// Add mentor definitions for the tree
export interface ScriptIntention {
  canal: string;
  formato: string;
  objetivo: string;
  estilo: string;
  equipamento?: string;
  tema: string;
}

export const MENTOR_ENIGMAS: Record<string, string> = {
  'leandro_ladeira': "Quem domina gatilhos, vende mais que imagina.",
  'icaro_carvalho': "Histórias que tocam, convertem sem forçar.",
  'paulo_cuenca': "Criatividade visual que marca para sempre.",
  'camila_porto': "Simplicidade que todos entendem e seguem.",
  'hyeser_souza': "Humor que viraliza e vende sorrindo.",
  'washington_olivetto': "Big ideas que mudam mercados inteiros.",
  'pedro_sobral': "Lógica clara que antecipa objeções."
};

export const MENTOR_PROFILES: Record<string, { name: string; focus: string; style: string }> = {
  'leandro_ladeira': { 
    name: 'Leandro Ladeira', 
    focus: 'Gatilhos mentais e CTAs fortes',
    style: 'Direto, persuasivo, focado em conversão'
  },
  'icaro_carvalho': { 
    name: 'Ícaro de Carvalho', 
    focus: 'Storytelling emocional',
    style: 'Narrativo, emocional, conectivo'
  },
  'paulo_cuenca': { 
    name: 'Paulo Cuenca', 
    focus: 'Criatividade audiovisual',
    style: 'Visual, criativo, impactante'
  },
  'camila_porto': { 
    name: 'Camila Porto', 
    focus: 'Linguagem acessível',
    style: 'Simples, didático, inclusivo'
  },
  'hyeser_souza': { 
    name: 'Hyeser Souza', 
    focus: 'Humor viral',
    style: 'Engraçado, viral, descontraído'
  },
  'washington_olivetto': { 
    name: 'Washington Olivetto', 
    focus: 'Big ideas publicitárias',
    style: 'Conceitual, publicitário, memorável'
  },
  'pedro_sobral': { 
    name: 'Pedro Sobral', 
    focus: 'Clareza lógica e antecipação',
    style: 'Lógico, estruturado, antecipativo'
  }
};
