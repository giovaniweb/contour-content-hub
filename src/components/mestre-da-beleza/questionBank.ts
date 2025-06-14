/**
 * Banco configurável de perguntas para o Mestre da Beleza.
 * Suporte para perfil, intenção, diagnóstico, nostalgias e perguntas avançadas.
 * Cada pergunta pode ter scoring, dependências e ramificações.
 */

export type Question = {
  id: string;
  text: string;
  options: string[];
  context: string;
  profile?: Array<'medico' | 'profissional_estetica' | 'cliente_final'>;
  next?: string | ((answer: string, context: any) => string);
  scoring?: { [option: string]: number };
  nostalgic?: boolean;
  extra?: string;
};

export const questionBank: Question[] = [
  {
    id: 'perfil',
    text: 'Vamos começar! Quem é você na estética?',
    options: ['Sou médico(a)', 'Sou profissional de estética', 'Sou cliente final'],
    context: 'perfil',
    scoring: {
      'Sou médico(a)': 3,
      'Sou profissional de estética': 2,
      'Sou cliente final': 1,
    }
  },
  {
    id: 'intencao',
    text: 'Qual sua intenção hoje?',
    options: ['Quero resolver um problema', 'Quero ideias', 'Só explorando'],
    context: 'intencao',
    scoring: {
      'Quero resolver um problema': 5,
      'Quero ideias': 2,
      'Só explorando': 1
    }
  },
  {
    id: 'diagnostico_area',
    text: 'O que mais te incomoda?',
    options: ['Rosto', 'Corpo', 'Ambos', 'Nada incomoda'],
    context: 'area_problema',
    scoring: {
      'Rosto': 7, 'Corpo': 7, 'Ambos': 3, 'Nada incomoda': 0
    }
  },
  // Perguntas Akinator-style novas:
  {
    id: 'flacidez_facial',
    text: 'Percebe sinais de flacidez no rosto?',
    options: ['Sim', 'Um pouco', 'Não'],
    context: 'flacidez_facial',
    scoring: { 'Sim': 10, 'Um pouco': 3, 'Não': 0 }
  },
  {
    id: 'flacidez_corporal',
    text: 'Percebe flacidez no corpo?',
    options: ['Sim', 'Um pouco', 'Não'],
    context: 'flacidez_corporal',
    scoring: { 'Sim': 10, 'Um pouco': 3, 'Não': 0 }
  },
  {
    id: 'gordura_localizada',
    text: 'Tem gordura localizada que incomoda?',
    options: ['Sim', 'Não'],
    context: 'gordura_localizada',
    scoring: { 'Sim': 10, 'Não': 0 }
  },
  {
    id: 'melasma_manchas',
    text: 'Possui manchas/melasma no rosto?',
    options: ['Sim', 'Não'],
    context: 'melasma_manchas',
    scoring: { 'Sim': 10, 'Não': 0 }
  },
  // ...ADICIONAR MAIS de acordo com plano
  {
    id: 'final',
    text: 'Pronto! Deseja ver sua recomendação?',
    options: ['Sim', 'Quero mudar respostas'],
    context: 'final'
  }
  // Adapte para 25+ perguntas de acordo com objetivo do diagnóstico
];

export function getNextQuestionId(currentId: string, answer: string, profile: string, responses: any) {
  // Exemplo de fluxo simples
  if (currentId === 'perfil') {
    if (answer === 'Sou médico(a)') return 'intencao';
    if (answer === 'Sou profissional de estética') return 'intencao';
    return 'intencao';
  }
  if (currentId === 'intencao' && answer === 'Quero resolver um problema') {
    // Exemplo de ramificação
    return 'diagnostico_area';
  }
  if (currentId === 'diagnostico_area' && answer === 'Rosto') {
    return 'diagnostico_flacidez_facial';
  }
  if (currentId === 'diagnostico_area' && answer === 'Corpo') {
    return 'diagnostico_flacidez_corporal';
  }
  if (currentId === 'diagnostico_flacidez_facial') return 'nostalgia_brasiltricampeao';
  // ... seguir fluxos semelhantes
  return 'final';
}
