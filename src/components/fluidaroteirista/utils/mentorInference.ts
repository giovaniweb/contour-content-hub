import { ScriptIntention, MENTOR_ENIGMAS, MENTOR_PROFILES } from '../components/smart-script-generator/intentionTree';

// Função para inferir o mentor com base nas respostas
export const inferMentorFromAnswers = (answers: any): string => {
  console.log('🤔 [inferMentorFromAnswers] Respostas recebidas:', answers);

  // Lógica de inferência (simplificada)
  if (answers.objetivo === 'vendas' && answers.estilo === 'direto') {
    console.log('🎯 [inferMentorFromAnswers] Mentor inferido: Leandro Ladeira (vendas diretas)');
    return 'leandro_ladeira';
  }

  if (answers.estilo === 'emocional') {
    console.log('❤️ [inferMentorFromAnswers] Mentor inferido: Ícaro de Carvalho (conexão emocional)');
    return 'icaro_carvalho';
  }

  if (answers.formato === 'video' && answers.estilo === 'criativo') {
    console.log('🎨 [inferMentorFromAnswers] Mentor inferido: Paulo Cuenca (vídeos criativos)');
    return 'paulo_cuenca';
  }

  // Caso padrão (pode ser um mentor genérico ou aleatório)
  console.log('✨ [inferMentorFromAnswers] Mentor inferido: Camila Porto (padrão)');
  return 'camila_porto';
};

// Função para gerar o enigma do mentor
export const generateMentorEnigma = (mentor: string): string => {
  console.log('❓ [generateMentorEnigma] Gerando enigma para o mentor:', mentor);
  return MENTOR_ENIGMAS[mentor] || "A mente por trás da estratégia.";
};

// Função para gerar o perfil do mentor
export const generateMentorProfile = (mentor: string): { name: string; focus: string; style: string } => {
  console.log('👤 [generateMentorProfile] Gerando perfil para o mentor:', mentor);
  return MENTOR_PROFILES[mentor] || {
    name: 'Especialista Fluida',
    focus: 'Estratégias de conteúdo personalizadas',
    style: 'Adaptável, estratégico, focado em resultados'
  };
};

export const buildEnhancedScriptData = (akinatorData: any) => {
  console.log('🔧 [buildEnhancedScriptData] Enriquecendo dados do Akinator:', akinatorData);
  
  // CORREÇÃO: Mapear dados da nova estrutura para o formato esperado
  const enhancedData = {
    tema: akinatorData.tema,
    equipamentos: akinatorData.equipamentos || [],
    objetivo: akinatorData.objetivo,
    mentor: inferMentorFromAnswers(akinatorData),
    formato: akinatorData.formato,
    canal: akinatorData.canal,
    estilo: akinatorData.estilo,
    modo: akinatorData.modo || 'akinator'
  };

  console.log('✅ [buildEnhancedScriptData] Dados enriquecidos:', enhancedData);
  return enhancedData;
};
