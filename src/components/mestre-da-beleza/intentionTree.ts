
/**
 * Intention Tree "Akinator Style" - Agora com detecção de perfil!
 */

export type IntentionNode = {
  id: string;
  text: string;
  options: string[];
  type: 'inicio' | 'perfil' | 'cotidiano' | 'desejo' | 'sentimento' | 'experiencia' | 'preferencia' | 'final';
  next?: Record<string, string> | string;
  emoji?: string;
};

// NOVA EDIÇÃO: pergunta inicial para detectar o perfil
export const INTENTION_TREE: IntentionNode[] = [
  {
    id: 'init',
    type: 'inicio',
    text: 'Antes de realizarmos seu diagnóstico mágico... qual frase te define melhor?',
    emoji: '🔮',
    options: [
      'Eu atendo ou trabalho oferecendo procedimentos estéticos',
      'Quero melhorar minha autoestima ou fazer tratamentos para mim'
    ],
    next: {
      'Eu atendo ou trabalho oferecendo procedimentos estéticos': 'perfil_profissional',
      'Quero melhorar minha autoestima ou fazer tratamentos para mim': 'perfil_cliente'
    }
  },

  // Caminho PROFISSIONAL
  {
    id: 'perfil_profissional',
    type: 'perfil',
    text: 'Qual seu nível de experiência no universo da estética?',
    emoji: '💼',
    options: [
      'Experiente / já atendo há anos',
      'Começando agora na estética',
      'Busco transição de carreira',
      'Só curiosidade mesmo'
    ],
    next: 'pro_motivacao'
  },
  {
    id: 'pro_motivacao',
    type: 'desejo',
    text: 'O que mais te inspira como profissional?',
    emoji: '🚀',
    options: [
      'Resultados dos pacientes',
      'Reconhecimento no mercado',
      'Tecnologia e inovação',
      'Autonomia e qualidade de vida'
    ],
    next: 'pro_dificuldade'
  },
  {
    id: 'pro_dificuldade',
    type: 'cotidiano',
    text: 'Qual maior desafio sente na jornada profissional atual?',
    emoji: '🧗',
    options: [
      'Atrair mais clientes',
      'Se destacar pela qualidade',
      'Investir em equipamentos certos',
      'Conciliar rotina'
    ],
    next: 'pro_final'
  },
  {
    id: 'pro_final',
    type: 'final',
    text: 'Se pudesse receber um conselho mágico para acelerar seu sucesso na estética, qual seria?',
    emoji: '✨',
    options: [
      'Conquistar mais confiança nos tratamentos',
      'Saber inovar e ofertar novidades',
      'Ganhar mais visibilidade',
      'Gerar mais retorno financeiro'
    ]
  },

  // Caminho CLIENTE FINAL
  {
    id: 'perfil_cliente',
    type: 'perfil',
    text: 'Quando você pensa em estética, qual destas frases combina mais com você?',
    emoji: '🪞',
    options: [
      'Quero me sentir melhor comigo',
      'Busco prevenir envelhecimento',
      'Quero mudar algo específico',
      'Só curiosidade/auto-conhecimento'
    ],
    next: 'cli_area_desejo'
  },
  {
    id: 'cli_area_desejo',
    type: 'desejo',
    text: 'Se um gênio da lâmpada pudesse conceder um desejo estético agora, o que mudaria?',
    emoji: '🧞‍♂️',
    options: [
      'Aparência da pele',
      'Forma do rosto/corpo',
      'Confiança/autoestima',
      'Outro sonho secreto'
    ],
    next: 'cli_sentimento'
  },
  {
    id: 'cli_sentimento',
    type: 'sentimento',
    text: 'Quando se olha no espelho de manhã, qual desses memes seria seu humor?',
    emoji: '🪞',
    options: [
      '🔥 Ousadia: bora dominar o mundo!',
      '😐 Indiferente: só mais um dia',
      '🤔 Fico reparando detalhes',
      '😂 Dou risada e sigo'
    ],
    next: 'cli_final'
  },
  {
    id: 'cli_final',
    type: 'final',
    text: 'Se pudesse ouvir um conselho do “eu do futuro”, o que gostaria que ele dissesse?',
    emoji: '💕',
    options: [
      'Valeu a pena o cuidado',
      'A confiança mudou tudo',
      'Felicidade é se aceitar',
      'Ainda vou descobrir!'
    ]
  }
];
