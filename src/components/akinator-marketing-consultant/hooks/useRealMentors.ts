
import { useState, useEffect } from 'react';
import { listarMentores, Mentor } from '@/services/mentoresService';
import { MarketingConsultantState } from '../types';

interface MentorMapping {
  mentor: Mentor;
  marketingProfile: string;
  confidence: number;
}

export const useRealMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const realMentors = await listarMentores();
        setMentors(realMentors);
      } catch (error) {
        console.error('Erro ao carregar mentores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const getMentorMapping = (): Record<string, string> => {
    return {
      'Leandro Ladeira': 'especialista_conversao',
      'Ícaro de Carvalho': 'expert_storytelling',
      'Paulo Cuenca': 'consultor_criativo', 
      'Pedro Sobral': 'analista_performance',
      'Camila Porto': 'estrategista_digital',
      'Hyeser Souza': 'expert_engajamento',
      'Washington Olivetto': 'consultor_grandes_ideias'
    };
  };

  const inferBestMentor = (state: MarketingConsultantState): MentorMapping | null => {
    if (mentors.length === 0) return null;

    const mapping = getMentorMapping();
    let bestMatch: MentorMapping | null = null;
    let bestConfidence = 0;

    // Aplicar regras de inferência
    const rules = getInferenceRules(state);
    
    for (const rule of rules) {
      if (rule.condition(state) && rule.confidence > bestConfidence) {
        // Buscar mentor real correspondente ao perfil de marketing
        const realMentor = mentors.find(m => 
          mapping[m.nome] === rule.marketingProfile
        );
        
        if (realMentor) {
          bestMatch = {
            mentor: realMentor,
            marketingProfile: rule.marketingProfile,
            confidence: rule.confidence
          };
          bestConfidence = rule.confidence;
        }
      }
    }

    // Fallback para mentor padrão se não encontrar match
    if (!bestMatch && mentors.length > 0) {
      const defaultMentor = mentors.find(m => mapping[m.nome] === 'analista_performance') || mentors[0];
      bestMatch = {
        mentor: defaultMentor,
        marketingProfile: 'analista_performance',
        confidence: 0.3
      };
    }

    return bestMatch;
  };

  const getInferenceRules = (state: MarketingConsultantState) => {
    return [
      // Regras para clínicas médicas - foco em autoridade
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_medica' && 
          state.medicalObjective === 'aumentar_autoridade',
        marketingProfile: 'expert_storytelling',
        confidence: 0.9
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_medica' && 
          state.medicalClinicStyle === 'premium',
        marketingProfile: 'consultor_grandes_ideias',
        confidence: 0.85
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_medica' && 
          state.medicalObjective === 'escalar_negocio',
        marketingProfile: 'analista_performance',
        confidence: 0.88
      },

      // Regras para clínicas estéticas - foco em conversão
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_estetica' && 
          state.aestheticObjective === 'atrair_leads',
        marketingProfile: 'especialista_conversao',
        confidence: 0.9
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_estetica' && 
          (state.contentFrequency === 'raramente' || state.contentFrequency === 'nao_posto'),
        marketingProfile: 'estrategista_digital',
        confidence: 0.85
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.clinicType === 'clinica_estetica' && 
          state.aestheticClinicStyle === 'moderna',
        marketingProfile: 'consultor_criativo',
        confidence: 0.87
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.contentFrequency === 'diario' &&
          state.aestheticClinicStyle === 'humanizada',
        marketingProfile: 'expert_engajamento',
        confidence: 0.82
      },

      // Regras baseadas em faturamento e metas
      {
        condition: (state: MarketingConsultantState) => 
          state.currentRevenue === 'acima_60k' && 
          state.revenueGoal === 'dobrar',
        marketingProfile: 'expert_storytelling',
        confidence: 0.8
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.currentRevenue === 'ate_15k' && 
          (state.contentFrequency === 'raramente' || state.contentFrequency === 'nao_posto'),
        marketingProfile: 'estrategista_digital',
        confidence: 0.83
      },

      // Regras baseadas em comunicação
      {
        condition: (state: MarketingConsultantState) => 
          state.communicationStyle === 'emocional_inspirador',
        marketingProfile: 'expert_storytelling',
        confidence: 0.75
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.communicationStyle === 'tecnico_didatico',
        marketingProfile: 'analista_performance',
        confidence: 0.75
      },
      {
        condition: (state: MarketingConsultantState) => 
          state.communicationStyle === 'humanizado_proximo',
        marketingProfile: 'expert_engajamento',
        confidence: 0.78
      },

      // Regras baseadas no estilo da clínica
      {
        condition: (state: MarketingConsultantState) => 
          (state.medicalClinicStyle === 'premium' || state.aestheticClinicStyle === 'premium'),
        marketingProfile: 'consultor_grandes_ideias',
        confidence: 0.8
      },
      {
        condition: (state: MarketingConsultantState) => 
          (state.medicalClinicStyle === 'humanizada' || state.aestheticClinicStyle === 'humanizada'),
        marketingProfile: 'expert_storytelling',
        confidence: 0.75
      },
      {
        condition: (state: MarketingConsultantState) => 
          (state.medicalClinicStyle === 'moderna' || state.aestheticClinicStyle === 'moderna'),
        marketingProfile: 'consultor_criativo',
        confidence: 0.77
      }
    ];
  };

  const generateMentorEnigma = (mentorMapping: MentorMapping | null): string => {
    if (!mentorMapping) return "Você tem muito potencial com a estratégia certa!";
    
    const { mentor, marketingProfile } = mentorMapping;
    
    // Enigmas baseados no perfil do mentor real
    const enigmaTemplates: Record<string, string[]> = {
      'especialista_conversao': [
        `${mentor.nome.split(' ')[0]} olharia esses dados e transformaria cada número em vendas reais.`,
        "Alguém que vive de tráfego pago faria isso virar ouro rapidinho."
      ],
      'expert_storytelling': [
        `${mentor.nome.split(' ')[0]} contaria uma história com esses dados que ninguém esqueceria.`,
        "Quem domina narrativas transformaria isso em algo memorável."
      ],
      'consultor_criativo': [
        `${mentor.nome.split(' ')[0]} criaria algo visual com isso que seria pura arte.`,
        "Um olhar criativo transformaria esses dados em algo visualmente impactante."
      ],
      'analista_performance': [
        `${mentor.nome.split(' ')[0]} estruturaria esses números de um jeito que tudo faria sentido.`,
        "Quem entende de métricas faria isso render muito mais."
      ],
      'estrategista_digital': [
        `${mentor.nome.split(' ')[0]} organizaria isso de um jeito que qualquer um conseguiria seguir.`,
        "Organização estratégica transformaria isso em resultados consistentes."
      ],
      'expert_engajamento': [
        `${mentor.nome.split(' ')[0]} faria isso viralizar de um jeito natural.`,
        "Quem entende de engajamento transformaria isso em algo que todos compartilham."
      ],
      'consultor_grandes_ideias': [
        `${mentor.nome.split(' ')[0]} pensaria em algo grandioso com esse potencial.`,
        "Uma mente brilhante transformaria isso em algo revolucionário."
      ]
    };

    const templates = enigmaTemplates[marketingProfile] || ["Você tem muito potencial!"];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  return {
    mentors,
    loading,
    inferBestMentor,
    generateMentorEnigma
  };
};
