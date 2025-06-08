
import { MarketingConsultantState } from './types';

export interface MarketingMentor {
  key: string;
  name: string;
  focus: string;
  style: string;
  expertise: string[];
}

export const MARKETING_MENTORS: Record<string, MarketingMentor> = {
  'especialista_conversao': {
    key: 'especialista_conversao',
    name: 'Especialista em Conversão',
    focus: 'Tráfego pago e vendas diretas',
    style: 'Direto, persuasivo, focado em resultados',
    expertise: ['tráfego pago', 'conversão', 'vendas', 'gatilhos mentais']
  },
  'expert_storytelling': {
    key: 'expert_storytelling', 
    name: 'Expert em Storytelling',
    focus: 'Autoridade e posicionamento',
    style: 'Narrativo, emocional, construção de marca',
    expertise: ['branding', 'storytelling', 'autoridade', 'posicionamento']
  },
  'estrategista_digital': {
    key: 'estrategista_digital',
    name: 'Estrategista Digital',
    focus: 'Marketing digital estruturado',
    style: 'Didático, simples, organizado',
    expertise: ['redes sociais', 'conteúdo', 'iniciantes', 'organização']
  },
  'consultor_criativo': {
    key: 'consultor_criativo',
    name: 'Consultor Criativo',
    focus: 'Identidade visual e diferenciação',
    style: 'Criativo, visual, artístico',
    expertise: ['criatividade', 'visual', 'branding', 'diferenciação']
  },
  'expert_engajamento': {
    key: 'expert_engajamento',
    name: 'Expert em Engajamento',
    focus: 'Crescimento orgânico e virais',
    style: 'Viral, engajado, popular',
    expertise: ['virais', 'engajamento', 'trends', 'alcance orgânico']
  },
  'consultor_grandes_ideias': {
    key: 'consultor_grandes_ideias',
    name: 'Consultor de Grandes Ideias',
    focus: 'Conceitos memoráveis e branding',
    style: 'Conceitual, memorável, institucional',
    expertise: ['big ideas', 'branding', 'conceito', 'diferenciação']
  },
  'analista_performance': {
    key: 'analista_performance',
    name: 'Analista de Performance',
    focus: 'ROI e métricas estruturadas',
    style: 'Técnico, analítico, estruturado',
    expertise: ['performance', 'métricas', 'ROI', 'estruturação']
  }
};

export const MENTOR_ENIGMAS: Record<string, string> = {
  'especialista_conversao': "Quem domina gatilhos, vende mais que imagina.",
  'expert_storytelling': "Histórias que tocam, convertem sem forçar.",
  'consultor_criativo': "Criatividade visual que marca para sempre.",
  'estrategista_digital': "Simplicidade que todos entendem e seguem.",
  'expert_engajamento': "Engajamento genuíno que viraliza naturalmente.",
  'consultor_grandes_ideias': "Grandes ideias que mudam mercados inteiros.",
  'analista_performance': "Métricas claras que antecipam resultados."
};

export class MarketingMentorInference {
  static inferMentor(state: MarketingConsultantState): { mentor: MarketingMentor; enigma: string; confidence: number } {
    let bestMentorKey = 'analista_performance'; // default
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
      // Regras para clínicas médicas - foco em autoridade
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_medica' && 
          state.medicalObjective === 'aumentar_autoridade',
        mentorKey: 'expert_storytelling',
        confidence: 0.9
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_medica' && 
          state.medicalClinicStyle === 'premium',
        mentorKey: 'consultor_grandes_ideias',
        confidence: 0.85
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_medica' && 
          state.medicalObjective === 'escalar_negocio',
        mentorKey: 'analista_performance',
        confidence: 0.88
      },

      // Regras para clínicas estéticas - foco em conversão
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_estetica' && 
          state.aestheticObjective === 'atrair_leads',
        mentorKey: 'especialista_conversao',
        confidence: 0.9
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_estetica' && 
          (state.contentFrequency === 'raramente' || state.contentFrequency === 'nao_posto'),
        mentorKey: 'estrategista_digital',
        confidence: 0.85
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_estetica' && 
          state.aestheticClinicStyle === 'moderna',
        mentorKey: 'consultor_criativo',
        confidence: 0.87
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.contentFrequency === 'diario' &&
          state.aestheticClinicStyle === 'humanizada',
        mentorKey: 'expert_engajamento',
        confidence: 0.82
      },

      // Regras baseadas em faturamento e metas
      {
        condition: (state: MarketingConsultantState) => 
          state.currentRevenue === 'acima_60k' && 
          state.revenueGoal === 'dobrar',
        mentorKey: 'expert_storytelling',
        confidence: 0.8
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.currentRevenue === 'ate_15k' && 
          (state.contentFrequency === 'raramente' || state.contentFrequency === 'nao_posto'),
        mentorKey: 'estrategista_digital',
        confidence: 0.83
      },

      // Regras baseadas em comunicação
      {
        condition: (state: MarketingConsultantState) => 
          state.communicationStyle === 'emocional',
        mentorKey: 'expert_storytelling',
        confidence: 0.75
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.communicationStyle === 'tecnico',
        mentorKey: 'analista_performance',
        confidence: 0.75
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.communicationStyle === 'divertido',
        mentorKey: 'expert_engajamento',
        confidence: 0.78
      },

      // Regras baseadas no estilo da clínica
      {
        condition: (state: MarketingConsultantState) => 
          (state.medicalClinicStyle === 'premium' || state.aestheticClinicStyle === 'premium'),
        mentorKey: 'consultor_grandes_ideias',
        confidence: 0.8
      },
      {
        condition: (state: MarketingConsultantState) => 
          (state.medicalClinicStyle === 'humanizada' || state.aestheticClinicStyle === 'humanizada'),
        mentorKey: 'expert_storytelling',
        confidence: 0.75
      },
      {
        condition: (state: MarketingConsultantState) => 
          (state.medicalClinicStyle === 'moderna' || state.aestheticClinicStyle === 'moderna' || 
           state.medicalClinicStyle === 'inovadora'),
        mentorKey: 'consultor_criativo',
        confidence: 0.77
      }
    ];
  }
}
