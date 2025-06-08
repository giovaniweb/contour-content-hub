
import { MarketingStep } from './types';

export const MARKETING_STEPS: MarketingStep[] = [
  // Etapa 1 - Identificar tipo de clínica
  {
    id: 'clinicType',
    question: 'Qual é o seu tipo de clínica?',
    options: [
      { value: 'clinica_medica', label: '🏥 Clínica Médica (com médico responsável)' },
      { value: 'clinica_estetica', label: '💆‍♀️ Clínica Estética (sem procedimentos médicos)' }
    ]
  },

  // === PERGUNTAS PARA CLÍNICA MÉDICA ===
  {
    id: 'medicalSpecialty',
    question: 'Qual sua especialidade principal?',
    condition: 'clinica_medica',
    options: [
      { value: 'dermatologia', label: '🧴 Dermatologia' },
      { value: 'ginecologia_estetica', label: '👩‍⚕️ Ginecologia Estética' },
      { value: 'nutrologia', label: '🥗 Nutrologia' },
      { value: 'cirurgia_plastica', label: '🏥 Cirurgia Plástica' },
      { value: 'medicina_estetica', label: '💉 Medicina Estética' },
      { value: 'ortopedia', label: '🦴 Ortopedia' },
      { value: 'outras', label: '🩺 Outras Especialidades' }
    ]
  },
  {
    id: 'medicalProcedures',
    question: 'Quais procedimentos você realiza?',
    condition: 'clinica_medica',
    options: [
      { value: 'injetaveis', label: '💉 Injetáveis (Botox, Preenchimento)' },
      { value: 'peelings', label: '🧴 Peelings Químicos' },
      { value: 'laser_medico', label: '🔬 Laser Médico' },
      { value: 'cirurgias_menores', label: '🔪 Cirurgias Menores' },
      { value: 'harmonizacao_facial', label: '💎 Harmonização Facial' },
      { value: 'tratamentos_corporais', label: '💪 Tratamentos Corporais' },
      { value: 'outros', label: '🩺 Outros Procedimentos' }
    ]
  },
  {
    id: 'medicalEquipments',
    question: 'Você utiliza algum equipamento? Se sim, quais?',
    condition: 'clinica_medica',
    isOpen: true,
    options: []
  },
  {
    id: 'medicalProblems',
    question: 'Quais problemas esses equipamentos ajudam a tratar?',
    condition: 'clinica_medica',
    isOpen: true,
    options: []
  },
  {
    id: 'medicalMostSought',
    question: 'Qual o protocolo mais procurado?',
    condition: 'clinica_medica',
    isOpen: true,
    options: []
  },
  {
    id: 'medicalTicket',
    question: 'Qual seu ticket médio atual?',
    condition: 'clinica_medica',
    options: [
      { value: 'ate_500', label: '💰 Até R$ 500' },
      { value: '500_1000', label: '💸 R$ 500 - R$ 1.000' },
      { value: '1000_2000', label: '💵 R$ 1.000 - R$ 2.000' },
      { value: 'acima_2000', label: '💎 Acima de R$ 2.000' }
    ]
  },
  {
    id: 'medicalSalesModel',
    question: 'Você trabalha com planos, sessões ou pacotes?',
    condition: 'clinica_medica',
    options: [
      { value: 'sessoes_avulsas', label: '🎯 Sessões Avulsas' },
      { value: 'pacotes', label: '📦 Pacotes de Sessões' },
      { value: 'planos_mensais', label: '📅 Planos Mensais' },
      { value: 'consultas_procedimentos', label: '🩺 Consultas + Procedimentos' },
      { value: 'misto', label: '🔄 Modelo Misto' }
    ]
  },
  {
    id: 'medicalObjective',
    question: 'Qual seu objetivo principal?',
    condition: 'clinica_medica',
    options: [
      { value: 'aumentar_autoridade', label: '⭐ Aumentar Autoridade' },
      { value: 'gerar_leads', label: '👥 Gerar Leads' },
      { value: 'escalar_negocio', label: '📈 Escalar Negócio' },
      { value: 'fidelizar_pacientes', label: '❤️ Fidelizar Pacientes' },
      { value: 'aumentar_ticket', label: '💰 Aumentar Ticket Médio' }
    ]
  },
  {
    id: 'medicalVideoFrequency',
    question: 'Você aparece nos vídeos? Com que frequência?',
    condition: 'clinica_medica',
    options: [
      { value: 'sempre_aparece', label: '📹 Sempre apareço' },
      { value: 'as_vezes_aparece', label: '🎬 Às vezes apareço' },
      { value: 'raramente_aparece', label: '📷 Raramente apareço' },
      { value: 'nunca_aparece', label: '❌ Nunca apareço' },
      { value: 'nao_gravo', label: '🚫 Não gravo vídeos' }
    ]
  },
  {
    id: 'medicalClinicStyle',
    question: 'Como definiria o estilo da sua clínica?',
    condition: 'clinica_medica',
    options: [
      { value: 'premium', label: '💎 Premium' },
      { value: 'tecnica', label: '🔬 Técnica' },
      { value: 'humanizada', label: '❤️ Humanizada' },
      { value: 'acessivel', label: '💰 Acessível' },
      { value: 'inovadora', label: '🚀 Inovadora' }
    ]
  },

  // === PERGUNTAS PARA CLÍNICA ESTÉTICA ===
  {
    id: 'aestheticFocus',
    question: 'Você atua com facial, corporal ou ambos?',
    condition: 'clinica_estetica',
    options: [
      { value: 'facial', label: '😊 Facial' },
      { value: 'corporal', label: '💪 Corporal' },
      { value: 'ambos', label: '🌟 Ambos' },
      { value: 'capilar', label: '💇‍♀️ Capilar' },
      { value: 'depilacao', label: '🪒 Depilação' }
    ]
  },
  {
    id: 'aestheticEquipments',
    question: 'Quais equipamentos estéticos você usa?',
    condition: 'clinica_estetica',
    isOpen: true,
    options: []
  },
  {
    id: 'aestheticProblems',
    question: 'O que esses equipamentos prometem resolver?',
    condition: 'clinica_estetica',
    isOpen: true,
    options: []
  },
  {
    id: 'aestheticBestSeller',
    question: 'Qual seu protocolo mais vendido?',
    condition: 'clinica_estetica',
    isOpen: true,
    options: []
  },
  {
    id: 'aestheticSalesModel',
    question: 'Você vende pacotes, sessões ou planos?',
    condition: 'clinica_estetica',
    options: [
      { value: 'sessoes_avulsas', label: '🎯 Sessões Avulsas' },
      { value: 'pacotes', label: '📦 Pacotes de Sessões' },
      { value: 'planos_mensais', label: '📅 Planos Mensais' },
      { value: 'promocoes', label: '🎉 Promoções Sazonais' },
      { value: 'misto', label: '🔄 Modelo Misto' }
    ]
  },
  {
    id: 'aestheticTicket',
    question: 'Qual o seu ticket médio?',
    condition: 'clinica_estetica',
    options: [
      { value: 'ate_200', label: '💰 Até R$ 200' },
      { value: '200_500', label: '💸 R$ 200 - R$ 500' },
      { value: '500_1000', label: '💵 R$ 500 - R$ 1.000' },
      { value: 'acima_1000', label: '💎 Acima de R$ 1.000' }
    ]
  },
  {
    id: 'aestheticObjective',
    question: 'Seu objetivo principal é atrair leads, vender mais ou aumentar recorrência?',
    condition: 'clinica_estetica',
    options: [
      { value: 'atrair_leads', label: '👥 Atrair Leads' },
      { value: 'vender_mais', label: '💰 Vender Mais' },
      { value: 'aumentar_recorrencia', label: '🔄 Aumentar Recorrência' },
      { value: 'fidelizar_clientes', label: '❤️ Fidelizar Clientes' },
      { value: 'aumentar_ticket', label: '📈 Aumentar Ticket Médio' }
    ]
  },
  {
    id: 'aestheticVideoFrequency',
    question: 'Você grava vídeos? Aparece nos conteúdos?',
    condition: 'clinica_estetica',
    options: [
      { value: 'sempre_aparece', label: '📹 Sempre apareço' },
      { value: 'as_vezes_aparece', label: '🎬 Às vezes apareço' },
      { value: 'raramente_aparece', label: '📷 Raramente apareço' },
      { value: 'nunca_aparece', label: '❌ Nunca apareço' },
      { value: 'nao_gravo', label: '🚫 Não gravo vídeos' }
    ]
  },
  {
    id: 'aestheticClinicStyle',
    question: 'Como definiria sua clínica?',
    condition: 'clinica_estetica',
    options: [
      { value: 'acessivel', label: '💰 Acessível' },
      { value: 'humanizada', label: '❤️ Humanizada' },
      { value: 'popular', label: '👥 Popular' },
      { value: 'premium', label: '💎 Premium' },
      { value: 'moderna', label: '🚀 Moderna' }
    ]
  },

  // === BRIEFING COMUM PARA AMBOS ===
  {
    id: 'currentRevenue',
    question: 'Qual seu faturamento atual?',
    options: [
      { value: 'ate_15k', label: '💰 Até R$ 15.000' },
      { value: '15k_30k', label: '💸 R$ 15.000 - R$ 30.000' },
      { value: '30k_60k', label: '💵 R$ 30.000 - R$ 60.000' },
      { value: 'acima_60k', label: '💎 Acima de R$ 60.000' }
    ]
  },
  {
    id: 'revenueGoal',
    question: 'Qual sua meta de faturamento em 3 meses?',
    options: [
      { value: 'crescer_30', label: '📈 Crescer 30%' },
      { value: 'crescer_50', label: '🚀 Crescer 50%' },
      { value: 'dobrar', label: '⚡ Dobrar o faturamento' },
      { value: 'triplicar', label: '🔥 Triplicar o faturamento' },
      { value: 'manter_estavel', label: '📊 Manter estabilidade' }
    ]
  },
  {
    id: 'targetAudience',
    question: 'Quem é seu público ideal?',
    options: [
      { value: 'mulheres_25_40', label: '👩 Mulheres 25-40 anos' },
      { value: 'mulheres_40_plus', label: '👩‍🦳 Mulheres 40+ anos' },
      { value: 'homens_adultos', label: '👨 Homens adultos' },
      { value: 'jovens', label: '👧 Jovens 18-25 anos' },
      { value: 'publico_geral', label: '👥 Público geral' },
      { value: 'classe_ab', label: '💎 Classe A/B' },
      { value: 'classe_c', label: '💰 Classe C' }
    ]
  },
  {
    id: 'contentFrequency',
    question: 'Com que frequência você posta conteúdo?',
    options: [
      { value: 'diario', label: '📅 Diariamente' },
      { value: 'semanal', label: '📊 Semanalmente' },
      { value: 'quinzenal', label: '🗓️ Quinzenalmente' },
      { value: 'mensal', label: '📆 Mensalmente' },
      { value: 'raramente', label: '❌ Raramente' },
      { value: 'nao_posto', label: '🚫 Não posto' }
    ]
  },
  {
    id: 'communicationStyle',
    question: 'Qual seu estilo de comunicação preferido?',
    options: [
      { value: 'emocional', label: '❤️ Emocional' },
      { value: 'tecnico', label: '🔬 Técnico' },
      { value: 'didatico', label: '📚 Didático' },
      { value: 'divertido', label: '😄 Divertido' },
      { value: 'elegante', label: '💎 Elegante' },
      { value: 'direto', label: '🎯 Direto' }
    ]
  }
];
