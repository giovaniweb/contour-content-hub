import { MarketingStep } from './types';

export const MARKETING_STEPS: MarketingStep[] = [
  {
    id: 'clinicType',
    question: 'Que tipo de clínica você possui?',
    options: [
      { value: 'clinica_medica', label: '🏥 Clínica Médica' },
      { value: 'clinica_estetica', label: '✨ Clínica Estética' }
    ]
  },
  {
    id: 'medicalSpecialty',
    question: 'Qual é a sua especialidade médica?',
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
    question: 'Qual tipo de procedimento você mais realiza?',
    options: [
      { value: 'injetaveis', label: '💉 Injetáveis (Botox, Preenchimentos)' },
      { value: 'lasers', label: '⚡ Lasers e Tecnologias' },
      { value: 'cirurgicos', label: '✂️ Procedimentos Cirúrgicos' },
      { value: 'consultas', label: '🩺 Consultas e Acompanhamentos' },
      { value: 'tratamentos_clinicos', label: '🧴 Tratamentos Clínicos' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalEquipments',
    question: 'Qual equipamento médico você mais utiliza na sua prática?',
    options: [],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalProblems',
    question: 'Qual é o principal problema/protocolo que seus pacientes mais procuram resolver?',
    options: [],
    isOpen: true,
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalTicket',
    question: 'Qual é o ticket médio dos seus procedimentos médicos?',
    options: [
      { value: 'ate_500', label: '💰 Até R$ 500' },
      { value: '500_1000', label: '💰 R$ 500 - R$ 1.000' },
      { value: '1000_2000', label: '💰 R$ 1.000 - R$ 2.000' },
      { value: '2000_5000', label: '💰 R$ 2.000 - R$ 5.000' },
      { value: 'acima_5000', label: '💰 Acima de R$ 5.000' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalSalesModel',
    question: 'Como você vende seus tratamentos médicos?',
    options: [
      { value: 'sessoes_avulsas', label: '📋 Sessões Avulsas' },
      { value: 'pacotes', label: '📦 Pacotes de Sessões' },
      { value: 'planos', label: '📅 Planos Mensais/Anuais' },
      { value: 'misto', label: '🔄 Modelo Misto' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalObjective',
    question: 'Qual é o seu principal objetivo como médico?',
    options: [
      { value: 'diferenciacao', label: '🎯 Me diferenciar de outros médicos' },
      { value: 'escala', label: '📈 Escalar meu negócio médico' },
      { value: 'retencao', label: '🔄 Melhorar retenção de pacientes' },
      { value: 'aumentar_autoridade', label: '👨‍⚕️ Aumentar autoridade médica' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalVideoFrequency',
    question: 'Com que frequência você aparece em vídeos/conteúdos?',
    options: [
      { value: 'sempre_aparece', label: '📹 Sempre apareço nos conteúdos' },
      { value: 'as_vezes', label: '🎬 Às vezes apareço' },
      { value: 'raramente', label: '😅 Raramente apareço' },
      { value: 'nunca_aparece', label: '🙈 Nunca apareço em vídeos' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  {
    id: 'medicalClinicStyle',
    question: 'Como você definiria o estilo da sua clínica médica?',
    options: [
      { value: 'premium', label: '👑 Premium e Sofisticada' },
      { value: 'tecnica', label: '🔬 Técnica e Científica' },
      { value: 'humanizada', label: '❤️ Humanizada e Acolhedora' },
      { value: 'inovadora', label: '🚀 Inovadora e Moderna' }
    ],
    condition: (state) => state.clinicType === 'clinica_medica'
  },
  // Aesthetic clinic questions
  {
    id: 'aestheticFocus',
    question: 'Qual é o foco principal da sua clínica estética?',
    options: [
      { value: 'corporal', label: '🏃‍♀️ Estética Corporal' },
      { value: 'facial', label: '😊 Estética Facial' },
      { value: 'ambos', label: '✨ Facial e Corporal' },
      { value: 'depilacao', label: '🪒 Depilação' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticEquipments',
    question: 'Qual equipamento estético você mais utiliza?',
    options: [],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticProblems',
    question: 'Qual é o principal problema/protocolo que seus clientes mais procuram resolver?',
    options: [],
    isOpen: true,
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticSalesModel',
    question: 'Como você vende seus tratamentos estéticos?',
    options: [
      { value: 'sessoes_avulsas', label: '📋 Sessões Avulsas' },
      { value: 'pacotes', label: '📦 Pacotes de Sessões' },
      { value: 'planos', label: '📅 Planos Mensais' },
      { value: 'misto', label: '🔄 Modelo Misto' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticTicket',
    question: 'Qual é o ticket médio dos seus tratamentos estéticos?',
    options: [
      { value: 'ate_200', label: '💰 Até R$ 200' },
      { value: '200_500', label: '💰 R$ 200 - R$ 500' },
      { value: '500_1000', label: '💰 R$ 500 - R$ 1.000' },
      { value: '1000_2000', label: '💰 R$ 1.000 - R$ 2.000' },
      { value: 'acima_2000', label: '💰 Acima de R$ 2.000' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticObjective',
    question: 'Qual é o seu principal objetivo com a clínica?',
    options: [
      { value: 'atrair_leads', label: '🎯 Atrair mais leads qualificados' },
      { value: 'aumentar_recorrencia', label: '🔄 Aumentar recorrência de clientes' },
      { value: 'elevar_ticket', label: '💰 Aumentar ticket médio' },
      { value: 'construir_autoridade', label: '👑 Construir autoridade na região' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticVideoFrequency',
    question: 'Com que frequência você ou sua equipe aparecem em conteúdos?',
    options: [
      { value: 'sempre_aparece', label: '📹 Sempre aparecemos' },
      { value: 'as_vezes', label: '🎬 Às vezes aparecemos' },
      { value: 'raramente', label: '😅 Raramente aparecemos' },
      { value: 'nunca_aparece', label: '🙈 Nunca aparecemos em vídeos' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  {
    id: 'aestheticClinicStyle',
    question: 'Como você definiria o estilo da sua clínica estética?',
    options: [
      { value: 'premium', label: '👑 Premium e Luxuosa' },
      { value: 'moderna', label: '🌟 Moderna e Tecnológica' },
      { value: 'humanizada', label: '❤️ Humanizada e Acolhedora' },
      { value: 'acessivel', label: '🤝 Acessível e Popular' }
    ],
    condition: (state) => state.clinicType === 'clinica_estetica'
  },
  // General questions for both types
  {
    id: 'currentRevenue',
    question: 'Qual é o faturamento atual da sua clínica?',
    options: [
      { value: 'ate_15k', label: '💰 Até R$ 15.000' },
      { value: '15k_30k', label: '💰 R$ 15.000 - R$ 30.000' },
      { value: '30k_60k', label: '💰 R$ 30.000 - R$ 60.000' },
      { value: 'acima_60k', label: '💰 Acima de R$ 60.000' }
    ]
  },
  {
    id: 'revenueGoal',
    question: 'Qual é a sua meta de faturamento?',
    options: [
      { value: 'crescer_30', label: '📈 Crescer 30%' },
      { value: 'crescer_50', label: '📈 Crescer 50%' },
      { value: 'dobrar', label: '🚀 Dobrar o faturamento' },
      { value: 'triplicar', label: '🚀 Triplicar o faturamento' },
      { value: 'manter_estavel', label: '📊 Manter estabilidade' }
    ]
  },
  {
    id: 'targetAudience',
    question: 'Descreva o seu público-alvo ideal',
    options: [],
    isOpen: true
  },
  {
    id: 'contentFrequency',
    question: 'Com que frequência você posta conteúdo nas redes sociais?',
    options: [
      { value: 'diario', label: '📱 Diariamente' },
      { value: 'semanal', label: '📅 Semanalmente' },
      { value: 'quinzenal', label: '📆 Quinzenalmente' },
      { value: 'mensal', label: '🗓️ Mensalmente' },
      { value: 'raramente', label: '😅 Raramente' },
      { value: 'nao_posto', label: '🚫 Não posto conteúdo' }
    ]
  },
  {
    id: 'communicationStyle',
    question: 'Qual estilo de comunicação combina mais com você?',
    options: [
      { value: 'profissional', label: '👔 Profissional e Técnico' },
      { value: 'descontraido', label: '😄 Descontraído e Divertido' },
      { value: 'emocional', label: '❤️ Emocional e Inspirador' },
      { value: 'educativo', label: '📚 Educativo e Informativo' }
    ]
  }
];

export const PHASES = [
  {
    id: 'introduction',
    title: 'Introdução',
    description: 'Entendendo seu perfil',
    icon: '👋'
  },
  {
    id: 'clinic_profile',
    title: 'Perfil da Clínica',
    description: 'Especialização e serviços',
    icon: '🏥'
  },
  {
    id: 'business_model',
    title: 'Modelo de Negócio',
    description: 'Estratégia financeira',
    icon: '💼'
  },
  {
    id: 'marketing_strategy',
    title: 'Estratégia de Marketing',
    description: 'Comunicação e posicionamento',
    icon: '📢'
  },
  {
    id: 'analysis',
    title: 'Análise Inteligente',
    description: 'Processando diagnóstico',
    icon: '🧠'
  }
];
