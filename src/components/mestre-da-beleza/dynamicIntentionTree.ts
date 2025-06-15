
// Nova estrutura dinâmica de árvore de intenção para Mestre da Beleza 2.0

// Tipos-base:
export type DynamicNodeType = 'perfil' | 'tecnica' | 'comportamental' | 'humor' | 'caso_clinico' | 'final';

export interface DynamicOption {
  label: string;
  value: string;
  next?: string | ((answers: Record<string, any>) => string); // permite ramificação dinâmica por função
  emoji?: string;
}

export interface DynamicIntentionNode {
  id: string;
  type: DynamicNodeType;
  text: string | ((answers: Record<string, any>) => string);
  options?: DynamicOption[];
  isOpenText?: boolean; // pergunta aberta
  next?: string | ((answers: Record<string, any>) => string); // fallback proximo passo
  special?: boolean; // para campos especiais (caso clínico, humor etc)
  onlyFor?: 'cliente' | 'profissional'; // ramifica por perfil
}

// Exemplo de árvore dinâmica de perguntas
export const DYNAMIC_INTENTION_TREE: DynamicIntentionNode[] = [
  // PERFIL -- identifica quem é o usuário, funil bifurca
  {
    id: 'perfil_inicial',
    type: 'perfil',
    text: "Vamos começar! Com qual perfil você mais se identifica?",
    options: [
      { label: 'Sou cliente ou paciente buscando solução', value: 'cliente', emoji: '🙂', next: 'cliente_objetivo' },
      { label: 'Sou profissional da estética', value: 'profissional', emoji: '🧑‍⚕️', next: 'prof_area_atuacao' },
      { label: 'Só estou curioso(a)', value: 'curioso', emoji: '🔎', next: 'humor_curioso' },
    ]
  },

  // CLIENTE FINAL: objetivo
  {
    id: 'cliente_objetivo',
    type: 'comportamental',
    text: "Qual describe melhor seu objetivo neste momento?",
    options: [
      { label: 'Quero resolver algo específico', value: 'problema', next: 'cliente_area' },
      { label: 'Só quero saber opções de prevenção', value: 'prevenção', next: 'humor_prevencao' },
    ],
    onlyFor: 'cliente'
  },

  // CLIENTE FINAL: área
  {
    id: 'cliente_area',
    type: 'tecnica',
    text: "Qual área deseja melhorar primeiro?",
    options: [
      { label: 'Rosto', value: 'rosto', next: 'cliente_rosto_preocupacao' },
      { label: 'Corpo', value: 'corpo', next: 'cliente_corpo_preocupacao' },
      { label: 'Ambos', value: 'ambos', next: 'cliente_prefer_foco' },
    ],
    onlyFor: 'cliente'
  },

  // CLIENTE FINAL: preocupação rosto, com humor intercalado
  {
    id: 'cliente_rosto_preocupacao',
    type: 'tecnica',
    text: "No rosto, o que mais te incomoda?",
    options: [
      { label: 'Manchas ou melasma', value: 'manchas', next: 'cliente_rosto_tratou_algo' },
      { label: 'Flacidez', value: 'flacidez', next: 'cliente_rosto_tratou_algo' },
      { label: 'Linhas de expressão', value: 'linhas', next: 'cliente_rosto_tratou_algo' },
      { label: 'Outro', value: 'outro', next: 'cliente_rosto_outro' }
    ],
    onlyFor: 'cliente'
  },

  {
    id: 'cliente_prefer_foco',
    type: 'comportamental',
    text: "Prefere começar pelo rosto ou corpo?",
    options: [
      { label: 'Rosto', value: 'rosto', next: 'cliente_rosto_preocupacao' },
      { label: 'Corpo', value: 'corpo', next: 'cliente_corpo_preocupacao' },
      { label: 'Tanto faz, quero saber tudo!', value: 'todos', next: 'humor_tanto_faz' }
    ],
    onlyFor: 'cliente'
  },

  // CLIENTE FINAL: preocupação corpo
  {
    id: 'cliente_corpo_preocupacao',
    type: 'tecnica',
    text: "Sobre o corpo, tem alguma preocupação principal?",
    options: [
      { label: 'Gordura localizada', value: 'gordura', next: 'cliente_corpo_tratou_algo' },
      { label: 'Flacidez', value: 'flacidez', next: 'cliente_corpo_tratou_algo' },
      { label: 'Dores/inchaço', value: 'inchaco', next: 'cliente_corpo_inchaco_regiao' },
    ],
    onlyFor: 'cliente'
  },

  // CLIENTE: campo aberto (exemplo de pergunta aberta)
  {
    id: 'cliente_rosto_outro',
    type: 'tecnica',
    text: "Conte para mim no que gostaria de melhorar no rosto (quanto mais detalhes, melhor 🕵️‍♀️)",
    isOpenText: true,
    next: 'final_cliente_aberto',
    onlyFor: 'cliente'
  },

  // CLIENTE: já tentou algo?
  {
    id: 'cliente_rosto_tratou_algo',
    type: 'comportamental',
    text: "Você já tentou algum tratamento para isso?",
    options: [
      { label: 'Nunca tentei nada', value: 'nunca', next: 'final_cliente_iniciante' },
      { label: 'Só produtinhos caseiros', value: 'caseiro', next: 'final_cliente_autocuidado' },
      { label: 'Fiz algo em clínica', value: 'clinica', next: 'final_cliente_experiente' }
    ],
    onlyFor: 'cliente'
  },

  // CLIENTE: caso de inchaço corporal
  {
    id: 'cliente_corpo_inchaco_regiao',
    type: 'tecnica',
    text: "O inchaço é mais forte nas pernas, abdômen ou todo o corpo?",
    options: [
      { label: 'Pernas', value: 'pernas', next: 'final_cliente_inchaco_pernas' },
      { label: 'Abdômen', value: 'abdomen', next: 'final_cliente_inchaco_abdomen' },
      { label: 'Tudo!', value: 'tudo', next: 'final_cliente_inchaco_total' }
    ],
    onlyFor: 'cliente'
  },

  // PROFISSIONAL: área de atuação
  {
    id: 'prof_area_atuacao',
    type: 'perfil',
    text: "Qual sua principal especialidade?",
    options: [
      { label: 'Facial', value: 'facial', next: 'prof_caso_clinico_rosto' },
      { label: 'Corporal', value: 'corporal', next: 'prof_caso_clinico_corpo' },
      { label: 'Ambas', value: 'ambas', next: 'prof_caso_clinico_duplo' },
    ],
    onlyFor: 'profissional'
  },

  // EXEMPLO ESTUDO DE CASO PARA PROFISSIONAL
  {
    id: 'prof_caso_clinico_rosto',
    type: 'caso_clinico',
    text: "Caso clínico: Paciente, 35 anos, com flacidez leve no rosto após emagrecimento. Escolha um ou mais protocolos para sugerir:",
    options: [
      { label: 'Radiofrequência facial', value: 'rf', emoji: "🔊" },
      { label: 'Bioestimulador de colágeno', value: 'bioestim', emoji: "💉" },
      { label: 'Peeling', value: 'peeling', emoji: "🧴" },
      { label: 'Microagulhamento', value: 'micro', emoji: "🪡" },
    ],
    next: 'final_prof_caso_rosto',
    onlyFor: 'profissional'
  },

  // EXEMPLO DE HUMOR NO FLUXO
  {
    id: 'humor_curioso',
    type: 'humor',
    text: "Para os curiosos: Sabia que perguntar é o primeiro passo para ser um(a) mestre da beleza também? 😉 Quer brincar mais?",
    options: [
      { label: 'Sim, agora fiquei animado/a!', value: 'sim_quero', next: "perfil_inicial" },
      { label: 'Não, só navegando mesmo', value: 'nao', next: "final_curioso" }
    ]
  },

  {
    id: 'humor_prevencao',
    type: 'humor',
    text: "Parabéns, prevenir é mais incrível que remediar! Quer ver dicas mágicas ou testar outro perfil?",
    options: [
      { label: "Quero dicas mágicas", value: 'dicas', next: "final_prevencao" },
      { label: "Testar outro perfil", value: 'perfil', next: "perfil_inicial" }
    ]
  },

  {
    id: 'humor_tanto_faz',
    type: 'humor',
    text: "Destemido(a)! Melhor ainda, vamos te mostrar uma jornada completa depois! 😎",
    next: "cliente_area"
  },

  // FINAIS EXEMPLO CLIENTE
  {
    id: 'final_cliente_autocuidado',
    type: 'final',
    text: "Seu autocuidado tem valor! Mas protocolos personalizados potencializam resultados. Que tal agendar uma avaliação?",
  },
  {
    id: 'final_cliente_experiente',
    type: 'final',
    text: "Ótimo! Profissionais conseguem elevar ainda mais seus resultados com tecnologia de ponta.",
  },
  {
    id: 'final_cliente_iniciante',
    type: 'final',
    text: "Você está começando, excelente! Cuidado contínuo = pele renovada.",
  },
  {
    id: 'final_cliente_inchaco_pernas',
    type: 'final',
    text: "Sugestão: drenagem linfática e radiofrequência nas pernas ajudam muito! ",
  },
  {
    id: 'final_cliente_inchaco_abdomen',
    type: 'final',
    text: "Abdômen inchado? Aposte em protocolos de detox + radiofrequência.",
  },
  {
    id: 'final_cliente_inchaco_total',
    type: 'final',
    text: "Retenção total pede avaliação composta! Procure um especialista para combinação de técnicas.",
  },
  {
    id: 'final_cliente_aberto',
    type: 'final',
    text: (answers: Record<string, any>) => 
      `Ótimo! Sobre seu rosto: "${answers['cliente_rosto_outro']}". Isso ajuda a personalizar protocolos, obrigado!`
  },

  // FINAL EXEMPLO PARA PROFISSIONAL
  {
    id: 'final_prof_caso_rosto',
    type: 'final',
    text: (answers: Record<string, any>) =>
      `Você sugeriu: ${answers['prof_caso_clinico_rosto']?.join(', ') || 'nenhum'}. Excelente combinação para flacidez facial!`
  },

  // FINAIS DE HUMOR
  {
    id: 'final_curioso',
    type: 'final',
    text: "Valeu por visitar! Volte quando quiser decifrar mais mistérios da beleza! 😄",
  },
  {
    id: 'final_prevencao',
    type: 'final',
    text: "Dica mágica: hidratação constante e tecnologia preventiva = pele de mestre! ✨"
  }
];

// Observações:
// - O campo 'next' pode ser string (para navegação simples) ou função (ramificação programática).
// - 'onlyFor' permite filtrar perguntas só para cliente ou profissional.
// - Campos 'emoji', 'special' e 'isOpenText' abrem espaço para personalização/funções extras.
// - Pode expandir cases, finais, perguntas abertas, estudos de caso ou humor conforme desejar.

