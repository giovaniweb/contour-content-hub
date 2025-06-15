
/**
 * Intention Tree Akinator Style – Versão Ramificada (descoberta)
 */

export type IntentionNode = {
  id: string;
  text: string;
  options: string[];
  type: 'inicio' | 'area' | 'sintoma' | 'profundidade' | 'final' | 'perfil';
  next?: Record<string, string> | string;
  emoji?: string;
  destaque?: boolean;
};

export const INTENTION_TREE: IntentionNode[] = [
  // INÍCIO: Detecção de perfil
  {
    id: 'init',
    type: 'inicio',
    text: 'Com qual das situações abaixo você mais se identifica?',
    emoji: '🔍',
    options: [
      'Quero tratar algo na minha pele ou corpo',
      'Atendo clientes na área da estética',
      'Só curioso(a), não estou buscando nada',
    ],
    next: {
      'Quero tratar algo na minha pele ou corpo': 'area_desejo',
      'Atendo clientes na área da estética': 'perfil_profissional',
      'Só curioso(a), não estou buscando nada': 'final_curioso',
    }
  },

  // FLUXO – CLIENTE FINAL
  {
    id: 'area_desejo',
    type: 'area',
    text: 'Qual dessas áreas é seu maior desejo de melhorar?',
    emoji: '🪞',
    options: ['Rosto', 'Corpo', 'Não tenho preferência'],
    next: {
      'Rosto': 'sintoma_rosto',
      'Corpo': 'sintoma_corpo',
      'Não tenho preferência': 'sintoma_geral'
    }
  },
  {
    id: 'sintoma_rosto',
    type: 'sintoma',
    text: 'No rosto, qual desses te incomoda mais?',
    emoji: '😶',
    options: ['Manchas ou melasma', 'Linhas/falidez', 'Acne', 'Outro/difícil dizer'],
    next: {
      'Manchas ou melasma': 'profundidade_manchas',
      'Linhas/falidez': 'profundidade_falidez',
      'Acne': 'final_acne',
      'Outro/difícil dizer': 'final_exploratorio'
    }
  },
  {
    id: 'sintoma_corpo',
    type: 'sintoma',
    text: 'No corpo, o que mais gostaria de trabalhar?',
    emoji: '💪',
    options: ['Gordura localizada', 'Flacidez', 'Celulite/estrias', 'Outro/difícil dizer'],
    next: {
      'Gordura localizada': 'profundidade_gordura',
      'Flacidez': 'final_flacidezcorpo',
      'Celulite/estrias': 'final_celulite',
      'Outro/difícil dizer': 'final_exploratorio'
    }
  },
  {
    id: 'sintoma_geral',
    type: 'sintoma',
    text: 'Buscando prevenção ou solução para algo específico?',
    emoji: '✨',
    options: ['Só prevenção', 'Já tenho um incômodo', 'Não sei dizer'],
    next: {
      'Só prevenção': 'final_prevencao',
      'Já tenho um incômodo': 'area_desejo',
      'Não sei dizer': 'final_exploratorio'
    }
  },

  // PROFUNDIDADE – perguntas extras para ramificar
  {
    id: 'profundidade_manchas',
    type: 'profundidade',
    text: 'Essas manchas são mais recentes ou já estão há muitos anos?',
    emoji: '🌤️',
    options: ['Recentes', 'Muitos anos', 'Não tenho certeza'],
    next: {
      'Recentes': 'final_manchas_recente',
      'Muitos anos': 'final_manchas_cronicas',
      'Não tenho certeza': 'final_manchas'
    }
  },
  {
    id: 'profundidade_falidez',
    type: 'profundidade',
    text: 'Você sente mais falta de firmeza ou só pequenas linhas marcadas?',
    emoji: '💧',
    options: ['Falta de firmeza', 'Só linhas', 'Ambos'],
    next: {
      'Falta de firmeza': 'final_falidez',
      'Só linhas': 'final_linhas',
      'Ambos': 'final_falidez'
    }
  },
  {
    id: 'profundidade_gordura',
    type: 'profundidade',
    text: 'A gordura que te incomoda é resistente à dieta/academia?',
    emoji: '🥑',
    options: ['Sim', 'Não tenho certeza', 'Não'],
    next: {
      'Sim': 'final_gorduraresistente',
      'Não tenho certeza': 'final_gordura',
      'Não': 'final_gordura'
    }
  },

  // FINAIS – CLIENTE
  {
    id: 'final_manchas_recente',
    type: 'final',
    destaque: true,
    text: '🎉 Diagnóstico: Foco em manchas recentes. Está no melhor momento para prevenir que elas se fixem. Considere consultar um especialista para indicar ativos despigmentantes e tratamentos de luz/laser!',
    options: []
  },
  {
    id: 'final_manchas_cronicas',
    type: 'final',
    destaque: true,
    text: '✨ Diagnóstico: Manchas antigas precisam de acompanhamento mais regular! Invista em protocolos de clareamento e proteção solar reforçada. Tecnologia pode acelerar o processo!',
    options: []
  },
  {
    id: 'final_manchas',
    type: 'final',
    destaque: true,
    text: '🔮 Diagnóstico: O tratamento de manchas depende do tempo e do tipo delas. Una proteção + clareadores com tecnologia para melhores resultados.',
    options: []
  },
  {
    id: 'final_falidez',
    type: 'final',
    destaque: true,
    text: '🪄 Diagnóstico: Sinais de flacidez! Aposte em bioestimuladores, ultrassom ou radiofrequência avançada para devolver firmeza à pele.',
    options: []
  },
  {
    id: 'final_linhas',
    type: 'final',
    destaque: true,
    text: '💡 Diagnóstico: Pequenas linhas podem ser suavizadas com hidratação profunda e tecnologias não invasivas. Que tal começar?',
    options: []
  },
  {
    id: 'final_acne',
    type: 'final',
    destaque: true,
    text: '🔥 Diagnóstico: Acne ativa! Higienização e acompanhamento profissional são essenciais. Existem protocolos para seu caso!',
    options: []
  },
  {
    id: 'final_flacidezcorpo',
    type: 'final',
    destaque: true,
    text: '🏆 Diagnóstico: Flacidez corporal detectada! Equipamentos de radiofrequência e bioestímulo podem ser ideais.',
    options: []
  },
  {
    id: 'final_gorduraresistente',
    type: 'final',
    destaque: true,
    text: '🧊 Diagnóstico: Gordura localizada resistente! Tecnologia como criolipólise e ultrassom são recomendadas.',
    options: []
  },
  {
    id: 'final_gordura',
    type: 'final',
    destaque: true,
    text: '💭 Diagnóstico: Gordura localizada. Associe exercícios, alimentação e, se possível, tratamentos corporais modernos.',
    options: []
  },
  {
    id: 'final_celulite',
    type: 'final',
    destaque: true,
    text: '🌟 Diagnóstico: Celulite ou estrias desafiam muitas pessoas! Protocolos multiprofissionais são os mais indicados.',
    options: []
  },
  {
    id: 'final_exploratorio',
    type: 'final',
    destaque: true,
    text: '🤔 Diagnóstico: Vamos explorar juntos! Talvez um atendimento personalizado ajude a entender melhor seu momento.',
    options: []
  },
  {
    id: 'final_prevencao',
    type: 'final',
    destaque: true,
    text: '🛡️ Diagnóstico: Parabéns pelo foco em prevenção! Proteção solar e hábitos saudáveis são o segredo.',
    options: []
  },
  {
    id: 'final_curioso',
    type: 'final',
    destaque: true,
    text: '🙃 Curiosidade é ótima! Quando quiser personalizar, volte aqui 😉',
    options: []
  },

  // FLUXO – PROFISSIONAL ESTÉTICA
  {
    id: 'perfil_profissional',
    type: 'perfil',
    text: 'Você já atua na estética ou está começando?',
    emoji: '👩‍⚕️',
    options: ['Já atuo', 'Começando agora', 'Quero transição de carreira'],
    next: {
      'Já atuo': 'atende_tipo',
      'Começando agora': 'final_novato',
      'Quero transição de carreira': 'final_transicao'
    }
  },
  {
    id: 'atende_tipo',
    type: 'perfil',
    text: 'Seu atendimento é mais focado em rosto, corpo ou ambos?',
    emoji: '🧑‍🔬',
    options: ['Rosto', 'Corpo', 'Ambos'],
    next: {
      'Rosto': 'final_prof_rosto',
      'Corpo': 'final_prof_corpo',
      'Ambos': 'final_prof_ambos'
    }
  },
  {
    id: 'final_prof_rosto',
    type: 'final',
    destaque: true,
    text: '🩵 Perfil profissional: Especialista em procedimentos faciais! Continue investindo em protocolos e inovação para surpreender seus clientes.',
    options: []
  },
  {
    id: 'final_prof_corpo',
    type: 'final',
    destaque: true,
    text: '💙 Perfil profissional: Foco corporal! Equipamentos de última geração e atendimento humanizado te destacam.',
    options: []
  },
  {
    id: 'final_prof_ambos',
    type: 'final',
    destaque: true,
    text: '🤝 Perfil profissional: Integrado! Manter amplo repertório de soluções para corpo e face é seu diferencial.',
    options: []
  },
  {
    id: 'final_novato',
    type: 'final',
    destaque: true,
    text: '🚀 Novato(a) na estética! A base sólida traz segurança: invista em formação e conexão com clientes.',
    options: []
  },
  {
    id: 'final_transicao',
    type: 'final',
    destaque: true,
    text: '🔄 Pronto(a) para transição! Reforce conhecimentos e busque mentoria para acelerar a nova fase.',
    options: []
  }
];
