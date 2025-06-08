
import { MarketingConsultantState } from './types';

export const generateMarketingDiagnostic = (state: MarketingConsultantState): string => {
  const clinicTypeText = getClinicTypeAnalysis(state.clinicType || '');
  const businessMaturity = getBusinessMaturityAnalysis(state.businessTime || '');
  const revenueAnalysis = getRevenueAnalysis(state.currentRevenue || '', state.revenueGoal || '');
  const challengeAnalysis = getChallengeAnalysis(state.mainChallenge || '');
  const marketingAnalysis = getMarketingAnalysis(state.marketingBudget || '', state.socialMediaPresence || '');
  const audienceAnalysis = getAudienceAnalysis(state.targetAudience || '');
  
  return `# 🎯 DIAGNÓSTICO PERSONALIZADO DA SUA CLÍNICA

## 📊 PERFIL DO NEGÓCIO
${clinicTypeText}
${businessMaturity}

## 💰 ANÁLISE FINANCEIRA
${revenueAnalysis}

## 🚀 PRINCIPAIS DESAFIOS
${challengeAnalysis}

## 📱 MARKETING DIGITAL
${marketingAnalysis}

## 🎭 PÚBLICO-ALVO
${audienceAnalysis}

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

**PRIORIDADE 1:** ${getPriority1(state)}
**PRIORIDADE 2:** ${getPriority2(state)}  
**PRIORIDADE 3:** ${getPriority3(state)}

## 📈 POTENCIAL DE CRESCIMENTO
Com as estratégias corretas, sua clínica tem potencial para ${getGrowthPotential(state)} nos próximos 6 meses.

*Diagnóstico gerado pelo Consultor Fluida AI*`;
};

const getClinicTypeAnalysis = (type: string): string => {
  const analyses = {
    'estetica_facial': 'Clínica especializada em estética facial - foco em rejuvenescimento e tratamentos faciais. Mercado com alta demanda e margem boa.',
    'estetica_corporal': 'Clínica focada em estética corporal - tratamentos de contorno e emagrecimento. Mercado sazonal com picos no verão.',
    'completa': 'Clínica completa facial e corporal - amplo portfólio de serviços. Vantagem competitiva pela diversidade de tratamentos.',
    'dermatologia': 'Dermatologia estética - posicionamento premium com tratamentos médicos. Alto valor agregado e confiança do paciente.'
  };
  return analyses[type as keyof typeof analyses] || 'Perfil de clínica não identificado.';
};

const getBusinessMaturityAnalysis = (time: string): string => {
  const analyses = {
    'iniciante': 'Negócio em fase inicial - foco deve ser em construir reputação e base de clientes fiéis.',
    'intermediario': 'Clínica em crescimento - momento ideal para investir em marketing e expansão.',
    'consolidado': 'Negócio consolidado - hora de otimizar operações e aumentar lucratividade.',
    'experiente': 'Clínica estabelecida - foco em inovação e diferenciação no mercado.'
  };
  return analyses[time as keyof typeof analyses] || 'Tempo de mercado não identificado.';
};

const getRevenueAnalysis = (current: string, goal: string): string => {
  const currentAnalysis = {
    'ate_10k': 'Faturamento inicial - foco em aumentar frequência de clientes.',
    '10k_30k': 'Faturamento em crescimento - momento de profissionalizar marketing.',
    '30k_50k': 'Faturamento sólido - investir em retenção e ticket médio.',
    'acima_50k': 'Faturamento excelente - foco em eficiência e expansão.'
  };
  
  return currentAnalysis[current as keyof typeof currentAnalysis] || 'Análise de faturamento indisponível.';
};

const getChallengeAnalysis = (challenge: string): string => {
  const analyses = {
    'atrair_clientes': 'Desafio: Atração de clientes. Solução: Investir em marketing digital e parcerias locais.',
    'converter_leads': 'Desafio: Conversão de leads. Solução: Melhorar processo de vendas e follow-up.',
    'fidelizar': 'Desafio: Fidelização. Solução: Criar programas de loyalty e comunicação pós-venda.',
    'aumentar_ticket': 'Desafio: Ticket médio baixo. Solução: Cross-sell, up-sell e pacotes de tratamentos.'
  };
  return analyses[challenge as keyof typeof analyses] || 'Desafio não identificado.';
};

const getMarketingAnalysis = (budget: string, presence: string): string => {
  let analysis = 'Status do marketing: ';
  
  if (budget === 'nada' && presence === 'inexistente') {
    analysis += 'Início necessário - começar com presença digital básica.';
  } else if (presence === 'profissional') {
    analysis += 'Estratégia avançada - otimizar ROI dos investimentos.';
  } else {
    analysis += 'Em desenvolvimento - aumentar consistência e profissionalização.';
  }
  
  return analysis;
};

const getAudienceAnalysis = (audience: string): string => {
  const analyses = {
    'jovens': 'Público jovem - focar em redes sociais, TikTok e Instagram com conteúdo viral.',
    'adultos': 'Público adulto - usar Facebook e Instagram com foco em resultados e depoimentos.',
    'maduros': 'Público maduro - WhatsApp, Facebook e marketing tradicional mais efetivos.',
    'todos': 'Público diverso - estratégia multi-canal com conteúdo segmentado por idade.'
  };
  return analyses[audience as keyof typeof analyses] || 'Público-alvo não definido.';
};

const getPriority1 = (state: MarketingConsultantState): string => {
  if (state.socialMediaPresence === 'inexistente') {
    return 'Criar presença digital básica (Instagram e Facebook)';
  }
  if (state.mainChallenge === 'atrair_clientes') {
    return 'Implementar estratégia de captação digital';
  }
  return 'Otimizar processo de conversão de leads';
};

const getPriority2 = (state: MarketingConsultantState): string => {
  if (state.marketingBudget === 'nada') {
    return 'Definir orçamento mínimo para marketing (3-5% do faturamento)';
  }
  return 'Criar cronograma de conteúdo e campanhas';
};

const getPriority3 = (state: MarketingConsultantState): string => {
  return 'Implementar sistema de acompanhamento de métricas e ROI';
};

const getGrowthPotential = (state: MarketingConsultantState): string => {
  if (state.socialMediaPresence === 'inexistente' && state.marketingBudget === 'nada') {
    return 'crescer 40-60% implementando marketing digital básico';
  }
  if (state.revenueGoal === 'dobrar') {
    return 'dobrar o faturamento com estratégia completa';
  }
  return 'aumentar 30-50% com otimizações estratégicas';
};
