
import { supabase } from '@/integrations/supabase/client';

export interface TecnicaMentor {
  nome: string;
  formatos: string[];
  prompt: string;
  condicoes_ativacao: {
    formatos: string[];
    objetivos: string[];
    prioridade: number;
  };
}

export interface MentorComTecnicas {
  id: string;
  nome: string;
  prompt_base: string;
  tecnicas: TecnicaMentor[];
}

/**
 * Busca técnicas específicas de um mentor
 */
export const getMentorTechniques = async (mentorNome: string): Promise<TecnicaMentor[]> => {
  try {
    const { data, error } = await supabase
      .from('mentores')
      .select('tecnicas')
      .eq('nome', mentorNome)
      .single();

    if (error) {
      console.warn(`Erro ao buscar técnicas do mentor ${mentorNome}:`, error);
      return [];
    }

    // Fazer parsing seguro do JSONB para TecnicaMentor[]
    if (!data?.tecnicas) {
      return [];
    }

    // Verificar se tecnicas é um array e fazer conversão segura
    const tecnicas = Array.isArray(data.tecnicas) ? data.tecnicas as TecnicaMentor[] : [];
    
    return tecnicas;
  } catch (error) {
    console.warn('Erro ao buscar técnicas do mentor:', error);
    return [];
  }
};

/**
 * Seleciona a melhor técnica baseada no formato, objetivo e mentor
 */
export const selectBestTechnique = (
  tecnicas: TecnicaMentor[],
  formato: string,
  objetivo: string
): TecnicaMentor | null => {
  if (!tecnicas || tecnicas.length === 0) {
    return null;
  }

  // Filtrar técnicas compatíveis com o formato
  const compatibleTechniques = tecnicas.filter(tecnica =>
    tecnica.condicoes_ativacao.formatos.includes(formato)
  );

  if (compatibleTechniques.length === 0) {
    return null;
  }

  // Priorizar por objetivo se especificado
  const objectiveMatch = compatibleTechniques.filter(tecnica =>
    tecnica.condicoes_ativacao.objetivos.includes(objetivo)
  );

  const candidates = objectiveMatch.length > 0 ? objectiveMatch : compatibleTechniques;

  // Ordenar por prioridade (maior primeiro)
  candidates.sort((a, b) => 
    (b.condicoes_ativacao.prioridade || 0) - (a.condicoes_ativacao.prioridade || 0)
  );

  return candidates[0];
};

/**
 * Integra técnica específica ao prompt do mentor
 */
export const integrateSpecificTechnique = (
  promptBase: string,
  tecnica: TecnicaMentor,
  tema: string
): string => {
  console.log(`🎯 Usando técnica específica: ${tecnica.nome}`);
  
  // Substituir placeholder do tema na técnica
  const promptTecnica = tecnica.prompt.replace('[TEMA_INSERIDO]', tema);
  
  // Combinar prompt base com técnica específica
  return `${promptBase}

🎯 TÉCNICA ESPECÍFICA ATIVADA: ${tecnica.nome}

${promptTecnica}

IMPORTANTE: Use EXCLUSIVAMENTE a técnica específica acima. Ignore instruções genéricas e foque na metodologia detalhada da técnica.`;
};
