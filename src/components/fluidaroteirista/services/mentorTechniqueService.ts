
import { getMentorTechniques, selectBestTechnique, TecnicaMentor } from '../utils/techniqueSelector';

export class MentorTechniqueService {
  private static instance: MentorTechniqueService;
  private techniqueCache: Map<string, TecnicaMentor[]> = new Map();

  static getInstance(): MentorTechniqueService {
    if (!MentorTechniqueService.instance) {
      MentorTechniqueService.instance = new MentorTechniqueService();
    }
    return MentorTechniqueService.instance;
  }

  async getMentorTechniques(mentorName: string): Promise<TecnicaMentor[]> {
    // Verificar cache primeiro
    if (this.techniqueCache.has(mentorName)) {
      console.log(`📋 [MentorTechniqueService] Técnicas em cache para ${mentorName}`);
      return this.techniqueCache.get(mentorName)!;
    }

    // Buscar do banco
    const techniques = await getMentorTechniques(mentorName);
    
    // Salvar no cache
    this.techniqueCache.set(mentorName, techniques);
    
    console.log(`🎯 [MentorTechniqueService] Carregadas ${techniques.length} técnicas para ${mentorName}`);
    return techniques;
  }

  async selectOptimalTechnique(
    mentorName: string,
    formato: string,
    objetivo: string
  ): Promise<TecnicaMentor | null> {
    const techniques = await this.getMentorTechniques(mentorName);
    
    if (techniques.length === 0) {
      console.warn(`⚠️ [MentorTechniqueService] Nenhuma técnica encontrada para ${mentorName}`);
      return null;
    }

    const selected = selectBestTechnique(techniques, formato, objetivo);
    
    if (selected) {
      console.log(`✨ [MentorTechniqueService] Técnica selecionada: ${selected.nome} (prioridade: ${selected.condicoes_ativacao.prioridade})`);
    } else {
      console.warn(`⚠️ [MentorTechniqueService] Nenhuma técnica compatível encontrada para formato: ${formato}, objetivo: ${objetivo}`);
    }
    
    return selected;
  }

  clearCache(): void {
    this.techniqueCache.clear();
    console.log('🧹 [MentorTechniqueService] Cache de técnicas limpo');
  }

  getCacheStatus(): { [mentor: string]: number } {
    const status: { [mentor: string]: number } = {};
    this.techniqueCache.forEach((techniques, mentor) => {
      status[mentor] = techniques.length;
    });
    return status;
  }

  // Métodos de diagnóstico
  async validateTechniqueIntegration(mentorName: string): Promise<{
    mentor: string;
    techniquesFound: number;
    techniquesDetails: Array<{
      nome: string;
      formatos: string[];
      objetivos: string[];
      prioridade: number;
    }>;
  }> {
    const techniques = await this.getMentorTechniques(mentorName);
    
    return {
      mentor: mentorName,
      techniquesFound: techniques.length,
      techniquesDetails: techniques.map(t => ({
        nome: t.nome,
        formatos: t.condicoes_ativacao.formatos,
        objetivos: t.condicoes_ativacao.objetivos,
        prioridade: t.condicoes_ativacao.prioridade
      }))
    };
  }
}

export const mentorTechniqueService = MentorTechniqueService.getInstance();
