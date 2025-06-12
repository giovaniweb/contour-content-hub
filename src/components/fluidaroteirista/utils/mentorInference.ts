
// Sistema de inferência de mentor baseado nas escolhas do usuário

export interface MentorMapping {
  name: string;
  key: string;
  confidence: number;
}

export const STYLE_TO_MENTOR_MAP: Record<string, MentorMapping> = {
  'criativo': {
    name: 'Paulo Cuenca',
    key: 'paulo_cuenca',
    confidence: 0.9
  },
  'cientifico': {
    name: 'Pedro Sobral',
    key: 'pedro_sobral',
    confidence: 0.9
  },
  'emocional': {
    name: 'Ícaro de Carvalho',
    key: 'icaro_carvalho',
    confidence: 0.9
  },
  'direto': {
    name: 'Leandro Ladeira',
    key: 'leandro_ladeira',
    confidence: 0.9
  },
  'educativo': {
    name: 'Camila Porto',
    key: 'camila_porto',
    confidence: 0.9
  },
  'humoristico': {
    name: 'Hyeser Souza',
    key: 'hyeser_souza',
    confidence: 0.9
  },
  'publicitario': {
    name: 'Washington Olivetto',
    key: 'washington_olivetto',
    confidence: 0.9
  }
};

export interface ScriptDataFromAkinator {
  tipo_conteudo: string;
  objetivo: string;
  canal: string;
  estilo: string;
  equipamentos: string[];
  tema: string;
  modo: string;
}

export const inferMentorFromAkinatorData = (data: ScriptDataFromAkinator): MentorMapping => {
  console.log('🧠 [mentorInference] Inferindo mentor para estilo:', data.estilo);
  
  // Mapear estilo para mentor
  const mentorMapping = STYLE_TO_MENTOR_MAP[data.estilo.toLowerCase()] || {
    name: 'Criativo',
    key: 'criativo',
    confidence: 0.3
  };

  console.log('✅ [mentorInference] Mentor inferido:', mentorMapping);
  return mentorMapping;
};

export const buildEnhancedScriptData = (akinatorData: ScriptDataFromAkinator) => {
  const mentorMapping = inferMentorFromAkinatorData(akinatorData);
  
  const enhancedData = {
    ...akinatorData,
    mentor: mentorMapping.name,
    mentor_key: mentorMapping.key,
    mentor_confidence: mentorMapping.confidence,
    // Adicionar contexto específico do canal
    canal_context: getChannelContext(akinatorData.canal),
    // Adicionar contexto específico do objetivo
    objetivo_context: getObjectiveContext(akinatorData.objetivo)
  };

  console.log('🚀 [mentorInference] Dados enriquecidos para API:', enhancedData);
  return enhancedData;
};

const getChannelContext = (canal: string): string => {
  const channelContexts: Record<string, string> = {
    'instagram': 'Para Instagram: foque em visual impactante, stories dinâmicos, hashtags relevantes',
    'tiktok': 'Para TikTok: seja viral, use trends, linguagem jovem, tempo máximo 60s',
    'youtube': 'Para YouTube: conteúdo mais longo, didático, com início cativante',
    'facebook': 'Para Facebook: texto mais descritivo, engajamento familiar, tom acolhedor',
    'linkedin': 'Para LinkedIn: tom profissional, dados técnicos, autoridade no setor'
  };
  
  return channelContexts[canal.toLowerCase()] || '';
};

const getObjectiveContext = (objetivo: string): string => {
  const objectiveContexts: Record<string, string> = {
    'atrair': 'Objetivo: Capturar atenção, gerar curiosidade, maximizar alcance',
    'vender': 'Objetivo: Converter em vendas, usar gatilhos de urgência, CTA direto',
    'educar': 'Objetivo: Ensinar e informar, usar dados técnicos, ser didático',
    'conectar': 'Objetivo: Criar relacionamento, humanizar marca, gerar empatia',
    'entreter': 'Objetivo: Divertir e engajar, usar humor, conteúdo leve'
  };
  
  return objectiveContexts[objetivo.toLowerCase()] || '';
};
