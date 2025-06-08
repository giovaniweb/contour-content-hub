
import { MarketingStep } from './types';

export const MARKETING_STEPS: MarketingStep[] = [
  {
    id: 'clinicType',
    question: 'Qual é o tipo da sua clínica?',
    options: [
      { value: 'clinica_medica', label: '🧪 Clínica Médica (com médico responsável)' },
      { value: 'clinica_estetica', label: '💆‍♀️ Clínica Estética (sem procedimentos médicos)' }
    ]
  },
  // Perguntas para CLÍNICA MÉDICA
  {
    id: 'medicalSpecialty',
    question: 'Qual é a sua especialidade médica principal?',
    options: [
      { value: 'dermatologia', label: '🔬 Dermatologia' },
      { value: 'nutrologia', label: '🥗 Nutrologia' },
      { value: 'ginecoestetica', label: '🌸 Ginecoestética' },
      { value: 'cirurgia_plastica', label: '✂️ Cirurgia Plástica' },
      { value: 'medicina_estetica', label: '💉 Medicina Estética' },
      { value: 'outras', label: '🎯 Outras Especialidades' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalProcedures',
    question: 'Quais procedimentos médicos você mais realiza?',
    options: [
      { value: 'injetaveis', label: '💉 Injetáveis (Botox, Preenchimentos, Bioestimuladores)' },
      { value: 'lasers_co2', label: '⚡ Lasers CO2 e Equipamentos Médicos' },
      { value: 'cirurgicos', label: '✂️ Procedimentos Cirúrgicos' },
      { value: 'consultas_protocolos', label: '🩺 Consultas e Protocolos Clínicos' },
      { value: 'tratamentos_invasivos', label: '🧴 Tratamentos Invasivos e Medicamentosos' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalEquipments',
    question: 'Você usa equipamentos médicos? Se sim, quais?',
    options: [],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalBestSeller',
    question: 'Qual é o protocolo médico mais vendido/procurado?',
    options: [],
    isOpen: true,
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalTicket',
    question: 'Qual é o ticket médio dos seus procedimentos médicos?',
    options: [
      { value: 'ate_500', label: '💰 Até R$ 500' },
      { value: '500_1500', label: '💰 R$ 500 - R$ 1.500' },
      { value: '1500_3000', label: '💰 R$ 1.500 - R$ 3.000' },
      { value: '3000_5000', label: '💰 R$ 3.000 - R$ 5.000' },
      { value: 'acima_5000', label: '💰 Acima de R$ 5.000' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalSalesModel',
    question: 'Como você vende seus tratamentos médicos?',
    options: [
      { value: 'sessoes_avulsas', label: '📋 Sessões Avulsas por Procedimento' },
      { value: 'pacotes_tratamento', label: '📦 Pacotes de Tratamento Completo' },
      { value: 'planos_acompanhamento', label: '📅 Planos de Acompanhamento' },
      { value: 'consulta_procedimento', label: '🔄 Consulta + Procedimento' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalObjective',
    question: 'Qual é o seu principal objetivo como médico?',
    options: [
      { value: 'autoridade_medica', label: '👨‍⚕️ Aumentar autoridade médica na região' },
      { value: 'escalar_consultorio', label: '📈 Escalar meu consultório/clínica' },
      { value: 'fidelizar_pacientes', label: '🔄 Melhorar retenção e fidelização' },
      { value: 'diferenciar_mercado', label: '🎯 Me diferenciar de outros médicos' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalContentFrequency',
    question: 'Com que frequência você aparece em conteúdos educativos?',
    options: [
      { value: 'sempre_aparece', label: '📹 Sempre apareço explicando procedimentos' },
      { value: 'as_vezes', label: '🎬 Às vezes apareço em vídeos' },
      { value: 'raramente', label: '😅 Raramente apareço' },
      { value: 'nunca_aparece', label: '🙈 Prefiro não aparecer em vídeos' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalClinicStyle',
    question: 'Como você definiria o estilo da sua clínica médica?',
    options: [
      { value: 'premium_sofisticada', label: '👑 Premium e Sofisticada' },
      { value: 'tecnica_cientifica', label: '🔬 Técnica e Científica' },
      { value: 'humanizada_acolhedora', label: '❤️ Humanizada e Acolhedora' },
      { value: 'inovadora_moderna', label: '🚀 Inovadora e Tecnológica' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  
  // Perguntas para CLÍNICA ESTÉTICA
  {
    id: 'aestheticFocus',
    question: 'Sua clínica estética atua com facial, corporal ou ambos?',
    options: [
      { value: 'facial', label: '😊 Principalmente Estética Facial' },
      { value: 'corporal', label: '🏃‍♀️ Principalmente Estética Corporal' },
      { value: 'ambos', label: '✨ Facial e Corporal (Completa)' },
      { value: 'depilacao', label: '🪒 Foco em Depilação' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticEquipments',
    question: 'Quais equipamentos estéticos você usa?',
    options: [],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticBestSeller',
    question: 'Qual é o protocolo estético mais vendido?',
    options: [],
    isOpen: true,
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticTicket',
    question: 'Qual é o ticket médio dos seus tratamentos?',
    options: [
      { value: 'ate_150', label: '💰 Até R$ 150' },
      { value: '150_300', label: '💰 R$ 150 - R$ 300' },
      { value: '300_600', label: '💰 R$ 300 - R$ 600' },
      { value: '600_1000', label: '💰 R$ 600 - R$ 1.000' },
      { value: 'acima_1000', label: '💰 Acima de R$ 1.000' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticSalesModel',
    question: 'Como você vende seus tratamentos estéticos?',
    options: [
      { value: 'sessoes_avulsas', label: '📋 Sessões Avulsas' },
      { value: 'pacotes_promocionais', label: '📦 Pacotes Promocionais' },
      { value: 'planos_mensais', label: '📅 Planos Mensais de Beleza' },
      { value: 'combos_tratamentos', label: '🔄 Combos de Tratamentos' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticObjective',
    question: 'Qual é o principal objetivo da sua clínica estética?',
    options: [
      { value: 'atrair_leads', label: '🎯 Atrair mais leads qualificados' },
      { value: 'aumentar_recorrencia', label: '🔄 Aumentar recorrência de clientes' },
      { value: 'elevar_ticket', label: '💰 Aumentar ticket médio dos tratamentos' },
      { value: 'autoridade_regiao', label: '👑 Ser referência na região' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticContentFrequency',
    question: 'Com que frequência você ou sua equipe aparecem em conteúdos?',
    options: [
      { value: 'sempre_aparece', label: '📹 Sempre aparecemos mostrando resultados' },
      { value: 'as_vezes', label: '🎬 Às vezes aparecemos em vídeos' },
      { value: 'raramente', label: '😅 Raramente aparecemos' },
      { value: 'nunca_aparece', label: '🙈 Preferimos não aparecer' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticClinicStyle',
    question: 'Como você definiria o estilo da sua clínica estética?',
    options: [
      { value: 'premium_luxuosa', label: '👑 Premium e Luxuosa' },
      { value: 'moderna_tecnologica', label: '🌟 Moderna e Tecnológica' },
      { value: 'humanizada_acolhedora', label: '❤️ Humanizada e Acolhedora' },
      { value: 'acessivel_popular', label: '🤝 Acessível e Popular' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  
  // Perguntas COMUNS (Briefing)
  {
    id: 'currentRevenue',
    question: 'Qual é o faturamento atual mensal da sua clínica?',
    options: [
      { value: 'ate_15k', label: '💰 Até R$ 15.000' },
      { value: '15k_30k', label: '💰 R$ 15.000 - R$ 30.000' },
      { value: '30k_60k', label: '💰 R$ 30.000 - R$ 60.000' },
      { value: 'acima_60k', label: '💰 Acima de R$ 60.000' }
    ]
  },
  {
    id: 'revenueGoal',
    question: 'Qual é a sua meta de crescimento de faturamento?',
    options: [
      { value: 'crescer_30', label: '📈 Crescer 30% nos próximos 6 meses' },
      { value: 'crescer_50', label: '📈 Crescer 50% nos próximos 6 meses' },
      { value: 'dobrar', label: '🚀 Dobrar o faturamento em 1 ano' },
      { value: 'triplicar', label: '🚀 Triplicar o faturamento em 1 ano' },
      { value: 'manter_estavel', label: '📊 Manter estabilidade e qualidade' }
    ]
  },
  {
    id: 'targetAudience',
    question: 'Descreva o seu público-alvo ideal (idade, perfil, necessidades)',
    options: [],
    isOpen: true
  },
  {
    id: 'communicationStyle',
    question: 'Qual estilo de comunicação combina mais com você?',
    options: [
      { value: 'emocional_inspirador', label: '❤️ Emocional e Inspirador' },
      { value: 'tecnico_didatico', label: '📚 Técnico e Didático' },
      { value: 'humanizado_proximo', label: '🤗 Humanizado e Próximo' },
      { value: 'direto_objetivo', label: '🎯 Direto e Objetivo' }
    ]
  },
  {
    id: 'contentFrequency',
    question: 'Com que frequência você posta conteúdo nas redes sociais?',
    options: [
      { value: 'diario', label: '📱 Diariamente (stories e feed)' },
      { value: 'semanal', label: '📅 Semanalmente (3-5 posts)' },
      { value: 'quinzenal', label: '📆 Quinzenalmente' },
      { value: 'mensal', label: '🗓️ Mensalmente' },
      { value: 'raramente', label: '😅 Raramente posto' },
      { value: 'nao_posto', label: '🚫 Não posto conteúdo' }
    ]
  },
  {
    id: 'mainChallenges',
    question: 'Quais são os principais desafios que você enfrenta?',
    options: [
      { value: 'gerar_leads', label: '🎯 Gerar leads qualificados' },
      { value: 'converter_vendas', label: '💰 Converter leads em vendas' },
      { value: 'fidelizar_clientes', label: '🔄 Fidelizar e reter clientes' },
      { value: 'competir_preco', label: '💸 Competir sem baixar preço' },
      { value: 'criar_conteudo', label: '📱 Criar conteúdo relevante' },
      { value: 'gestao_tempo', label: '⏰ Gestão de tempo e equipe' }
    ]
  }
];

export const PHASES = [
  {
    id: 'introduction',
    title: 'Classificação',
    description: 'Identificando tipo de clínica',
    icon: '🎯'
  },
  {
    id: 'clinic_profile',
    title: 'Perfil Clínico',
    description: 'Especialização e procedimentos',
    icon: '🏥'
  },
  {
    id: 'business_model',
    title: 'Modelo de Negócio',
    description: 'Vendas e faturamento',
    icon: '💼'
  },
  {
    id: 'communication',
    title: 'Comunicação',
    description: 'Estilo e frequência',
    icon: '📢'
  },
  {
    id: 'analysis',
    title: 'Análise Fluida',
    description: 'Gerando diagnóstico inteligente',
    icon: '🧠'
  }
];
