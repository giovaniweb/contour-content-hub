
import { MarketingConsultantState } from './types';
import { MarketingMentorInference } from './mentorInference';
import { generateAIDiagnostic } from '@/utils/aiDiagnosticUtils';

export const generateMarketingDiagnostic = async (
  state: MarketingConsultantState, 
  useAI: boolean = true
): Promise<string> => {
  // Se usar IA estiver habilitado, tentar gerar via OpenAI primeiro
  if (useAI) {
    try {
      const aiDiagnostic = await generateAIDiagnostic(state);
      if (aiDiagnostic) {
        return aiDiagnostic;
      }
    } catch (error) {
      console.error('Erro na geração via IA, usando fallback:', error);
    }
  }

  // Fallback para lógica atual
  return generateStaticDiagnostic(state);
};

// Função para chamar a IA diretamente (sem hook)
const callAIDiagnostic = async (state: MarketingConsultantState): Promise<string | null> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.functions.invoke('generate-marketing-diagnostic', {
      body: state
    });

    if (error || !data.success) {
      return null;
    }

    return data.diagnostic;
  } catch (error) {
    console.error('Erro na chamada da IA:', error);
    return null;
  }
};

// Função com a lógica estática atual (como fallback)
const generateStaticDiagnostic = (state: MarketingConsultantState): string => {
  const isClinicaMedica = state.clinicType === 'clinica_medica';
  const clinicTypeAnalysis = getClinicTypeAnalysis(state);
  const revenueAnalysis = getRevenueAnalysis(state.currentRevenue || '', state.revenueGoal || '');
  const marketingAnalysis = getMarketingAnalysis(state);
  const strategicActions = getStrategicActions(state);
  const nextSteps = getNextSteps(state);
  
  // Inferir mentor baseado no perfil
  const { mentor, enigma } = MarketingMentorInference.inferMentor(state);
  
  return `# 🎯 DIAGNÓSTICO ESTRATÉGICO FLUIDA

## 📊 PERFIL DA CLÍNICA
${clinicTypeAnalysis}

## 💰 ANÁLISE FINANCEIRA E OBJETIVOS
${revenueAnalysis}

## 📱 MARKETING E COMUNICAÇÃO ATUAL
${marketingAnalysis}

## 🚀 PLANO DE AÇÃO - 3 SEMANAS

### SEMANA 1: ${getWeek1Action(state)}
### SEMANA 2: ${getWeek2Action(state)}
### SEMANA 3: ${getWeek3Action(state)}

## 📈 ESTRATÉGIAS PERSONALIZADAS
${strategicActions}

## 🎯 PRÓXIMOS PASSOS PRIORITÁRIOS
${nextSteps}

## 🧩 REFLEXÃO ESTRATÉGICA
*Se ${mentor.name} olhasse esses dados ia fazer muitas sugestões boas, porque você tem muito potencial. ${enigma}*

---
*Diagnóstico gerado pelo Consultor Fluida AI*`;
};

const getClinicTypeAnalysis = (state: MarketingConsultantState): string => {
  if (state.clinicType === 'clinica_medica') {
    const specialty = getSpecialtyAnalysis(state.medicalSpecialty || '');
    const procedures = getProcedureAnalysis(state.medicalProcedures || '');
    const positioning = getPositioningAnalysis(state.clinicPosition || '');
    
    return `**CLÍNICA MÉDICA ESPECIALIZADA**
${specialty}
${procedures}
${positioning}

**Diferenciais identificados:**
- Credibilidade médica como vantagem competitiva
- Público mais exigente e com maior poder aquisitivo
- Comunicação deve focar em segurança e resultados científicos`;
  } else {
    const focus = getAestheticFocusAnalysis(state.aestheticFocus || '');
    const equipment = getEquipmentAnalysis(state.aestheticEquipments || '');
    const positioning = getPositioningAnalysis(state.clinicPosition || '');
    
    return `**CLÍNICA ESTÉTICA ESPECIALIZADA**
${focus}
${equipment}
${positioning}

**Diferenciais identificados:**
- Foco em bem-estar e autoestima
- Comunicação humanizada e emocional
- Público sensível a transformações visuais`;
  }
};

const getSpecialtyAnalysis = (specialty: string): string => {
  const analyses = {
    'dermatologia': 'Especialidade: Dermatologia - Autoridade médica natural em tratamentos de pele.',
    'nutrologia': 'Especialidade: Nutrologia - Foco em saúde integral e resultados duradouros.',
    'ginecoestetica': 'Especialidade: Ginecoestética - Nicho específico com alta demanda.',
    'cirurgia_plastica': 'Especialidade: Cirurgia Plástica - Procedimentos de alto valor agregado.',
    'medicina_estetica': 'Especialidade: Medicina Estética - Combinação perfeita de técnica e estética.',
    'outras': 'Especialidade médica diferenciada - Oportunidade de posicionamento único.'
  };
  return analyses[specialty as keyof typeof analyses] || 'Especialidade médica identificada.';
};

const getProcedureAnalysis = (procedures: string): string => {
  const analyses = {
    'invasivos': 'Procedimentos invasivos - Ticket alto, foco em resultados definitivos.',
    'injetaveis': 'Injetáveis - Recorrência natural, fidelização por manutenção.',
    'tecnologicos': 'Tecnológicos - Modernidade como diferencial, resultados progressivos.',
    'combinados': 'Portfólio combinado - Versatilidade para diferentes perfis de pacientes.'
  };
  return analyses[procedures as keyof typeof analyses] || 'Procedimentos médicos variados.';
};

const getAestheticFocusAnalysis = (focus: string): string => {
  const analyses = {
    'corporal': 'Foco corporal - Mercado sazonal, picos no verão e início do ano.',
    'facial': 'Foco facial - Demanda constante, menor sazonalidade.',
    'ambos': 'Portfólio completo - Vantagem competitiva pela diversidade.',
    'depilacao': 'Depilação a laser - Recorrência natural, base sólida de faturamento.'
  };
  return analyses[focus as keyof typeof analyses] || 'Foco estético definido.';
};

const getEquipmentAnalysis = (equipment: string): string => {
  const analyses = {
    'hifu_radio': 'HIFU e Radiofrequência - Tecnologia avançada para resultados corporais.',
    'heccus_crio': 'Heccus e Criolipólise - Foco em gordura localizada, alta demanda.',
    'laser_depilacao': 'Laser depilação - Base recorrente, faturamento previsível.',
    'sem_equipamentos': 'Clínica manual - Foco na técnica e relacionamento.',
    'varios': 'Múltiplos equipamentos - Portfólio diversificado.'
  };
  return analyses[equipment as keyof typeof equipment] || 'Equipamentos identificados.';
};

const getPositioningAnalysis = (position: string): string => {
  const analyses = {
    'premium': 'Posicionamento Premium - Foco em exclusividade e excelência.',
    'humanizada': 'Posicionamento Humanizado - Acolhimento e relacionamento próximo.',
    'acessivel': 'Posicionamento Acessível - Democratização dos tratamentos.',
    'tecnica': 'Posicionamento Técnico - Expertise e resultados científicos.',
    'moderna': 'Posicionamento Moderno - Inovação e tendências.'
  };
  return analyses[position as keyof typeof position] || 'Posicionamento definido.';
};

const getRevenueAnalysis = (current: string, goal: string): string => {
  const currentAnalysis = {
    'ate_15k': 'Faturamento inicial - Foco em estruturação e crescimento.',
    '15k_30k': 'Faturamento em crescimento - Momento de profissionalizar.',
    '30k_60k': 'Faturamento consolidado - Otimização e expansão.',
    'acima_60k': 'Alto faturamento - Eficiência e liderança de mercado.'
  };
  
  const goalAnalysis = {
    'crescer_30': 'Meta: Crescimento de 30% - Objetivo realista e alcançável.',
    'crescer_50': 'Meta: Crescimento de 50% - Ambição moderada, estratégia focada.',
    'dobrar': 'Meta: Dobrar faturamento - Objetivo ambicioso, mudança estrutural.',
    'manter_estavel': 'Meta: Manter estabilidade - Foco em eficiência operacional.'
  };
  
  return `${currentAnalysis[current as keyof typeof currentAnalysis] || 'Análise de faturamento'}\n${goalAnalysis[goal as keyof typeof goalAnalysis] || 'Meta definida'}`;
};

const getMarketingAnalysis = (state: MarketingConsultantState): string => {
  let analysis = 'Status atual do marketing:\n';
  
  const personalBrand = {
    'sim_sempre': '✅ Marca pessoal ativa - Vantagem competitiva estabelecida.',
    'as_vezes': '⚠️ Presença irregular - Oportunidade de consistência.',
    'raramente': '❌ Pouca exposição - Potencial inexplorado de autoridade.',
    'nunca': '❌ Ausência total - Necessidade urgente de posicionamento.'
  };
  
  const contentFreq = {
    'diario': '✅ Conteúdo diário - Excelente engajamento.',
    'varios_por_semana': '✅ Boa frequência - Manter consistência.',
    'semanal': '⚠️ Frequência baixa - Aumentar produção.',
    'irregular': '❌ Inconsistente - Criar cronograma estruturado.'
  };
  
  const paidTraffic = {
    'sim_regular': '✅ Tráfego pago ativo - Otimizar ROI.',
    'esporadico': '⚠️ Uso esporádico - Estruturar campanhas.',
    'ja_testei': '❌ Experiência negativa - Revisar estratégia.',
    'nunca_usei': '❌ Sem tráfego pago - Oportunidade de crescimento.'
  };
  
  analysis += personalBrand[state.personalBrand as keyof typeof personalBrand] || 'Presença pessoal não definida.';
  analysis += '\n' + (contentFreq[state.contentFrequency as keyof typeof contentFreq] || 'Frequência não definida.');
  analysis += '\n' + (paidTraffic[state.paidTraffic as keyof typeof paidTraffic] || 'Tráfego pago não definido.');
  
  return analysis;
};

const getStrategicActions = (state: MarketingConsultantState): string => {
  const isClinicaMedica = state.clinicType === 'clinica_medica';
  
  if (isClinicaMedica) {
    return `**Estratégias para Clínica Médica:**
• Conteúdo educativo com base científica
• Cases de sucesso com resultados mensuráveis
• Participação em eventos médicos e lives
• Parcerias com outros profissionais da saúde
• Comunicação técnica mas acessível`;
  } else {
    return `**Estratégias para Clínica Estética:**
• Transformações visuais (antes/depois)
• Conteúdo emocional e inspirador
• Depoimentos de clientes satisfeitas
• Trends e novidades do mercado estético
• Comunicação humanizada e próxima`;
  }
};

const getWeek1Action = (state: MarketingConsultantState): string => {
  if (state.personalBrand === 'nunca' || state.personalBrand === 'raramente') {
    return 'Estruturar presença pessoal e definir tom de comunicação';
  }
  if (state.contentFrequency === 'irregular') {
    return 'Criar cronograma de conteúdo e banco de ideias';
  }
  return 'Otimizar conteúdo atual e definir objetivos claros';
};

const getWeek2Action = (state: MarketingConsultantState): string => {
  if (state.paidTraffic === 'nunca_usei') {
    return 'Estruturar primeira campanha de tráfego pago';
  }
  if (state.clinicType === 'clinica_medica') {
    return 'Criar conteúdo de autoridade médica e cases';
  }
  return 'Implementar campanhas de captação e engajamento';
};

const getWeek3Action = (state: MarketingConsultantState): string => {
  return 'Análise de resultados, ajustes e planejamento do próximo mês';
};

const getNextSteps = (state: MarketingConsultantState): string => {
  const steps = [];
  
  if (state.personalBrand === 'nunca' || state.personalBrand === 'raramente') {
    steps.push('1. Definir posicionamento pessoal e começar a aparecer no conteúdo');
  }
  
  if (state.contentFrequency === 'irregular' || state.contentFrequency === 'semanal') {
    steps.push('2. Criar cronograma de conteúdo com no mínimo 3 posts por semana');
  }
  
  if (state.paidTraffic === 'nunca_usei' || state.paidTraffic === 'ja_testei') {
    steps.push('3. Estruturar estratégia de tráfego pago com orçamento definido');
  }
  
  steps.push('4. Implementar sistema de acompanhamento de métricas e ROI');
  
  return steps.join('\n');
};

const getEnigmaMentor = (state: MarketingConsultantState): string => {
  const enigmas = [
    "Quem entende seu público, não precisa gritar para ser ouvido.",
    "A consistência vence a perfeição em marketing digital.",
    "Autoridade se constrói compartilhando conhecimento, não escondendo.",
    "Quem não aparece, não vende. Quem aparece mal, vende menos ainda.",
    "O melhor marketing é aquele que não parece marketing.",
    "Resultados falam mais alto que promessas vazias.",
    "Humanizar é mais importante que vender."
  ];
  
  // Selecionar enigma baseado no perfil
  if (state.clinicType === 'clinica_medica') {
    return enigmas[2]; // Sobre autoridade
  }
  if (state.personalBrand === 'nunca') {
    return enigmas[3]; // Sobre aparecer
  }
  if (state.contentFrequency === 'irregular') {
    return enigmas[1]; // Sobre consistência
  }
  
  return enigmas[Math.floor(Math.random() * enigmas.length)];
};
