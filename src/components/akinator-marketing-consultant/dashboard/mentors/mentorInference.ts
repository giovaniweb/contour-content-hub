import { Mentor } from '@/services/mentoresService';
import { MarketingConsultantState } from '../../types';

// Somente os 4 mentores oficiais
export interface MentorMapping {
  mentor: Mentor;
  marketingProfile: string;
  confidence: number;
}

// Mapeamento: apenas 4 mentores
export function getMentorMapping(): Record<string, string> {
  return {
    'Pedro Sobral': 'arquiteto_do_planejamento',
    'Leandro Ladeira': 'mestre_do_copy',
    'Hyeser Souza': 'rei_do_viral',
    'Paulo Cuenca': 'diretor_visual',
  };
}

// Regras de inferência PARA APENAS os 4 mentores oficiais do sistema
export function getInferenceRules(state: MarketingConsultantState) {
  return [
    {
      condition: (state: MarketingConsultantState) =>
        state.clinicType === 'clinica_medica' &&
        state.medicalObjective === 'aumentar_autoridade',
      marketingProfile: 'arquiteto_do_planejamento',
      confidence: 0.93,
    },
    {
      condition: (state: MarketingConsultantState) =>
        state.clinicType === 'clinica_medica' &&
        state.medicalClinicStyle === 'premium',
      marketingProfile: 'diretor_visual',
      confidence: 0.91,
    },
    {
      condition: (state: MarketingConsultantState) =>
        state.clinicType === 'clinica_medica' &&
        state.medicalObjective === 'escalar_negocio',
      marketingProfile: 'arquiteto_do_planejamento',
      confidence: 0.89,
    },
    {
      condition: (state: MarketingConsultantState) =>
        state.clinicType === 'clinica_estetica' &&
        state.aestheticObjective === 'atrair_leads',
      marketingProfile: 'mestre_do_copy',
      confidence: 0.96,
    },
    {
      condition: (state: MarketingConsultantState) =>
        state.clinicType === 'clinica_estetica' &&
        (state.contentFrequency === 'raramente' || state.contentFrequency === 'nao_posto'),
      marketingProfile: 'rei_do_viral',
      confidence: 0.93,
    },
    {
      condition: (state: MarketingConsultantState) =>
        state.clinicType === 'clinica_estetica' &&
        state.aestheticClinicStyle === 'moderna',
      marketingProfile: 'diretor_visual',
      confidence: 0.87,
    },
    {
      condition: (state: MarketingConsultantState) =>
        state.contentFrequency === 'diario' &&
        state.aestheticClinicStyle === 'humanizada',
      marketingProfile: 'rei_do_viral',
      confidence: 0.85,
    },
    {
      condition: (state: MarketingConsultantState) =>
        state.currentRevenue === 'acima_60k' &&
        state.revenueGoal === 'dobrar',
      marketingProfile: 'arquiteto_do_planejamento',
      confidence: 0.84,
    },
    {
      condition: (state: MarketingConsultantState) =>
        state.communicationStyle === 'emocional_inspirador' ||
        state.communicationStyle === 'humanizado_proximo',
      marketingProfile: 'arquiteto_do_planejamento',
      confidence: 0.81,
    },
    {
      condition: (state: MarketingConsultantState) =>
        state.communicationStyle === 'tecnico_didatico',
      marketingProfile: 'mestre_do_copy',
      confidence: 0.86,
    },
    {
      condition: (state: MarketingConsultantState) =>
        state.communicationStyle === 'divertido' ||
        state.aestheticClinicStyle === 'moderna',
      marketingProfile: 'rei_do_viral',
      confidence: 0.83,
    },
    {
      condition: (state: MarketingConsultantState) =>
        (state.medicalClinicStyle === 'premium' || state.aestheticClinicStyle === 'premium'),
      marketingProfile: 'diretor_visual',
      confidence: 0.87,
    }
  ];
}

// Função principal para inferir mentor:
export function inferBestMentor(mentors: Mentor[], state: MarketingConsultantState): MentorMapping | null {
  if (!mentors?.length) return null;
  const mapping = getMentorMapping();
  let bestMatch: MentorMapping | null = null;
  let bestConfidence = 0;

  const rules = getInferenceRules(state);

  for (const rule of rules) {
    if (rule.condition(state) && rule.confidence > bestConfidence) {
      const realMentor = mentors.find(m => mapping[m.nome] === rule.marketingProfile);
      if (realMentor) {
        bestMatch = {
          mentor: realMentor,
          marketingProfile: rule.marketingProfile,
          confidence: rule.confidence,
        };
        bestConfidence = rule.confidence;
      }
    }
  }
  // Fallback: sempre retorna Pedro Sobral se nenhum selecionado
  if (!bestMatch) {
    const defaultMentor = mentors.find(m => mapping[m.nome] === 'arquiteto_do_planejamento') || mentors[0];
    bestMatch = {
      mentor: defaultMentor,
      marketingProfile: 'arquiteto_do_planejamento',
      confidence: 0.3,
    };
  }
  return bestMatch;
}

// Novos enigmas, apenas para 4 mentores. Texto fictício e divertido.
export function generateMentorEnigma(mentorMapping: MentorMapping | null): string {
  if (!mentorMapping) return "Você tem muito potencial para uma estratégia lendária!";
  const { mentor, marketingProfile } = mentorMapping;
  const enigmaTemplates: Record<string, string[]> = {
    'arquiteto_do_planejamento': [
      `${mentor.nome.split(' ')[0]} arquitetaria sua estratégia como quem monta um castelo sólido.`,
      "O mestre dos bastidores garantiria que nada fosse deixado ao acaso.",
    ],
    'mestre_do_copy': [
      `${mentor.nome.split(' ')[0]} transformaria suas palavras em vendas com poucas linhas.`,
      "Seu copy tem poder quase hipnótico e direto ao ponto.",
    ],
    'rei_do_viral': [
      `${mentor.nome.split(' ')[0]} seria capaz de viralizar seu conteúdo até em Marte.`,
      "Quem domina as trends nunca passa despercebido.",
    ],
    'diretor_visual': [
      `${mentor.nome.split(' ')[0]} faria tudo virar uma obra de arte marcante.`,
      "A estética garantiria que sua marca fosse lembrada para sempre.",
    ],
  };
  const templates = enigmaTemplates[marketingProfile] || ["Você é o próximo mentor lendário!"];
  return templates[Math.floor(Math.random() * templates.length)];
}
