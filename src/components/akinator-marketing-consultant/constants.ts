
import { MarketingStep } from './types';

export const MARKETING_STEPS: MarketingStep[] = [
  // 🧭 Etapa 1 – Identificar o tipo de clínica
  {
    id: 'clinicType',
    question: 'Qual é o seu tipo de clínica?',
    options: [
      { value: 'clinica_medica', label: '🏥 Clínica Médica (com médico responsável)' },
      { value: 'clinica_estetica', label: '💆‍♀️ Clínica Estética (sem procedimentos médicos)' }
    ]
  },

  // === 🏥 ROTEIRO PARA CLÍNICA MÉDICA ===
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
      { value: 'tratamentos_corporais', label: '💪 Tratamentos Corporais' }
    ]
  },
  {
    id: 'medicalEquipments',
    question: 'Você utiliza algum equipamento? Se sim, quais?',
    condition: 'clinica_medica',
    options: [
      { value: 'ultrassom_microfocado', label: '🔬 Ultrassom Microfocado' },
      { value: 'co2_fracionado', label: '⚡ CO2 Fracionado' },
      { value: 'intradermoterapia', label: '💉 Intradermoterapia' },
      { value: 'laser_co2', label: '🔥 Laser CO2' },
      { value: 'radiofrequencia_medica', label: '📡 Radiofrequência Médica' },
      { value: 'microagulhamento_medico', label: '🔬 Microagulhamento Médico' },
      { value: 'outros', label: '🩺 Outros Equipamentos' },
      { value: 'nao_utilizo', label: '❌ Não utilizo equipamentos' }
    ]
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
    question: 'Seu ticket médio atual?',
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
      { value: 'fidelizar_pacientes', label: '❤️ Fidelizar Pacientes' }
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
      { value: 'humanizada', label: '❤️ Humanizada' }
    ]
  },

  // === 💆‍♀️ ROTEIRO PARA CLÍNICA ESTÉTICA ===
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
    options: [
      { value: 'heccus', label: '⚡ Heccus' },
      { value: 'criofrequencia', label: '❄️ Criofrequência' },
      { value: 'lipocavitacao', label: '🌊 Lipocavitação' },
      { value: 'radiofrequencia_estetica', label: '📡 Radiofrequência Estética' },
      { value: 'carboxiterapia', label: '💨 Carboxiterapia' },
      { value: 'pressoterapia', label: '🔄 Pressoterapia' },
      { value: 'led_terapia', label: '💡 LED Terapia' },
      { value: 'outros', label: '🔧 Outros Equipamentos' },
      { value: 'nao_utilizo', label: '❌ Não utilizo equipamentos' }
    ]
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
      { value: 'fidelizar_clientes', label: '❤️ Fidelizar Clientes' }
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
  }
];
