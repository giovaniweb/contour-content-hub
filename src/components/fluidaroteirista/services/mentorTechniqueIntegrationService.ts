
import { getMentorTechniques, selectBestTechnique } from '../utils/techniqueSelector';

export class MentorTechniqueIntegrationService {
  /**
   * Seleciona o mentor mais adequado baseado em formato e objetivo,
   * priorizando aqueles que possuem técnicas específicas
   */
  static async selectBestMentorForRequest(formato: string, objetivo: string): Promise<{
    mentorNome: string;
    mentorKey: string;
    tecnicaEncontrada: any | null;
  }> {
    console.log('🔍 [MentorTechniqueIntegration] Selecionando mentor para:', { formato, objetivo });

    // Lista de mentores para verificar (ordem de prioridade)
    const mentoresParaVerificar = [
      { nome: 'Leandro Ladeira', key: 'leandro_ladeira' },
      { nome: 'Paulo Cuenca', key: 'paulo_cuenca' },
      { nome: 'Pedro Sobral', key: 'pedro_sobral' },
      { nome: 'Ícaro de Carvalho', key: 'icaro_carvalho' },
      { nome: 'Hyeser Souza', key: 'hyeser_souza' },
      { nome: 'Camila Porto', key: 'camila_porto' }
    ];

    // REGRAS ESPECÍFICAS DE FORMATO
    if (formato === 'stories_10x' || formato === 'stories') {
      const leandro = mentoresParaVerificar.find(m => m.key === 'leandro_ladeira')!;
      const tecnicas = await getMentorTechniques(leandro.nome);
      const tecnicaCompativel = selectBestTechnique(tecnicas, formato, objetivo);
      
      console.log('🎯 [MentorTechniqueIntegration] Stories - selecionado Leandro Ladeira');
      return {
        mentorNome: leandro.nome,
        mentorKey: leandro.key,
        tecnicaEncontrada: tecnicaCompativel
      };
    }

    if (formato === 'carrossel') {
      const paulo = mentoresParaVerificar.find(m => m.key === 'paulo_cuenca')!;
      const tecnicas = await getMentorTechniques(paulo.nome);
      const tecnicaCompativel = selectBestTechnique(tecnicas, formato, objetivo);
      
      console.log('🎨 [MentorTechniqueIntegration] Carrossel - selecionado Paulo Cuenca');
      return {
        mentorNome: paulo.nome,
        mentorKey: paulo.key,
        tecnicaEncontrada: tecnicaCompativel
      };
    }

    // Buscar mentor que tem técnica compatível
    for (const mentor of mentoresParaVerificar) {
      try {
        const tecnicas = await getMentorTechniques(mentor.nome);
        
        if (tecnicas.length > 0) {
          const tecnicaCompativel = selectBestTechnique(tecnicas, formato, objetivo);
          
          if (tecnicaCompativel) {
            console.log(`✅ [MentorTechniqueIntegration] Mentor selecionado: ${mentor.nome} com técnica: ${tecnicaCompativel.nome}`);
            return {
              mentorNome: mentor.nome,
              mentorKey: mentor.key,
              tecnicaEncontrada: tecnicaCompativel
            };
          }
        }
      } catch (error) {
        console.warn(`⚠️ [MentorTechniqueIntegration] Erro ao verificar ${mentor.nome}:`, error);
      }
    }

    // Fallback - Camila Porto
    console.log('🔄 [MentorTechniqueIntegration] Usando fallback: Camila Porto');
    return {
      mentorNome: 'Camila Porto',
      mentorKey: 'camila_porto',
      tecnicaEncontrada: null
    };
  }

  /**
   * Valida se um mentor tem técnica para um formato específico
   */
  static async validateMentorTechniqueCompatibility(mentorNome: string, formato: string, objetivo: string): Promise<boolean> {
    try {
      const tecnicas = await getMentorTechniques(mentorNome);
      const tecnicaCompativel = selectBestTechnique(tecnicas, formato, objetivo);
      return !!tecnicaCompativel;
    } catch {
      return false;
    }
  }
}
