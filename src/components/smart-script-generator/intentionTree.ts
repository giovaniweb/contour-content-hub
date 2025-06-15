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
      { value: 'direto', label: 'Copy Direta/Vendas', leads_to: 'equipamento' },
      { value: 'humoristico', label: 'Viral/Humor', leads_to: 'equipamento' },
      { value: 'criativo', label: 'Criativo/Visual', leads_to: 'equipamento' },
      { value: 'emocional', label: 'Conexão/Emocional', leads_to: 'equipamento' }
    ],
    inference_rules: [
      {
        condition: (answers) => answers.estilo_comunicacao === 'emocional' || answers.objetivo === 'ensinar',
        mentor: 'Mentor do Storytelling',
        confidence: 0.95
      },
      {
        condition: (answers) => answers.estilo_comunicacao === 'direto' || answers.objetivo === 'vendas',
        mentor: 'Mentor do Storytelling',
        confidence: 0.92
      },
      {
        condition: (answers) => answers.estilo_comunicacao === 'humoristico' || answers.canal === 'tiktok' || answers.objetivo === 'engajamento',
        mentor: 'Mentor da Viralização',
        confidence: 0.93
      },
      {
        condition: (answers) => answers.estilo_comunicacao === 'criativo' || answers.canal === 'instagram_reels' || answers.tipo_conteudo === 'video',
        mentor: 'Mentor da Viralização',
        confidence: 0.91
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

// Enigmas e perfis dos mentores genéricos
export const MENTOR_ENIGMAS: Record<string, string> = {
  'Mentor do Storytelling': "Quem domina o poder das histórias, nunca improvisa o sucesso.",
  'Mentor da Viralização': "A viralização não é sorte - é técnica de conexão e paixão pelo formato."
};

export const MENTOR_PROFILES: Record<string, { name: string; focus: string; style: string }> = {
  'Mentor do Storytelling': {
    name: 'Mentor do Storytelling',
    focus: 'Narrativas e técnicas de conexão',
    style: 'Emocional, vendedor, utiliza storytelling, CTA forte'
  },
  'Mentor da Viralização': {
    name: 'Mentor da Viralização',
    focus: 'Formatos virais e engajamento rápido',
    style: 'Direto, dinâmico, persuasivo'
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
