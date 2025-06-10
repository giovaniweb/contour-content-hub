
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';

interface ScoreBreakdown {
  revenueScore: number;
  objectiveScore: number;
  completenessScore: number;
  challengeScore: number;
  communicationScore: number;
  totalScore: number;
  label: string;
  color: string;
}

export const calculateStrategicScore = (session: DiagnosticSession): ScoreBreakdown => {
  const state = session.state;
  let totalScore = 0;
  let maxPossibleScore = 0;

  // 1. Revenue Score (25 pontos) - Baseado no faturamento atual
  let revenueScore = 0;
  maxPossibleScore += 25;
  
  switch (state.currentRevenue) {
    case 'ate_15k':
      revenueScore = 15; // Potencial de crescimento alto
      break;
    case '15k_30k':
      revenueScore = 18; // Bom ponto de partida
      break;
    case '30k_60k':
      revenueScore = 22; // Já estruturado
      break;
    case 'acima_60k':
      revenueScore = 25; // Excelente base
      break;
    default:
      revenueScore = 10; // Não informado
  }
  totalScore += revenueScore;

  // 2. Objective Score (20 pontos) - Baseado na clareza dos objetivos
  let objectiveScore = 0;
  maxPossibleScore += 20;
  
  const hasObjective = state.medicalObjective || state.aestheticObjective;
  if (hasObjective) {
    objectiveScore = 20;
    // Bonus para objetivos mais ambiciosos
    if (state.revenueGoal === 'triplicar') objectiveScore += 5;
    else if (state.revenueGoal === 'dobrar') objectiveScore += 3;
    else if (state.revenueGoal === 'crescer_50') objectiveScore += 2;
  } else {
    objectiveScore = 5;
  }
  totalScore += Math.min(objectiveScore, 20);

  // 3. Completeness Score (20 pontos) - Baseado na completude das respostas
  let completenessScore = 0;
  maxPossibleScore += 20;
  
  const completedFields = [
    state.clinicType,
    state.currentRevenue,
    state.revenueGoal,
    state.targetAudience,
    state.communicationStyle,
    state.mainChallenges,
    state.contentFrequency,
    hasObjective
  ].filter(Boolean).length;
  
  completenessScore = Math.round((completedFields / 8) * 20);
  totalScore += completenessScore;

  // 4. Challenge Score (15 pontos) - Baseado nos desafios identificados
  let challengeScore = 0;
  maxPossibleScore += 15;
  
  if (state.mainChallenges) {
    // Desafios mais específicos indicam maior consciência
    const challengeComplexity = {
      'falta_tempo': 12,
      'sem_conhecimento_marketing': 10,
      'dificuldade_criar_conteudo': 13,
      'baixo_engajamento': 14,
      'conversao_baixa': 15,
      'concorrencia_forte': 13
    };
    challengeScore = challengeComplexity[state.mainChallenges as keyof typeof challengeComplexity] || 8;
  }
  totalScore += challengeScore;

  // 5. Communication Score (20 pontos) - Baseado na estratégia de comunicação
  let communicationScore = 0;
  maxPossibleScore += 20;
  
  if (state.communicationStyle && state.contentFrequency) {
    communicationScore = 15;
    // Bonus para frequências mais altas
    if (state.contentFrequency.includes('diario')) communicationScore += 5;
    else if (state.contentFrequency.includes('3x')) communicationScore += 3;
    else if (state.contentFrequency.includes('semanal')) communicationScore += 2;
  } else if (state.communicationStyle || state.contentFrequency) {
    communicationScore = 10;
  }
  totalScore += communicationScore;

  // Normalizar para 100 pontos
  const finalScore = Math.round((totalScore / maxPossibleScore) * 100);

  // Aplicar bonus por diagnóstico completo
  const diagnosticBonus = session.isCompleted ? 5 : 0;
  const adjustedScore = Math.min(finalScore + diagnosticBonus, 100);

  // Determinar label e cor
  let label = '';
  let color = '';
  
  if (adjustedScore >= 80) {
    label = 'Excelente';
    color = 'text-green-400';
  } else if (adjustedScore >= 60) {
    label = 'Bom';
    color = 'text-yellow-400';
  } else if (adjustedScore >= 40) {
    label = 'Regular';
    color = 'text-orange-400';
  } else {
    label = 'Precisa Melhorar';
    color = 'text-red-400';
  }

  return {
    revenueScore,
    objectiveScore,
    completenessScore: completenessScore,
    challengeScore,
    communicationScore,
    totalScore: adjustedScore,
    label,
    color
  };
};

export const getScoreExplanation = (breakdown: ScoreBreakdown): string[] => {
  const explanations = [];
  
  if (breakdown.revenueScore >= 20) {
    explanations.push("✅ Faturamento atual indica boa estruturação");
  } else {
    explanations.push("📈 Potencial de crescimento significativo identificado");
  }
  
  if (breakdown.objectiveScore >= 18) {
    explanations.push("✅ Objetivos bem definidos e ambiciosos");
  } else {
    explanations.push("🎯 Definição de objetivos pode ser aprimorada");
  }
  
  if (breakdown.completenessScore >= 15) {
    explanations.push("✅ Perfil completo permite análise precisa");
  } else {
    explanations.push("📝 Informações adicionais melhorariam a análise");
  }
  
  if (breakdown.challengeScore >= 12) {
    explanations.push("✅ Consciência clara dos desafios principais");
  } else {
    explanations.push("🔍 Identificação de desafios pode ser aprofundada");
  }
  
  if (breakdown.communicationScore >= 15) {
    explanations.push("✅ Estratégia de comunicação bem estruturada");
  } else {
    explanations.push("💬 Estratégia de comunicação precisa ser definida");
  }
  
  return explanations;
};
