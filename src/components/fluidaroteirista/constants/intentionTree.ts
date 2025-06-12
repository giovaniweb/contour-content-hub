
export const AKINATOR_TREE: Record<string, any> = {
  tipo_conteudo: {
    pergunta: "Que tipo de conteúdo você quer criar?",
    titulo: "📱 Formato do Conteúdo",
    subtitulo: "Escolha o formato ideal para sua mensagem",
    descricao: "Cada formato tem suas próprias características e vantagens.",
    options: [
      {
        value: "carrossel",
        label: "Carrossel",
        emoji: "🎠",
        description: "Múltiplas imagens com texto educativo",
        exemplo: "Antes e depois, passo a passo de procedimentos"
      },
      {
        value: "stories",
        label: "Stories",
        emoji: "📱",
        description: "Conteúdo vertical, rápido e engajante",
        exemplo: "Dicas rápidas, bastidores da clínica"
      },
      {
        value: "imagem",
        label: "Imagem Única",
        emoji: "🖼️",
        description: "Uma imagem impactante com texto",
        exemplo: "Promoções, frases inspiradoras"
      },
      {
        value: "video",
        label: "Vídeo",
        emoji: "🎥",
        description: "Conteúdo audiovisual dinâmico",
        exemplo: "Demonstrações, depoimentos"
      }
    ],
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
        value: "educar",
        label: "Educar o Público",
        emoji: "📚",
        description: "Informar sobre procedimentos e cuidados",
        exemplo: "Explicações técnicas, mitos e verdades"
      },
      {
        value: "conectar",
        label: "Conectar com Audiência",
        emoji: "❤️",
        description: "Criar vínculo emocional e confiança",
        exemplo: "Histórias pessoais, valores da clínica"
      }
    ],
    next: "canal"
  },

  canal: {
    pergunta: "Onde você vai publicar?",
    titulo: "📢 Canal de Publicação",
    subtitulo: "Escolha a plataforma ideal para seu conteúdo",
    descricao: "Cada rede social tem seu próprio público e linguagem.",
    options: [
      {
        value: "instagram",
        label: "Instagram",
        emoji: "📸",
        description: "Visual, jovem e engajado",
        exemplo: "Stories, Feed, Reels"
      },
      {
        value: "facebook",
        label: "Facebook",
        emoji: "👥",
        description: "Público mais amplo e maduro",
        exemplo: "Posts informativos, vídeos longos"
      },
      {
        value: "whatsapp",
        label: "WhatsApp",
        emoji: "💬",
        description: "Comunicação direta e pessoal",
        exemplo: "Status, grupos, listas de transmissão"
      },
      {
        value: "site",
        label: "Site/Blog",
        emoji: "🌐",
        description: "Conteúdo detalhado e SEO",
        exemplo: "Artigos, páginas de serviços"
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
    pergunta: "Quais equipamentos você tem?",
    titulo: "🔧 Equipamentos Disponíveis",
    subtitulo: "Selecione os equipamentos da sua clínica",
    descricao: "Vamos criar conteúdo baseado nos seus recursos.",
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
    subtitulo: "Descreva o assunto principal",
    descricao: "Seja específico sobre o que quer comunicar.",
    mentorPhrase: "Quanto mais detalhes você fornecer, melhor será o roteiro criado para você!",
    isTextInput: true,
    next: null // Final da árvore
  }
};
