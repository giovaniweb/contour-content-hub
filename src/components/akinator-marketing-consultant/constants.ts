import { MarketingStep } from './types';

export const MARKETING_STEPS: MarketingStep[] = [
  {
    id: 'clinicType',
    question: 'Qual é o tipo da sua clínica?',
    options: [
      { value: 'clinica_medica', label: '🏥 Clínica Médica' },
      { value: 'clinica_estetica', label: '✨ Clínica Estética' }
    ]
  },
  {
    id: 'medicalSpecialty',
    question: 'Qual é a sua especialidade médica principal?',
    condition: 'clinica_medica',
    options: [
      { value: 'dermatologia', label: '🧴 Dermatologia' },
      { value: 'cirurgia_plastica', label: '🏥 Cirurgia Plástica' },
      { value: 'ortopedia', label: '🦴 Ortopedia' },
      { value: 'cardiologia', label: '❤️ Cardiologia' },
      { value: 'ginecologia', label: '👩‍⚕️ Ginecologia' },
      { value: 'oftalmologia', label: '👁️ Oftalmologia' },
      { value: 'medicina_geral', label: '🩺 Medicina Geral' },
      { value: 'outras', label: '🏥 Outras Especialidades' }
    ]
  },
  {
    id: 'aestheticFocus',
    question: 'Qual é o foco principal da sua clínica estética?',
    condition: 'clinica_estetica',
    options: [
      { value: 'facial', label: '😊 Estética Facial' },
      { value: 'corporal', label: '💪 Estética Corporal' },
      { value: 'capilar', label: '💇‍♀️ Estética Capilar' },
      { value: 'harmonizacao', label: '💎 Harmonização Facial' },
      { value: 'depilacao', label: '🪒 Depilação' },
      { value: 'todos', label: '🌟 Todos os Tratamentos' }
    ]
  },
  {
    id: 'medicalEquipments',
    question: 'Quais equipamentos médicos você possui?',
    condition: 'clinica_medica',
    options: [
      { value: 'laser_cirurgico', label: '🔬 Laser Cirúrgico' },
      { value: 'ultrassom', label: '📊 Ultrassom' },
      { value: 'raio_x', label: '📷 Raio-X' },
      { value: 'endoscopio', label: '🔍 Endoscópio' },
      { value: 'desfibrilador', label: '⚡ Desfibrilador' },
      { value: 'ventilador', label: '🫁 Ventilador' },
      { value: 'equipamento_basico', label: '🩺 Equipamentos Básicos' },
      { value: 'outros', label: '🏥 Outros' }
    ]
  },
  {
    id: 'aestheticEquipments',
    question: 'Quais equipamentos estéticos você possui?',
    condition: 'clinica_estetica',
    options: [
      { value: 'laser_diodo', label: '💎 Laser Diodo' },
      { value: 'ipl', label: '✨ IPL (Luz Pulsada)' },
      { value: 'radiofrequencia', label: '📡 Radiofrequência' },
      { value: 'criolipolise', label: '❄️ Criolipólise' },
      { value: 'hifu', label: '🔊 HIFU' },
      { value: 'microagulhamento', label: '📍 Microagulhamento' },
      { value: 'led_therapy', label: '💡 LED Therapy' },
      { value: 'peeling', label: '🧴 Peeling' },
      { value: 'massagem', label: '💆‍♀️ Equipamentos de Massagem' },
      { value: 'outros', label: '✨ Outros' }
    ]
  },
  {
    id: 'medicalProcedures',
    question: 'Quais procedimentos médicos você mais realiza?',
    condition: 'clinica_medica',
    options: [
      { value: 'consultas', label: '👩‍⚕️ Consultas Clínicas' },
      { value: 'cirurgias_menores', label: '🔪 Cirurgias Menores' },
      { value: 'exames', label: '🔬 Exames Diagnósticos' },
      { value: 'tratamentos_cronicos', label: '📅 Tratamentos Crônicos' },
      { value: 'emergencias', label: '🚨 Emergências' },
      { value: 'preventivos', label: '🛡️ Cuidados Preventivos' }
    ]
  },
  {
    id: 'medicalTicket',
    question: 'Qual é o ticket médio dos seus procedimentos médicos?',
    condition: 'clinica_medica',
    options: [
      { value: 'ate_200', label: '💰 Até R$ 200' },
      { value: '200_500', label: '💸 R$ 200 - R$ 500' },
      { value: '500_1000', label: '💵 R$ 500 - R$ 1.000' },
      { value: 'acima_1000', label: '💎 Acima de R$ 1.000' }
    ]
  },
  {
    id: 'medicalModel',
    question: 'Qual é o modelo de atendimento da sua clínica médica?',
    condition: 'clinica_medica',
    options: [
      { value: 'convenios', label: '🏥 Convênios Médicos' },
      { value: 'particular', label: '💳 Particular' },
      { value: 'misto', label: '🔄 Misto (Convênios + Particular)' },
      { value: 'sus', label: '🏛️ SUS' }
    ]
  },
  {
    id: 'medicalObjective',
    question: 'Qual é o principal objetivo para sua clínica médica?',
    condition: 'clinica_medica',
    options: [
      { value: 'aumentar_pacientes', label: '👥 Aumentar número de pacientes' },
      { value: 'fidelizar_pacientes', label: '❤️ Fidelizar pacientes atuais' },
      { value: 'melhorar_reputacao', label: '⭐ Melhorar reputação' },
      { value: 'expandir_servicos', label: '📈 Expandir serviços' },
      { value: 'aumentar_faturamento', label: '💰 Aumentar faturamento' }
    ]
  },
  {
    id: 'aestheticBestSeller',
    question: 'Qual é o procedimento mais vendido na sua clínica estética?',
    condition: 'clinica_estetica',
    options: [
      { value: 'depilacao_laser', label: '🪒 Depilação a Laser' },
      { value: 'botox', label: '💉 Botox' },
      { value: 'preenchimento', label: '💎 Preenchimento' },
      { value: 'limpeza_pele', label: '🧴 Limpeza de Pele' },
      { value: 'radiofrequencia', label: '📡 Radiofrequência' },
      { value: 'peeling', label: '✨ Peeling' },
      { value: 'microagulhamento', label: '📍 Microagulhamento' },
      { value: 'massagem', label: '💆‍♀️ Massagem' }
    ]
  },
  {
    id: 'aestheticSalesModel',
    question: 'Como você comercializa seus serviços estéticos?',
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
    id: 'aestheticObjective',
    question: 'Qual é o principal objetivo para sua clínica estética?',
    condition: 'clinica_estetica',
    options: [
      { value: 'aumentar_clientes', label: '👥 Aumentar número de clientes' },
      { value: 'fidelizar_clientes', label: '❤️ Fidelizar clientes atuais' },
      { value: 'aumentar_ticket', label: '💰 Aumentar ticket médio' },
      { value: 'melhorar_marca', label: '⭐ Fortalecer marca' },
      { value: 'expandir_servicos', label: '📈 Expandir serviços' }
    ]
  },
  {
    id: 'currentRevenue',
    question: 'Qual é o faturamento mensal atual da sua clínica?',
    options: [
      { value: 'ate_15k', label: '💰 Até R$ 15.000' },
      { value: '15k_30k', label: '💸 R$ 15.000 - R$ 30.000' },
      { value: '30k_60k', label: '💵 R$ 30.000 - R$ 60.000' },
      { value: 'acima_60k', label: '💎 Acima de R$ 60.000' }
    ]
  },
  {
    id: 'revenueGoal',
    question: 'Qual é sua meta de crescimento?',
    options: [
      { value: 'crescer_30', label: '📈 Crescer 30%' },
      { value: 'crescer_50', label: '🚀 Crescer 50%' },
      { value: 'dobrar', label: '⚡ Dobrar o faturamento' },
      { value: 'manter_estavel', label: '📊 Manter estabilidade' }
    ]
  },
  {
    id: 'mainService',
    question: 'Qual serviço você mais quer promover?',
    isOpen: true,
    options: []
  },
  {
    id: 'personalBrand',
    question: 'Como você se posiciona no mercado?',
    options: [
      { value: 'premium', label: '💎 Premium/Luxo' },
      { value: 'acessivel', label: '💰 Acessível' },
      { value: 'especialista', label: '🎯 Especialista' },
      { value: 'completa', label: '🌟 Clínica Completa' },
      { value: 'inovadora', label: '🚀 Inovadora' }
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
      { value: 'raramente', label: '❌ Raramente' }
    ]
  },
  {
    id: 'paidTraffic',
    question: 'Você investe em tráfego pago?',
    options: [
      { value: 'google_ads', label: '🔍 Google Ads' },
      { value: 'facebook_ads', label: '📘 Facebook/Instagram Ads' },
      { value: 'ambos', label: '🔄 Ambos' },
      { value: 'nao_invisto', label: '❌ Não invisto' },
      { value: 'planejo_investir', label: '💭 Planejo investir' }
    ]
  },
  {
    id: 'targetAudience',
    question: 'Quem é seu público-alvo principal?',
    options: [
      { value: 'mulheres_25_40', label: '👩 Mulheres 25-40 anos' },
      { value: 'mulheres_40_plus', label: '👩‍🦳 Mulheres 40+ anos' },
      { value: 'homens_adultos', label: '👨 Homens adultos' },
      { value: 'jovens', label: '👧 Jovens 18-25 anos' },
      { value: 'publico_geral', label: '👥 Público geral' }
    ]
  },
  {
    id: 'clinicPosition',
    question: 'Como sua clínica se diferencia da concorrência?',
    isOpen: true,
    options: []
  }
];
