
import { MarketingConsultantState } from './types';

export interface MarketingMentor {
  key: string;
  name: string;
  focus: string;
  style: string;
  expertise: string[];
}

export const MARKETING_MENTORS: Record<string, MarketingMentor> = {
  'leandro_ladeira': {
    key: 'leandro_ladeira',
    name: 'Leandro Ladeira',
    focus: 'Conversão e vendas diretas',
    style: 'Direto, persuasivo, focado em resultados',
    expertise: ['tráfego pago', 'conversão', 'vendas', 'gatilhos mentais']
  },
  'icaro_carvalho': {
    key: 'icaro_carvalho', 
    name: 'Ícaro de Carvalho',
    focus: 'Storytelling e posicionamento',
    style: 'Narrativo, emocional, construção de marca',
    expertise: ['branding', 'storytelling', 'autoridade', 'posicionamento']
  },
  'camila_porto': {
    key: 'camila_porto',
    name: 'Camila Porto',
    focus: 'Marketing digital acessível',
    style: 'Didático, simples, estruturado',
    expertise: ['redes sociais', 'conteúdo', 'iniciantes', 'organização']
  },
  'paulo_cuenca': {
    key: 'paulo_cuenca',
    name: 'Paulo Cuenca',
    focus: 'Criatividade e estética visual',
    style: 'Criativo, visual, artístico',
    expertise: ['criatividade', 'visual', 'branding', 'diferenciação']
  },
  'hyeser_souza': {
    key: 'hyeser_souza',
    name: 'Hyeser Souza',
    focus: 'Virais e engajamento orgânico',
    style: 'Viral, engraçado, popular',
    expertise: ['virais', 'engajamento', 'trends', 'alcance orgânico']
  },
  'washington_olivetto': {
    key: 'washington_olivetto',
    name: 'Washington Olivetto',
    focus: 'Big ideas e branding institucional',
    style: 'Conceitual, memorável, institucional',
    expertise: ['big ideas', 'branding', 'conceito', 'diferenciação']
  },
  'pedro_sobral': {
    key: 'pedro_sobral',
    name: 'Pedro Sobral',
    focus: 'Performance e ROI estruturado',
    style: 'Técnico, analítico, estruturado',
    expertise: ['performance', 'métricas', 'ROI', 'estruturação']
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

export class MarketingMentorInference {
  static inferMentor(state: MarketingConsultantState): { mentor: MarketingMentor; enigma: string; confidence: number } {
    let bestMentorKey = 'pedro_sobral'; // default
    let bestConfidence = 0.3;

    // Regras de inferência baseadas no perfil da clínica
    const rules = this.getInferenceRules();
    
    for (const rule of rules) {
      if (rule.condition(state) && rule.confidence > bestConfidence) {
        bestMentorKey = rule.mentorKey;
        bestConfidence = rule.confidence;
      }
    }

    const mentor = MARKETING_MENTORS[bestMentorKey];
    const enigma = MENTOR_ENIGMAS[bestMentorKey];

    return {
      mentor,
      enigma,
      confidence: bestConfidence
    };
  }

  private static getInferenceRules() {
    return [
      // Regras para clínicas médicas
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_medica' && 
          state.medicalObjective === 'autoridade',
        mentorKey: 'icaro_carvalho',
        confidence: 0.9
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_medica' && 
          state.clinicPosition === 'premium',
        mentorKey: 'washington_olivetto',
        confidence: 0.85
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_medica' && 
          state.medicalObjective === 'escala' &&
          state.paidTraffic === 'nunca_usei',
        mentorKey: 'pedro_sobral',
        confidence: 0.88
      },

      // Regras para clínicas estéticas
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_estetica' && 
          state.aestheticObjective === 'mais_leads' &&
          state.paidTraffic === 'nunca_usei',
        mentorKey: 'leandro_ladeira',
        confidence: 0.9
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_estetica' && 
          state.personalBrand === 'nunca' &&
          state.contentFrequency === 'irregular',
        mentorKey: 'camila_porto',
        confidence: 0.85
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_estetica' && 
          state.aestheticObjective === 'autoridade' &&
          state.clinicPosition === 'moderna',
        mentorKey: 'paulo_cuenca',
        confidence: 0.87
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.personalBrand === 'sim_sempre' && 
          state.contentFrequency === 'diario' &&
          state.clinicPosition === 'humanizada',
        mentorKey: 'hyeser_souza',
        confidence: 0.82
      },

      // Regras baseadas em faturamento e metas
      {
        condition: (state: MarketingConsultantState) => 
          state.currentRevenue === 'acima_60k' && 
          state.revenueGoal === 'dobrar',
        mentorKey: 'icaro_carvalho',
        confidence: 0.8
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.currentRevenue === 'ate_15k' && 
          state.contentFrequency === 'irregular',
        mentorKey: 'camila_porto',
        confidence: 0.83
      },

      // Regras baseadas em presença digital
      {
        condition: (state: MarketingConsultantState) => 
          state.paidTraffic === 'sim_regular' && 
          state.personalBrand === 'sim_sempre',
        mentorKey: 'leandro_ladeira',
        confidence: 0.85
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.personalBrand === 'raramente' && 
          state.clinicPosition === 'premium',
        mentorKey: 'washington_olivetto',
        confidence: 0.8
      }
    ];
  }
}
