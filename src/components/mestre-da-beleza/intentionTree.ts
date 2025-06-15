
/**
 * Intention Tree "Akinator Style" - Diagnóstico Estético Descontraído
 * Perguntas e ramificações para descobrir desejos e perfil do usuário de forma leve e divertida.
 */

export type IntentionNode = {
  id: string;
  text: string;
  options: string[];
  type: 'root' | 'perfil' | 'cotidiano' | 'desejo' | 'sentimento' | 'experiencia' | 'preferencia';
  next?: Record<string, string> | string; // ramificação condicional ou próximo
  emoji?: string;
};

export const INTENTION_TREE: IntentionNode[] = [
  {
    id: 'root',
    type: 'root',
    text: 'Se você pudesse pedir um desejo estético para um gênio da lâmpada... o que mudaria primeiro?',
    emoji: '🧞‍♂️',
    options: [
      'Aparência da pele',
      'Forma do rosto/corpo',
      'Confiança/autoestima',
      'Outro sonho secreto'
    ],
    next: {
      'Aparência da pele': 'pele',
      'Forma do rosto/corpo': 'corpo',
      'Confiança/autoestima': 'autoestima',
      'Outro sonho secreto': 'outro'
    }
  },
  {
    id: 'pele',
    type: 'cotidiano',
    text: 'Sobre sua pele: ela te faz sorrir no espelho ou você pensa “dava pra melhorar”?',
    options: [
      'Queria ela mais iluminada',
      'Manchas me incomodam',
      'A textura não agrada',
      'Amo minha pele!',
    ],
    next: 'sentimento_espelho'
  },
  {
    id: 'corpo',
    type: 'desejo',
    text: 'Se pudesse esculpir uma parte do rosto ou corpo com massinha mágica, o que escolheria?',
    options: [
      'Deixar mais definido/contornado',
      'Reduzir alguma gordurinha',
      'Aumentar firmeza',
      'Nada, estou feliz assim'
    ],
    next: 'sentimento_espelho'
  },
  {
    id: 'autoestima',
    type: 'sentimento',
    text: 'Quando você quer se sentir mais confiante, qual truque “não pode faltar” na sua rotina?',
    options: [
      'Sorrir de propósito',
      'Um skincare caprichado',
      'Roupa ou cabelo especial',
      'Confiança vem de dentro!'
    ],
    next: 'cotidiano_rede'
  },
  {
    id: 'outro',
    type: 'desejo',
    text: 'Compartilhe seu desejo ou sonho estético... (vale sonhar alto, viu?)',
    options: [
      'Quero contar depois',
      'Prefiro não falar',
      'Posso pensar mais?'
    ],
    next: 'sentimento_espelho'
  },
  {
    id: 'sentimento_espelho',
    type: 'sentimento',
    text: 'Quando você se olha no espelho de manhã, qual desses memes seria seu humor?',
    options: [
      '🔥 Ousadia: bora dominar o mundo!',
      '😐 Indiferente: só mais um dia',
      '🤔 Fico reparando detalhes',
      '😂 Dou risada e sigo'
    ],
    next: 'cotidiano_rede'
  },
  {
    id: 'cotidiano_rede',
    type: 'cotidiano',
    text: 'Já deixou de postar uma selfie ou de ir a um evento por não curtir algo no seu visual?',
    options: [
      'Sim, várias vezes',
      'Já aconteceu, mas não sempre',
      'Quase nunca',
      'Nunca, selfie é comigo mesmo(a)!'
    ],
    next: 'preferencia_rotina'
  },
  {
    id: 'preferencia_rotina',
    type: 'preferencia',
    text: 'Na sua opinião, o que faz um tratamento/rotina realmente funcionar?',
    options: [
      'Ver mudança rápido',
      'Ser fácil de manter',
      'Sentir-se cuidado(a)',
      'Ser diferente de tudo que já vi'
    ],
    next: 'experiencia_estetica'
  },
  {
    id: 'experiencia_estetica',
    type: 'experiencia',
    text: 'Conta aqui: já tentou algo antes? Como foi?',
    options: [
      'Sim, amei o resultado!',
      'Sim, mas não mudou muito',
      'Nunca fiz nada estético',
      'Já tentei truques caseiros'
    ],
    next: 'final'
  },
  {
    id: 'final',
    type: 'sentimento',
    text: 'Agora imagine: se pudesse ouvir um conselho do “eu do futuro”, o que gostaria que ele dissesse sobre sua jornada de autoestima?',
    options: [
      'Valeu a pena o cuidado',
      'A confiança mudou tudo',
      'Felicidade é se aceitar',
      'Ainda vou descobrir!'
    ]
  }
];

