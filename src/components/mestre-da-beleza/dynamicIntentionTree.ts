
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
      { label: 'Quero resolver algo específico', value: 'problema', next: 'cliente_reflexo_espelho' }, // Changed next
      { label: 'Só quero saber opções de prevenção', value: 'prevenção', next: 'humor_prevencao' },
    ],
    onlyFor: 'cliente'
  },

  // NOVA PERGUNTA: cliente_reflexo_espelho
  {
    id: 'cliente_reflexo_espelho',
    type: 'comportamental',
    text: "Quando você se olha no espelho de manhã, o que sente?",
    options: [
      { label: "Gostaria de melhorar algo, mas não sei o quê", value: "melhorar_sem_saber", next: 'cliente_ciclo_novidades' },
      { label: "Me sinto bem na maior parte do tempo", value: "bem_maioria", next: 'cliente_ciclo_novidades' },
      { label: "Tem algo específico que me incomoda", value: "especifico_incomoda", next: 'cliente_ciclo_novidades' },
      { label: "Só corro pro trabalho, sem pensar nisso", value: "sem_pensar", next: 'cliente_ciclo_novidades' }
    ],
    onlyFor: 'cliente'
  },

  // NOVA PERGUNTA: cliente_ciclo_novidades
  {
    id: 'cliente_ciclo_novidades',
    type: 'comportamental',
    text: "Sobre novidades de tratamentos de estética, você...",
    options: [
      { label: "Adora novidades, sempre testa o que sai", value: "adora_novidades", next: 'cliente_area' },
      { label: "Prefere tratamentos consagrados", value: "consagrados", next: 'cliente_area' },
      { label: "Só faz se tiver muita recomendação", value: "muita_recomendacao", next: 'cliente_area' },
      { label: "Prefere evitar mudanças", value: "evitar_mudancas", next: 'cliente_area' }
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
      { label: 'Facial', value: 'facial', next: 'prof_ciclo_novidades', originalNext: 'prof_caso_clinico_rosto' },
      { label: 'Corporal', value: 'corporal', next: 'prof_ciclo_novidades', originalNext: 'prof_caso_clinico_corpo_placeholder' },
      { label: 'Ambas', value: 'ambas', next: 'prof_ciclo_novidades', originalNext: 'prof_caso_clinico_duplo_placeholder' },
    ],
    onlyFor: 'profissional'
  },

  // NOVA PERGUNTA: prof_ciclo_novidades
  {
    id: 'prof_ciclo_novidades',
    type: 'comportamental',
    text: "Sobre novidades de tratamentos de estética, você...",
    options: [
      { label: "Adora novidades, sempre testa o que sai", value: "adora_novidades" },
      { label: "Prefere tratamentos consagrados", value: "consagrados" },
      { label: "Só faz se tiver muita recomendação", value: "muita_recomendacao" },
      { label: "Prefere evitar mudanças", value: "evitar_mudancas" }
    ],
    next: (answers) => {
      // Retrieve the original intended 'next' based on the answer to 'prof_area_atuacao'
      const areaAtuacaoNode = DYNAMIC_INTENTION_TREE.find(node => node.id === 'prof_area_atuacao');
      const areaAtuacaoAnswer = answers['prof_area_atuacao'];
      const selectedOption = areaAtuacaoNode?.options?.find(opt => opt.value === areaAtuacaoAnswer);
      // @ts-ignore // Accessing custom originalNext property
      return selectedOption?.originalNext || 'final_curioso'; // Fallback
    },
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
    text: (answers: Record<string, any>) => {
      const suggestions = answers['prof_caso_clinico_rosto'];
      // Ensure suggestions is an array and join correctly, or provide a default message.
      const suggestionText = Array.isArray(suggestions) && suggestions.length > 0
        ? suggestions.join(', ')
        : 'nenhuma sugestão fornecida';
      return `Para o caso de flacidez facial, você sugeriu: ${suggestionText}. Excelente análise!`;
    }
  },

  // PLACEHOLDER NODES FOR MISSING PROFESSIONAL PATHS
  {
    id: 'prof_caso_clinico_corpo_placeholder',
    type: 'final', // Using 'final' as a placeholder endpoint
    text: "Estudo de caso para tratamentos corporais está em desenvolvimento. Obrigado pela sua especialidade!",
    onlyFor: 'profissional'
  },
  {
    id: 'prof_caso_clinico_duplo_placeholder',
    type: 'final', // Using 'final' as a placeholder endpoint
    text: "Estudo de caso para tratamentos faciais e corporais (ambos) está em desenvolvimento. Obrigado pela sua expertise combinada!",
    onlyFor: 'profissional'
  },
  // END OF PLACEHOLDER NODES

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
// - O campo 'next' pode ser string (ID do próximo nó) ou uma função que recebe as respostas e retorna um ID.
// - 'onlyFor' restringe a visibilidade do nó para 'cliente' ou 'profissional'.
// - 'isOpenText' indica uma pergunta de texto aberto. A resposta será o texto digitado pelo usuário.
// - 'options' define as escolhas para perguntas de múltipla escolha. Cada opção pode ter seu próprio 'next'.
// - Nós do tipo 'final' encerram um fluxo. O texto pode ser uma string ou uma função para personalização.
// - É crucial que todos os IDs referenciados em 'next' (seja string ou valor de retorno de função) existam na árvore.
// - Para nós com options (múltipla escolha), a resposta do usuário (armazenada no histórico) geralmente será o 'value' da DynamicOption selecionada.
//   No entanto, para perguntas de 'caso_clinico' com múltiplas seleções, a resposta armazenada para o ID da pergunta
//   (ex: 'prof_caso_clinico_rosto') deve ser um array dos 'value's das opções selecionadas.
//   O hook useAkinatorIntentionTree e o componente AkinatorMagico devem ser consistentes com essa estrutura de dados.

