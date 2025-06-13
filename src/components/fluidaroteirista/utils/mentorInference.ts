
import { getMentorTechniques, selectBestTechnique } from './techniqueSelector';
import { MENTOR_ENIGMAS, MENTOR_PROFILES } from '../../smart-script-generator/intentionTree';

export const inferMentorFromAnswers = async (answers: any): Promise<string> => {
  console.log('🤔 [inferMentorFromAnswers] Respostas recebidas:', answers);

  // NOVA LÓGICA: Buscar mentor baseado em técnicas disponíveis para o formato
  const formato = answers.formato || 'carrossel';
  const objetivo = answers.objetivo || 'atrair';

  // Lista de mentores para verificar (ordem de prioridade)
  const mentoresParaVerificar = [
    'Leandro Ladeira',
    'Paulo Cuenca', 
    'Pedro Sobral',
    'Ícaro de Carvalho',
    'Camila Porto',
    'Hyeser Souza'
  ];

  // Buscar mentor que tem técnica compatível com formato e objetivo
  for (const mentorNome of mentoresParaVerificar) {
    try {
      const tecnicas = await getMentorTechniques(mentorNome);
      
      if (tecnicas.length > 0) {
        const tecnicaCompativel = selectBestTechnique(tecnicas, formato, objetivo);
        
        if (tecnicaCompativel) {
          console.log(`✅ [inferMentorFromAnswers] Mentor selecionado: ${mentorNome} com técnica: ${tecnicaCompativel.nome}`);
          return mentorNome.toLowerCase().replace(' ', '_');
        }
      }
    } catch (error) {
      console.warn(`⚠️ [inferMentorFromAnswers] Erro ao verificar técnicas de ${mentorNome}:`, error);
    }
  }

  // REGRA ESPECÍFICA: Stories 10x sempre usa Leandro Ladeira
  if (formato === 'stories_10x' || formato === 'stories') {
    console.log('🎯 [inferMentorFromAnswers] Stories detectado - usando Leandro Ladeira');
    return 'leandro_ladeira';
  }

  // REGRA ESPECÍFICA: Carrossel sempre usa Paulo Cuenca
  if (formato === 'carrossel') {
    console.log('🎠 [inferMentorFromAnswers] Carrossel detectado - usando Paulo Cuenca');
    return 'paulo_cuenca';
  }

  // Fallback para lógica original simplificada
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

  // Caso padrão
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
