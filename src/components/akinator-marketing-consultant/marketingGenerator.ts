import { MarketingConsultantState } from './types';
import { MarketingMentorInference } from './mentorInference';
import { generateAIDiagnostic } from '@/utils/aiDiagnosticUtils';

export const generateMarketingDiagnostic = async (
  state: MarketingConsultantState, 
  useAI: boolean = true
): Promise<string> => {
  console.log('🎯 generateMarketingDiagnostic chamado com useAI:', useAI);
  console.log('📊 Estado recebido:', state);

  // Se usar IA estiver habilitado, tentar gerar via OpenAI primeiro
  if (useAI) {
    try {
      console.log('🤖 Tentando gerar diagnóstico via IA...');
      const aiDiagnostic = await generateAIDiagnostic(state);
      
      if (aiDiagnostic) {
        console.log('✅ Diagnóstico IA gerado com sucesso! Tamanho:', aiDiagnostic.length);
        return aiDiagnostic;
      } else {
        console.log('⚠️ IA retornou null, usando fallback');
      }
    } catch (error) {
      console.error('💥 Erro na geração via IA, usando fallback:', error);
    }
  }

  console.log('🔄 Usando sistema de fallback (diagnóstico estático)');
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
    return state.medicalObjective === 'autoridade' ? 'construção de autoridade médica' : 
           state.medicalObjective === 'escala' ? 'escalabilidade e estruturação' : 'crescimento sustentável';
  } else {
    return state.aestheticObjective === 'mais_leads' ? 'geração de leads' :
           state.aestheticObjective === 'autoridade' ? 'posicionamento de autoridade' : 'otimização de resultados';
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
  if (state.personalBrand === 'sim_sempre') return 'Marca pessoal consolidada';
  if (state.clinicPosition === 'premium') return 'Posicionamento premium estabelecido';
  if (state.clinicPosition === 'humanizada') return 'Relacionamento humanizado';
  return 'Oportunidade de diferenciação técnica';
};

const getTopPriority = (state: MarketingConsultantState): string => {
  if (state.contentFrequency === 'irregular') return 'Consistência na comunicação';
  if (state.paidTraffic === 'nunca_usei') return 'Estruturação de tráfego pago';
  if (state.personalBrand === 'nunca') return 'Construção de marca pessoal';
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
  return `${state.clinicPosition || 'Em definição'} - ${state.clinicType === 'clinica_medica' ? 'Credibilidade técnica' : 'Foco em resultados'}`;
};

const getOpportunityGaps = (state: MarketingConsultantState): string => {
  const gaps = [];
  if (state.personalBrand === 'nunca') gaps.push('marca pessoal');
  if (state.contentFrequency === 'irregular') gaps.push('consistência');
  if (state.paidTraffic === 'nunca_usei') gaps.push('tráfego pago');
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
  return state.paidTraffic === 'sim_regular' ? 
    'ROI das campanhas, segmentação avançada' :
    'Funil de conversão, landing pages';
};

const getKPIs = (state: MarketingConsultantState): string => {
  return 'CAC, LTV, taxa de conversão, engajamento, NPS';
};

const getCommunicationConcept = (state: MarketingConsultantState): string => {
  if (state.clinicPosition === 'premium') return 'Excelência e exclusividade';
  if (state.clinicPosition === 'humanizada') return 'Cuidado e acolhimento';
  if (state.clinicPosition === 'moderna') return 'Inovação e tecnologia';
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
• Depoimentos de clientes satisfeitos
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
