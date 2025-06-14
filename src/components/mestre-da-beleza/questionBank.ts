
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
    context: 'perfil'
  },
  {
    id: 'intencao',
    text: 'Qual sua intenção hoje?',
    options: ['Quero resolver um problema', 'Quero ideias', 'Só explorando'],
    context: 'intencao'
  },
  // Pergunta nostálgica (exemplo)
  {
    id: 'nostalgia_brasiltricampeao',
    text: 'Você já viu o Brasil ser tetra na Copa do Mundo? (1994) ⚽',
    options: ['Sim', 'Não lembro', 'Não era nascido(a)'],
    context: 'brasiltricampeao',
    nostalgic: true
  },
  // Diagnóstico
  {
    id: 'diagnostico_area',
    text: 'O que mais te incomoda?',
    options: ['Rosto', 'Corpo', 'Ambos', 'Nada incomoda'],
    context: 'area_problema'
  },
  {
    id: 'diagnostico_flacidez_facial',
    text: 'Percebe sinais de flacidez no rosto?',
    options: ['Sim, muita', 'Um pouco', 'Nada'],
    context: 'flacidez_facial',
    profile: ['cliente_final', 'profissional_estetica']
  },
  {
    id: 'diagnostico_flacidez_corporal',
    text: 'Percebe sinais de flacidez no corpo?',
    options: ['Sim, muita', 'Um pouco', 'Nada'],
    context: 'flacidez_corporal',
    profile: ['cliente_final', 'profissional_estetica']
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
