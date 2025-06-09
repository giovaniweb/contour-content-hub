import { MarketingConsultantState } from './types';
import { MarketingMentorInference } from './mentorInference';

// Esta função agora apenas serve como fallback estático
// A geração principal é feita via useAIDiagnostic hook
export const generateMarketingDiagnostic = async (
  state: MarketingConsultantState, 
  useAI: boolean = false
): Promise<string> => {
  console.log('🎯 generateMarketingDiagnostic (fallback) chamado');
  console.log('📊 Estado recebido:', JSON.stringify(state, null, 2));

  // Esta versão é apenas para fallback local
  if (!useAI) {
    console.log('🔄 Usando sistema de fallback (diagnóstico estático)');
    return generateStaticDiagnostic(state);
  }

  // Para IA, usar o hook useAIDiagnostic
  console.log('⚠️ Para usar IA, utilize o hook useAIDiagnostic');
  return generateStaticDiagnostic(state);
};

// Função para chamar a IA diretamente (sem hook)
const callAIDiagnostic = async (state: MarketingConsultantState): Promise<string | null> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    console.log('🌐 Chamando edge function diretamente...');
    
    const { data, error } = await supabase.functions.invoke('generate-marketing-diagnostic', {
      body: state
    });

    console.log('📡 Resposta da edge function direta:', { data, error });

    if (error || !data.success) {
      console.log('❌ Edge function falhou:', error || data.error);
      return null;
    }

    console.log('✅ Edge function sucesso!');
    return data.diagnostic;
  } catch (error) {
    console.error('💥 Erro na chamada da IA:', error);
    return null;
  }
};

// Função com a lógica estática atual (como fallback)
const generateStaticDiagnostic = (state: MarketingConsultantState): string => {
  console.log('📝 Gerando diagnóstico estático para estado:', state);
  
  const isClinicaMedica = state.clinicType === 'clinica_medica';
  const clinicTypeAnalysis = getClinicTypeAnalysis(state);
  const revenueAnalysis = getRevenueAnalysis(state.currentRevenue || '', state.revenueGoal || '');
  const marketingAnalysis = getMarketingAnalysis(state);
  const strategicActions = getStrategicActions(state);
  const nextSteps = getNextSteps(state);
  
  // Inferir mentor baseado no perfil
  const { mentor, enigma } = MarketingMentorInference.inferMentor(state);
  
  console.log('🧠 Mentor inferido:', mentor.name);
  console.log('🎭 Enigma:', enigma);
  
  // Gerar variações dinâmicas para evitar sempre o mesmo resultado
  const currentTime = Date.now();
  const variationSeed = currentTime % 5; // 5 variações diferentes
  
  const diagnosticVariations = generateDynamicVariations(state, variationSeed);
  
  return `# 🎯 DIAGNÓSTICO ESTRATÉGICO FLUIDA ${getDiagnosticTimestamp()}

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

${diagnosticVariations}

## 🎯 PRÓXIMOS PASSOS PRIORITÁRIOS
${nextSteps}

## 🧩 MENTOR ESTRATÉGICO IDENTIFICADO

**🧠 ${mentor.name}**
**Especialidade:** ${mentor.focus}
**Por que foi escolhido:** Baseado no seu perfil de ${state.clinicType === 'clinica_medica' ? 'clínica médica' : 'clínica estética'} com foco em ${getMainObjective(state)}.

**💭 Reflexão Estratégica:**
*"${enigma}"*

---
*Diagnóstico gerado pelo Consultor Fluida AI - ${new Date().toLocaleString('pt-BR')}*`;
};

// Função para gerar variações dinâmicas
const generateDynamicVariations = (state: MarketingConsultantState, seed: number): string => {
  const variations = [
    `## 💡 INSIGHTS ESPECIAIS
• Timing ideal para implementação: ${getTimingInsight(state)}
• Oportunidade sazonal identificada: ${getSeasonalOpportunity(state)}
• Diferencial competitivo: ${getCompetitiveAdvantage(state)}`,
    
    `## 🎯 FOCO ESTRATÉGICO
• Prioridade máxima: ${getTopPriority(state)}
• Quick wins identificados: ${getQuickWins(state)}
• Investimento recomendado: ${getInvestmentRecommendation(state)}`,
    
    `## 📊 ANÁLISE DE MERCADO
• Posicionamento atual: ${getCurrentPositioning(state)}
• Gaps de oportunidade: ${getOpportunityGaps(state)}
• Benchmarks do setor: ${getSectorBenchmarks(state)}`,
    
    `## 🚀 ACELERAÇÃO DE CRESCIMENTO
• Alavancas de crescimento: ${getGrowthLevers(state)}
• Otimizações prioritárias: ${getPriorityOptimizations(state)}
• Métricas de acompanhamento: ${getKPIs(state)}`,
    
    `## 🎨 ESTRATÉGIA CRIATIVA
• Conceito de comunicação: ${getCommunicationConcept(state)}
• Narrativa da marca: ${getBrandNarrative(state)}
• Elementos visuais: ${getVisualElements(state)}`
  ];
  
  return variations[seed] || variations[0];
};

// Funções auxiliares para variações dinâmicas
const getDiagnosticTimestamp = (): string => {
  const now = new Date();
  return `v${now.getDate()}.${now.getMonth() + 1}`;
};

const getMainObjective = (state: MarketingConsultantState): string => {
  if (state.clinicType === 'clinica_medica') {
    return state.medicalObjective === 'aumentar_autoridade' ? 'construção de autoridade médica' : 
           state.medicalObjective === 'escalar_negocio' ? 'escalabilidade e estruturação' : 'crescimento sustentável';
  } else {
    return state.aestheticObjective === 'atrair_leads' ? 'geração de leads' :
           state.aestheticObjective === 'aumentar_recorrencia' ? 'aumento de recorrência' : 'otimização de resultados';
  }
};

const getTimingInsight = (state: MarketingConsultantState): string => {
  const month = new Date().getMonth();
  if (month >= 10 || month <= 1) return 'Janeiro/Fevereiro - Alta demanda estética';
  if (month >= 2 && month <= 4) return 'Março/Maio - Consolidação de hábitos';
  if (month >= 5 && month <= 7) return 'Junho/Agosto - Preparação para o verão';
  return 'Setembro/Dezembro - Planejamento para o próximo ano';
};

const getSeasonalOpportunity = (state: MarketingConsultantState): string => {
  if (state.clinicType === 'clinica_estetica') {
    return 'Tratamentos corporais em alta demanda';
  } else {
    return 'Procedimentos preventivos em foco';
  }
};

const getCompetitiveAdvantage = (state: MarketingConsultantState): string => {
  const clinicStyle = state.clinicType === 'clinica_medica' ? state.medicalClinicStyle : state.aestheticClinicStyle;
  
  if (clinicStyle === 'premium') return 'Posicionamento premium estabelecido';
  if (clinicStyle === 'humanizada') return 'Relacionamento humanizado';
  if (clinicStyle === 'moderna' || clinicStyle === 'inovadora') return 'Tecnologia e inovação';
  return 'Oportunidade de diferenciação técnica';
};

const getTopPriority = (state: MarketingConsultantState): string => {
  if (state.contentFrequency === 'raramente' || state.contentFrequency === 'nao_posto') {
    return 'Consistência na comunicação';
  }
  if (state.clinicType === 'clinica_medica' && state.medicalObjective === 'aumentar_autoridade') {
    return 'Construção de autoridade médica';
  }
  return 'Otimização da estratégia atual';
};

const getQuickWins = (state: MarketingConsultantState): string => {
  return state.clinicType === 'clinica_estetica' ? 
    'Stories com antes/depois, depoimentos em vídeo' :
    'Conteúdo educativo, cases científicos';
};

const getInvestmentRecommendation = (state: MarketingConsultantState): string => {
  if (state.currentRevenue === 'ate_15k') return 'R$ 1.500-3.000/mês em marketing';
  if (state.currentRevenue === '15k_30k') return 'R$ 3.000-6.000/mês em marketing';
  if (state.currentRevenue === '30k_60k') return 'R$ 6.000-12.000/mês em marketing';
  return 'R$ 12.000+/mês em marketing estruturado';
};

const getCurrentPositioning = (state: MarketingConsultantState): string => {
  const clinicStyle = state.clinicType === 'clinica_medica' ? state.medicalClinicStyle : state.aestheticClinicStyle;
  const clinicTypeLabel = state.clinicType === 'clinica_medica' ? 'Credibilidade técnica' : 'Foco em resultados';
  return `${clinicStyle || 'Em definição'} - ${clinicTypeLabel}`;
};

const getOpportunityGaps = (state: MarketingConsultantState): string => {
  const gaps = [];
  if (state.contentFrequency === 'raramente' || state.contentFrequency === 'nao_posto') {
    gaps.push('consistência de conteúdo');
  }
  if (!state.medicalEquipments && !state.aestheticEquipments) {
    gaps.push('comunicação de diferenciais técnicos');
  }
  return gaps.length ? gaps.join(', ') : 'Otimização da estratégia atual';
};

const getSectorBenchmarks = (state: MarketingConsultantState): string => {
  return state.clinicType === 'clinica_medica' ? 
    'CAC médio R$ 200-400, LTV R$ 3.000-8.000' :
    'CAC médio R$ 150-300, LTV R$ 2.000-5.000';
};

const getGrowthLevers = (state: MarketingConsultantState): string => {
  if (state.clinicType === 'clinica_medica') {
    return 'Autoridade científica, parcerias médicas, educação continuada';
  } else {
    return 'Transformações visuais, indicações, experiência do cliente';
  }
};

const getPriorityOptimizations = (state: MarketingConsultantState): string => {
  if (state.contentFrequency === 'diario') {
    return 'ROI do conteúdo, segmentação de audiência';
  } else {
    return 'Funil de conversão, landing pages';
  }
};

const getKPIs = (state: MarketingConsultantState): string => {
  return 'CAC, LTV, taxa de conversão, engajamento, NPS';
};

const getCommunicationConcept = (state: MarketingConsultantState): string => {
  const clinicStyle = state.clinicType === 'clinica_medica' ? state.medicalClinicStyle : state.aestheticClinicStyle;
  
  if (clinicStyle === 'premium') return 'Excelência e exclusividade';
  if (clinicStyle === 'humanizada') return 'Cuidado e acolhimento';
  if (clinicStyle === 'moderna' || clinicStyle === 'inovadora') return 'Inovação e tecnologia';
  return 'Resultados e confiança';
};

const getBrandNarrative = (state: MarketingConsultantState): string => {
  return state.clinicType === 'clinica_medica' ? 
    'Ciência aplicada ao bem-estar' :
    'Transformação com segurança e naturalidade';
};

const getVisualElements = (state: MarketingConsultantState): string => {
  return state.clinicType === 'clinica_medica' ? 
    'Paleta clean, tipografia moderna, ícones científicos' :
    'Cores vibrantes, antes/depois, lifestyle aspiracional';
};

const getClinicTypeAnalysis = (state: MarketingConsultantState): string => {
  if (state.clinicType === 'clinica_medica') {
    const specialty = getSpecialtyAnalysis(state.medicalSpecialty || '');
    const procedures = getProcedureAnalysis(state.medicalProcedures || '');
    const positioning = getPositioningAnalysis(state.medicalClinicStyle || '');
    
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
    const positioning = getPositioningAnalysis(state.aestheticClinicStyle || '');
    
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
    'ginecologia_estetica': 'Especialidade: Ginecoestética - Nicho específico com alta demanda.',
    'cirurgia_plastica': 'Especialidade: Cirurgia Plástica - Procedimentos de alto valor agregado.',
    'medicina_estetica': 'Especialidade: Medicina Estética - Combinação perfeita de técnica e estética.',
    'outras': 'Especialidade médica diferenciada - Oportunidade de posicionamento único.'
  };
  return analyses[specialty as keyof typeof analyses] || 'Especialidade médica identificada.';
};

const getProcedureAnalysis = (procedures: string): string => {
  const analyses = {
    'injetaveis': 'Injetáveis - Recorrência natural, fidelização por manutenção.',
    'peelings': 'Peelings - Tecnologia avançada, resultados progressivos.',
    'laser_medico': 'Laser Médico - Modernidade como diferencial.',
    'cirurgias_menores': 'Cirurgias Menores - Ticket alto, resultados definitivos.',
    'harmonizacao_facial': 'Harmonização Facial - Alta demanda, resultados estéticos.',
    'tratamentos_corporais': 'Tratamentos Corporais - Versatilidade de procedimentos.',
    'outros': 'Procedimentos médicos variados - Portfólio diversificado.'
  };
  return analyses[procedures as keyof typeof analyses] || 'Procedimentos médicos variados.';
};

const getAestheticFocusAnalysis = (focus: string): string => {
  const analyses = {
    'corporal': 'Foco corporal - Mercado sazonal, picos no verão e início do ano.',
    'facial': 'Foco facial - Demanda constante, menor sazonalidade.',
    'ambos': 'Portfólio completo - Vantagem competitiva pela diversidade.',
    'capilar': 'Tratamentos capilares - Nicho específico com recorrência.',
    'depilacao': 'Depilação a laser - Recorrência natural, base sólida de faturamento.'
  };
  return analyses[focus as keyof typeof analyses] || 'Foco estético definido.';
};

const getEquipmentAnalysis = (equipment: string): string => {
  if (!equipment || equipment.trim() === '') {
    return 'Clínica manual - Foco na técnica e relacionamento.';
  }
  return `Equipamentos identificados: ${equipment} - Tecnologia como diferencial competitivo.`;
};

const getPositioningAnalysis = (position: string): string => {
  const analyses = {
    'premium': 'Posicionamento Premium - Foco em exclusividade e excelência.',
    'humanizada': 'Posicionamento Humanizado - Acolhimento e relacionamento próximo.',
    'acessivel': 'Posicionamento Acessível - Democratização dos tratamentos.',
    'tecnica': 'Posicionamento Técnico - Expertise e resultados científicos.',
    'moderna': 'Posicionamento Moderno - Inovação e tendências.',
    'popular': 'Posicionamento Popular - Foco na acessibilidade.',
    'inovadora': 'Posicionamento Inovador - Tecnologia de ponta.',
    'elegante': 'Posicionamento Elegante - Sofisticação e bom gosto.'
  };
  return analyses[position as keyof typeof analyses] || 'Posicionamento definido.';
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
    'triplicar': 'Meta: Triplicar faturamento - Crescimento exponencial, transformação completa.',
    'manter_estavel': 'Meta: Manter estabilidade - Foco em eficiência operacional.'
  };
  
  return `${currentAnalysis[current as keyof typeof currentAnalysis] || 'Análise de faturamento'}\n${goalAnalysis[goal as keyof typeof goalAnalysis] || 'Meta definida'}`;
};

const getMarketingAnalysis = (state: MarketingConsultantState): string => {
  let analysis = 'Status atual do marketing:\n';
  
  const contentFreq = {
    'diario': '✅ Conteúdo diário - Excelente engajamento.',
    'semanal': '✅ Boa frequência - Manter consistência.',
    'quinzenal': '⚠️ Frequência baixa - Aumentar produção.',
    'mensal': '⚠️ Frequência muito baixa - Necessita estruturação.',
    'raramente': '❌ Inconsistente - Criar cronograma estruturado.',
    'nao_posto': '❌ Ausência total - Urgente implementar estratégia.'
  };
  
  const communicationStyle = {
    'emocional': '💖 Comunicação emocional - Foco na conexão.',
    'tecnico': '🔬 Comunicação técnica - Credibilidade científica.',
    'didatico': '📚 Comunicação didática - Educação do público.',
    'divertido': '😄 Comunicação divertida - Alto engajamento.',
    'elegante': '💎 Comunicação elegante - Sofisticação.',
    'direto': '🎯 Comunicação direta - Objetividade.'
  };
  
  analysis += contentFreq[state.contentFrequency as keyof typeof contentFreq] || 'Frequência não definida.';
  analysis += '\n' + (communicationStyle[state.communicationStyle as keyof typeof communicationStyle] || 'Estilo não definido.');
  
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
• Depoimentos de clientes satisfeitos
• Trends e novidades do mercado estético
• Comunicação humanizada e próxima`;
  }
};

const getWeek1Action = (state: MarketingConsultantState): string => {
  if (state.contentFrequency === 'nao_posto' || state.contentFrequency === 'raramente') {
    return 'Estruturar cronograma de conteúdo e definir linha editorial';
  }
  if (state.clinicType === 'clinica_medica' && state.medicalObjective === 'aumentar_autoridade') {
    return 'Criar conteúdo de autoridade médica';
  }
  return 'Otimizar conteúdo atual e definir objetivos claros';
};

const getWeek2Action = (state: MarketingConsultantState): string => {
  if (state.clinicType === 'clinica_medica') {
    return 'Criar conteúdo de autoridade médica e cases';
  }
  if (state.aestheticObjective === 'atrair_leads') {
    return 'Implementar campanhas de captação focadas';
  }
  return 'Implementar campanhas de captação e engajamento';
};

const getWeek3Action = (state: MarketingConsultantState): string => {
  return 'Análise de resultados, ajustes e planejamento do próximo mês';
};

const getNextSteps = (state: MarketingConsultantState): string => {
  const steps = [];
  
  if (state.contentFrequency === 'nao_posto' || state.contentFrequency === 'raramente') {
    steps.push('1. Criar cronograma de conteúdo com no mínimo 3 posts por semana');
  }
  
  if (state.clinicType === 'clinica_medica' && state.medicalObjective === 'aumentar_autoridade') {
    steps.push('2. Desenvolver conteúdo técnico acessível para construir autoridade');
  } else if (state.clinicType === 'clinica_estetica' && state.aestheticObjective === 'atrair_leads') {
    steps.push('2. Estruturar funil de captação com foco em transformações');
  }
  
  steps.push('3. Implementar sistema de acompanhamento de métricas e ROI');
  steps.push('4. Criar programa de indicação para clientes satisfeitos');
  
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
  if (state.contentFrequency === 'nao_posto' || state.contentFrequency === 'raramente') {
    return enigmas[3]; // Sobre aparecer
  }
  if (state.contentFrequency === 'raramente') {
    return enigmas[1]; // Sobre consistência
  }
  
  return enigmas[Math.floor(Math.random() * enigmas.length)];
};
