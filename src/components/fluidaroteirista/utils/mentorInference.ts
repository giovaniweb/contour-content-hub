
import { getMentorTechniques, selectBestTechnique } from './techniqueSelector';
import { MENTOR_ENIGMAS, MENTOR_PROFILES } from '../../smart-script-generator/intentionTree';

export const inferMentorFromAnswers = async (answers: any): Promise<string> => {
  console.log('🤔 [inferMentorFromAnswers] Respostas recebidas:', answers);

  // CORREÇÃO CRÍTICA: Normalizar formato para decisões
  const formato = normalizeFormato(answers.formato || 'carrossel');
  const objetivo = answers.objetivo || 'atrair';

  console.log(`🎯 [inferMentorFromAnswers] Formato original: ${answers.formato} -> normalizado: ${formato}`);

  // REGRAS ESPECÍFICAS DE FORMATO - PRIORIDADE MÁXIMA
  if (formato === 'stories' || answers.formato === 'stories_10x') {
    console.log('🎯 [inferMentorFromAnswers] Stories/Stories 10x detectado - usando Leandro Ladeira');
    
    // Verificar se Leandro Ladeira tem técnica para stories
    try {
      const tecnicas = await getMentorTechniques('Leandro Ladeira');
      const tecnicaCompativel = selectBestTechnique(tecnicas, 'stories', objetivo);
      
      if (tecnicaCompativel) {
        console.log(`✅ [inferMentorFromAnswers] Leandro Ladeira confirmado com técnica: ${tecnicaCompativel.nome}`);
      } else {
        console.log('⚠️ [inferMentorFromAnswers] Leandro Ladeira sem técnica específica, mas mantendo escolha');
      }
    } catch (error) {
      console.warn('⚠️ [inferMentorFromAnswers] Erro ao verificar técnicas de Leandro Ladeira:', error);
    }
    
    return 'leandro_ladeira';
  }

  if (formato === 'carrossel') {
    console.log('🎠 [inferMentorFromAnswers] Carrossel detectado - usando Paulo Cuenca');
    
    // Verificar se Paulo Cuenca tem técnica para carrossel
    try {
      const tecnicas = await getMentorTechniques('Paulo Cuenca');
      const tecnicaCompativel = selectBestTechnique(tecnicas, 'carrossel', objetivo);
      
      if (tecnicaCompativel) {
        console.log(`✅ [inferMentorFromAnswers] Paulo Cuenca confirmado com técnica: ${tecnicaCompativel.nome}`);
      } else {
        console.log('⚠️ [inferMentorFromAnswers] Paulo Cuenca sem técnica específica, mas mantendo escolha');
      }
    } catch (error) {
      console.warn('⚠️ [inferMentorFromAnswers] Erro ao verificar técnicas de Paulo Cuenca:', error);
    }
    
    return 'paulo_cuenca';
  }

  // Lista de mentores para verificar (ordem de prioridade para outros casos)
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

// CORREÇÃO CRÍTICA: Melhorar normalização para preservar stories_10x
const normalizeFormato = (formato: string): string => {
  const formatMapping: Record<string, string> = {
    'stories_10x': 'stories', // Normalizar para busca de técnicas
    'reels': 'stories',
    'tiktok': 'stories',
    'youtube_shorts': 'stories',
    'youtube_video': 'stories',
    'ads_video': 'stories',
    'ads_estatico': 'imagem',
    'carrossel': 'carrossel',
    'imagem': 'imagem'
  };
  
  return formatMapping[formato] || formato;
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

// CORREÇÃO CRÍTICA: Aguardar Promise corretamente
export const buildEnhancedScriptData = async (akinatorData: any) => {
  console.log('🔧 [buildEnhancedScriptData] Enriquecendo dados do Akinator:', akinatorData);
  
  try {
    // AGUARDAR corretamente a Promise do mentor
    const mentorInferido = await inferMentorFromAnswers(akinatorData);
    console.log('🎯 [buildEnhancedScriptData] Mentor inferido:', mentorInferido);
    
    // CORREÇÃO: Mapear dados da nova estrutura para o formato esperado
    const enhancedData = {
      tema: akinatorData.tema,
      equipamentos: akinatorData.equipamentos || [],
      objetivo: akinatorData.objetivo,
      mentor: mentorInferido, // Agora é string, não Promise
      formato: akinatorData.formato, // MANTER formato original
      canal: akinatorData.canal,
      estilo: akinatorData.estilo,
      modo: akinatorData.modo || 'akinator'
    };

    console.log('✅ [buildEnhancedScriptData] Dados enriquecidos:', enhancedData);
    return enhancedData;
  } catch (error) {
    console.error('❌ [buildEnhancedScriptData] Erro ao enriquecer dados:', error);
    // Retornar dados básicos em caso de erro
    return {
      tema: akinatorData.tema,
      equipamentos: akinatorData.equipamentos || [],
      objetivo: akinatorData.objetivo,
      mentor: 'camila_porto', // Fallback
      formato: akinatorData.formato,
      canal: akinatorData.canal,
      estilo: akinatorData.estilo,
      modo: akinatorData.modo || 'akinator'
    };
  }
};
