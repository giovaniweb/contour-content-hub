
export const SCRIPT_INTENTION_TREE: Record<string, any> = {
  root: {
    question: "🎬 Que tipo de conteúdo você quer criar?",
    options: [
      {
        value: 'carrossel',
        label: 'Carrossel',
        emoji: '📱',
        description: 'Múltiplos slides deslizáveis',
        leads_to: 'objetivo'
      },
      {
        value: 'stories',
        label: 'Stories',
        emoji: '📸',
        description: 'Conteúdo vertical e rápido',
        leads_to: 'objetivo'
      },
      {
        value: 'imagem',
        label: 'Imagem Única',
        emoji: '🖼️',
        description: 'Post com arte única',
        leads_to: 'objetivo'
      },
      {
        value: 'video',
        label: 'Vídeo/Reels',
        emoji: '🎬',
        description: 'Conteúdo audiovisual',
        leads_to: 'objetivo'
      }
    ]
  },
  objetivo: {
    question: "🎯 Qual o seu objetivo principal?",
    options: [
      {
        value: 'atrair',
        label: 'Atrair Atenção',
        emoji: '🟡',
        description: 'Gerar curiosidade e awareness',
        leads_to: 'canal'
      },
      {
        value: 'conectar',
        label: 'Criar Conexão',
        emoji: '🟢',
        description: 'Humanizar e gerar identificação',
        leads_to: 'canal'
      },
      {
        value: 'vender',
        label: 'Fazer Comprar',
        emoji: '🔴',
        description: 'Converter e gerar vendas',
        leads_to: 'canal'
      },
      {
        value: 'reativar',
        label: 'Reativar Interesse',
        emoji: '🔁',
        description: 'Despertar audiência fria',
        leads_to: 'canal'
      }
    ]
  },
  canal: {
    question: "📱 Onde vai publicar principalmente?",
    options: [
      {
        value: 'instagram',
        label: 'Instagram Feed',
        emoji: '📷',
        description: 'Posts no feed principal',
        leads_to: 'estilo'
      },
      {
        value: 'instagram_stories',
        label: 'Instagram Stories',
        emoji: '📸',
        description: 'Stories temporários',
        leads_to: 'estilo'
      },
      {
        value: 'tiktok',
        label: 'TikTok',
        emoji: '🎵',
        description: 'Vídeos curtos virais',
        leads_to: 'estilo'
      },
      {
        value: 'facebook',
        label: 'Facebook',
        emoji: '👥',
        description: 'Rede mais madura',
        leads_to: 'estilo'
      }
    ]
  },
  estilo: {
    question: "🎨 Que estilo combina com você?",
    options: [
      {
        value: 'criativo',
        label: 'Criativo',
        emoji: '🎨',
        description: 'Inovador e diferenciado',
        leads_to: 'equipamento'
      },
      {
        value: 'direto',
        label: 'Direto',
        emoji: '🎯',
        description: 'Claro e objetivo',
        leads_to: 'equipamento'
      },
      {
        value: 'emocional',
        label: 'Emocional',
        emoji: '❤️',
        description: 'Toca o coração',
        leads_to: 'equipamento'
      },
      {
        value: 'tecnico',
        label: 'Técnico',
        emoji: '🔬',
        description: 'Dados e evidências',
        leads_to: 'equipamento'
      }
    ]
  },
  equipamento: {
    question: "⚕️ Tem algum equipamento específico?",
    options: [
      {
        value: 'hifu',
        label: 'HIFU',
        emoji: '🔥',
        description: 'Ultrassom focado',
        leads_to: 'tema'
      },
      {
        value: 'laser',
        label: 'Laser',
        emoji: '✨',
        description: 'Tratamentos a laser',
        leads_to: 'tema'
      },
      {
        value: 'bioestimulador',
        label: 'Bioestimulador',
        emoji: '💉',
        description: 'Estímulo de colágeno',
        leads_to: 'tema'
      },
      {
        value: 'nenhum',
        label: 'Protocolo Geral',
        emoji: '🏥',
        description: 'Sem equipamento específico',
        leads_to: 'tema'
      }
    ]
  }
};
