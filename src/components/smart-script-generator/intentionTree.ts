
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
      { value: 'emocional', label: 'Emocional/Inspirador', leads_to: 'tema' },
      { value: 'direto', label: 'Direto/Objetivo', leads_to: 'tema' },
      { value: 'poetico', label: 'Poético/Artístico', leads_to: 'tema' },
      { value: 'didatico', label: 'Didático/Educativo', leads_to: 'tema' },
      { value: 'humoristico', label: 'Humorístico/Viral', leads_to: 'tema' },
      { value: 'criativo', label: 'Criativo/Publicitário', leads_to: 'tema' }
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
