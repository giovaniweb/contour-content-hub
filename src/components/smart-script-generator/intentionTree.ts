
// Árvore de Intenção Oculta (estilo Akinator)
export interface IntentionNode {
  question: string;
  options: { value: string; label: string; leads_to?: string }[];
  inference_rules?: InferenceRule[];
}

export interface InferenceRule {
  condition: (answers: Partial<ScriptIntention>) => boolean;
  mentor: string;
  confidence: number;
}

export interface ScriptIntention {
  tipo_conteudo: 'bigIdea' | 'stories' | 'carousel' | 'image' | 'video';
  objetivo: 'leads' | 'vendas' | 'autoridade' | 'engajamento' | 'ensinar' | 'emocional';
  tema: string;
  canal: string;
  estilo_comunicacao: 'emocional' | 'direto' | 'poetico' | 'didatico' | 'humoristico' | 'criativo';
  equipamento?: string;
  perfil_clinico?: string;
  mentor_inferido: string;
  enigma_mentor: string;
}

export const INTENTION_TREE: Record<string, IntentionNode> = {
  root: {
    question: "Qual tipo de conteúdo você quer criar?",
    options: [
      { value: 'bigIdea', label: 'Big Idea', leads_to: 'objetivo' },
      { value: 'stories', label: 'Stories', leads_to: 'objetivo' },
      { value: 'carousel', label: 'Carrossel', leads_to: 'objetivo' },
      { value: 'image', label: 'Imagem', leads_to: 'objetivo' },
      { value: 'video', label: 'Vídeo', leads_to: 'objetivo' }
    ]
  },
  objetivo: {
    question: "Qual o objetivo do seu conteúdo?",
    options: [
      { value: 'leads', label: 'Gerar leads', leads_to: 'canal' },
      { value: 'vendas', label: 'Vender produto/serviço', leads_to: 'canal' },
      { value: 'autoridade', label: 'Construir autoridade', leads_to: 'canal' },
      { value: 'engajamento', label: 'Engajar audiência', leads_to: 'canal' },
      { value: 'ensinar', label: 'Ensinar/educar', leads_to: 'canal' },
      { value: 'emocional', label: 'Conectar emocionalmente', leads_to: 'canal' }
    ]
  },
  canal: {
    question: "Onde será publicado?",
    options: [
      { value: 'instagram_reels', label: 'Instagram Reels', leads_to: 'estilo' },
      { value: 'instagram_feed', label: 'Instagram Feed', leads_to: 'estilo' },
      { value: 'tiktok', label: 'TikTok', leads_to: 'estilo' },
      { value: 'youtube_shorts', label: 'YouTube Shorts', leads_to: 'estilo' },
      { value: 'linkedin', label: 'LinkedIn', leads_to: 'estilo' },
      { value: 'facebook', label: 'Facebook', leads_to: 'estilo' }
    ]
  },
  estilo: {
    question: "Qual estilo de comunicação?",
    options: [
      { value: 'emocional', label: 'Emocional/Inspirador', leads_to: 'equipamento' },
      { value: 'direto', label: 'Direto/Objetivo', leads_to: 'equipamento' },
      { value: 'poetico', label: 'Poético/Artístico', leads_to: 'equipamento' },
      { value: 'didatico', label: 'Didático/Educativo', leads_to: 'equipamento' },
      { value: 'humoristico', label: 'Humorístico/Viral', leads_to: 'equipamento' },
      { value: 'criativo', label: 'Criativo/Publicitário', leads_to: 'equipamento' }
    ],
    inference_rules: [
      {
        condition: (answers) => answers.objetivo === 'vendas' && answers.estilo_comunicacao === 'direto',
        mentor: 'leandro_ladeira',
        confidence: 0.9
      },
      {
        condition: (answers) => answers.estilo_comunicacao === 'emocional',
        mentor: 'icaro_carvalho',
        confidence: 0.8
      },
      {
        condition: (answers) => answers.tipo_conteudo === 'video' && answers.estilo_comunicacao === 'criativo',
        mentor: 'paulo_cuenca',
        confidence: 0.8
      },
      {
        condition: (answers) => answers.estilo_comunicacao === 'didatico',
        mentor: 'camila_porto',
        confidence: 0.8
      },
      {
        condition: (answers) => answers.estilo_comunicacao === 'humoristico',
        mentor: 'hyeser_souza',
        confidence: 0.9
      },
      {
        condition: (answers) => answers.objetivo === 'autoridade',
        mentor: 'washington_olivetto',
        confidence: 0.7
      }
    ]
  },
  equipamento: {
    question: "Qual equipamento/tratamento você quer destacar?",
    options: [
      { value: 'hifu', label: 'HIFU/Ultrassom Focado', leads_to: 'tema' },
      { value: 'laser', label: 'Laser (CO2, Alexandrite, etc)', leads_to: 'tema' },
      { value: 'radiofrequencia', label: 'Radiofrequência', leads_to: 'tema' },
      { value: 'bioestimulador', label: 'Bioestimulador de Colágeno', leads_to: 'tema' },
      { value: 'microagulhamento', label: 'Microagulhamento', leads_to: 'tema' },
      { value: 'peeling', label: 'Peeling Químico', leads_to: 'tema' },
      { value: 'toxina', label: 'Toxina Botulínica', leads_to: 'tema' },
      { value: 'preenchimento', label: 'Preenchimento', leads_to: 'tema' },
      { value: 'criolipolise', label: 'Criolipólise', leads_to: 'tema' },
      { value: 'carboxiterapia', label: 'Carboxiterapia', leads_to: 'tema' },
      { value: 'sem_equipamento', label: 'Não específico/Protocolo da clínica', leads_to: 'tema' }
    ]
  },
  tema: {
    question: "Qual o tema ou assunto principal?",
    options: [], // Campo aberto para texto
  }
};

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

// Sugestões dinâmicas baseadas no equipamento selecionado
export const EQUIPMENT_SUGGESTIONS: Record<string, string[]> = {
  'hifu': [
    'Rejuvenescimento facial sem cirurgia',
    'Lifting natural com HIFU',
    'Firmeza da pele sem downtime',
    'Resultados duradouros do ultrassom focado'
  ],
  'laser': [
    'Remoção de manchas com laser',
    'Rejuvenescimento a laser',
    'Textura da pele perfeita',
    'Cicatrizes de acne: antes e depois'
  ],
  'radiofrequencia': [
    'Flacidez corporal: solução definitiva',
    'Radiofrequência para celulite',
    'Aquecimento profundo dos tecidos',
    'Firmeza corporal sem cirurgia'
  ],
  'bioestimulador': [
    'Estímulo natural de colágeno',
    'Rejuvenescimento gradual e natural',
    'Bioestimulador: o que esperar',
    'Juventude que vem de dentro'
  ],
  'microagulhamento': [
    'Microagulhamento: renovação celular',
    'Poros dilatados: como tratar',
    'Microagulhamento com drug delivery',
    'Textura da pele: transformação real'
  ],
  'peeling': [
    'Peeling químico: renovação profunda',
    'Melasma: tratamento eficaz',
    'Peeling para acne ativa',
    'Luminosidade natural da pele'
  ],
  'toxina': [
    'Toxina botulínica: rugas expressão',
    'Prevenção do envelhecimento',
    'Toxina para hiperhidrose',
    'Naturalidade em cada aplicação'
  ],
  'preenchimento': [
    'Preenchimento labial natural',
    'Harmonização facial sutil',
    'Bigode chinês: como tratar',
    'Volume facial equilibrado'
  ],
  'criolipolise': [
    'Criolipólise: gordura localizada',
    'Redução de medidas sem cirurgia',
    'Criolipólise: mitos e verdades',
    'Resultados definitivos em gordura'
  ],
  'carboxiterapia': [
    'Carboxiterapia para olheiras',
    'Celulite: tratamento inovador',
    'Carboxiterapia facial rejuvenescedora',
    'Melhora da circulação'
  ],
  'sem_equipamento': [
    'Protocolo exclusivo da clínica',
    'Tratamento personalizado',
    'Resultados comprovados',
    'Cuidado individualizado'
  ]
};
