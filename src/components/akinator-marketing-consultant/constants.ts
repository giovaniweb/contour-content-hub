
import { MarketingStep } from './types';

export const MARKETING_STEPS: MarketingStep[] = [
  {
    id: 'clinicType',
    question: '🏥 Qual é o seu tipo de clínica?',
    options: [
      { value: 'clinica_medica', label: 'Clínica Médica (com médico responsável)' },
      { value: 'clinica_estetica', label: 'Clínica Estética (sem procedimentos médicos)' }
    ]
  },
  // Perguntas específicas para Clínica Médica
  {
    id: 'medicalSpecialty',
    question: '🩺 Qual sua especialidade principal?',
    options: [
      { value: 'dermatologia', label: 'Dermatologia' },
      { value: 'nutrologia', label: 'Nutrologia' },
      { value: 'ginecoestetica', label: 'Ginecoestética' },
      { value: 'cirurgia_plastica', label: 'Cirurgia Plástica' },
      { value: 'medicina_estetica', label: 'Medicina Estética' },
      { value: 'outras', label: 'Outras especialidades' }
    ],
    condition: 'clinica_medica'
  },
  {
    id: 'medicalEquipments',
    question: '🔧 Quais equipamentos você utiliza na sua clínica?',
    options: [], // Será preenchido dinamicamente com equipamentos do sistema
    condition: 'clinica_medica'
  },
  {
    id: 'medicalProcedures',
    question: '💉 Que tipo de procedimentos você realiza?',
    options: [
      { value: 'invasivos', label: 'Procedimentos invasivos (cirurgias)' },
      { value: 'injetaveis', label: 'Injetáveis (botox, preenchimento)' },
      { value: 'tecnologicos', label: 'Tecnológicos (lasers, radiofrequência)' },
      { value: 'combinados', label: 'Combinação de procedimentos' }
    ],
    condition: 'clinica_medica'
  },
  {
    id: 'medicalTicket',
    question: '💰 Qual seu ticket médio estimado?',
    options: [
      { value: 'ate_500', label: 'Até R$ 500' },
      { value: '500_1500', label: 'R$ 500 - R$ 1.500' },
      { value: '1500_5000', label: 'R$ 1.500 - R$ 5.000' },
      { value: 'acima_5000', label: 'Acima de R$ 5.000' }
    ],
    condition: 'clinica_medica'
  },
  {
    id: 'medicalModel',
    question: '📋 Como você trabalha com seus pacientes?',
    options: [
      { value: 'planos_tratamento', label: 'Planos de tratamento estruturados' },
      { value: 'recorrencia', label: 'Consultas de retorno/manutenção' },
      { value: 'procedimento_unico', label: 'Procedimentos únicos' },
      { value: 'combinado', label: 'Modelo combinado' }
    ],
    condition: 'clinica_medica'
  },
  {
    id: 'medicalObjective',
    question: '🎯 Qual seu objetivo principal?',
    options: [
      { value: 'diferenciacao', label: 'Diferenciação no mercado' },
      { value: 'escala', label: 'Escalar atendimentos' },
      { value: 'retencao', label: 'Melhorar retenção de pacientes' },
      { value: 'autoridade', label: 'Construir autoridade médica' }
    ],
    condition: 'clinica_medica'
  },
  // Perguntas específicas para Clínica Estética
  {
    id: 'aestheticFocus',
    question: '💆‍♀️ Qual o foco da sua clínica estética?',
    options: [
      { value: 'corporal', label: 'Tratamentos corporais' },
      { value: 'facial', label: 'Tratamentos faciais' },
      { value: 'ambos', label: 'Facial e corporal' },
      { value: 'depilacao', label: 'Depilação a laser' }
    ],
    condition: 'clinica_estetica'
  },
  {
    id: 'aestheticEquipments',
    question: '🔧 Quais equipamentos você utiliza?',
    options: [], // Será preenchido dinamicamente com equipamentos do sistema
    condition: 'clinica_estetica'
  },
  {
    id: 'aestheticBestSeller',
    question: '⭐ Qual seu protocolo mais vendido?',
    options: [
      { value: 'emagrecimento', label: 'Protocolos de emagrecimento' },
      { value: 'rejuvenescimento', label: 'Rejuvenescimento facial' },
      { value: 'flacidez', label: 'Tratamento de flacidez' },
      { value: 'depilacao_definitiva', label: 'Depilação definitiva' },
      { value: 'celulite', label: 'Tratamento de celulite' }
    ],
    condition: 'clinica_estetica'
  },
  {
    id: 'aestheticSalesModel',
    question: '💳 Como você vende seus tratamentos?',
    options: [
      { value: 'pacotes', label: 'Pacotes de sessões' },
      { value: 'sessoes_unicas', label: 'Sessões únicas' },
      { value: 'ambos', label: 'Pacotes e sessões' },
      { value: 'protocolos', label: 'Protocolos completos' }
    ],
    condition: 'clinica_estetica'
  },
  {
    id: 'aestheticObjective',
    question: '🎯 Qual seu objetivo principal?',
    options: [
      { value: 'mais_leads', label: 'Atrair mais leads qualificados' },
      { value: 'recorrencia', label: 'Aumentar recorrência de clientes' },
      { value: 'ticket_medio', label: 'Aumentar ticket médio' },
      { value: 'autoridade', label: 'Construir autoridade na região' }
    ],
    condition: 'clinica_estetica'
  },
  // Perguntas comuns para ambos os tipos
  {
    id: 'currentRevenue',
    question: '💰 Qual seu faturamento médio atual?',
    options: [
      { value: 'ate_15k', label: 'Até R$ 15.000' },
      { value: '15k_30k', label: 'R$ 15.000 - R$ 30.000' },
      { value: '30k_60k', label: 'R$ 30.000 - R$ 60.000' },
      { value: 'acima_60k', label: 'Acima de R$ 60.000' }
    ]
  },
  {
    id: 'revenueGoal',
    question: '🎯 Meta de faturamento para os próximos 3 meses?',
    options: [
      { value: 'crescer_30', label: 'Crescer 30%' },
      { value: 'crescer_50', label: 'Crescer 50%' },
      { value: 'dobrar', label: 'Dobrar o faturamento' },
      { value: 'manter_estavel', label: 'Manter estável' }
    ]
  },
  {
    id: 'mainService',
    question: '⭐ Qual serviço você mais deseja vender?',
    options: [], // Campo aberto
    isOpen: true
  },
  {
    id: 'personalBrand',
    question: '📹 Você aparece nos conteúdos? Grava vídeos?',
    options: [
      { value: 'sim_sempre', label: 'Sim, sempre apareço' },
      { value: 'as_vezes', label: 'Às vezes apareço' },
      { value: 'raramente', label: 'Raramente apareço' },
      { value: 'nunca', label: 'Nunca apareço' }
    ]
  },
  {
    id: 'contentFrequency',
    question: '📱 Frequência atual de conteúdo?',
    options: [
      { value: 'diario', label: 'Diariamente' },
      { value: 'varios_por_semana', label: 'Várias vezes por semana' },
      { value: 'semanal', label: 'Semanalmente' },
      { value: 'irregular', label: 'Irregular/raramente' }
    ]
  },
  {
    id: 'paidTraffic',
    question: '🎯 Usa tráfego pago?',
    options: [
      { value: 'sim_regular', label: 'Sim, regularmente' },
      { value: 'esporadico', label: 'Esporadicamente' },
      { value: 'ja_testei', label: 'Já testei, mas parei' },
      { value: 'nunca_usei', label: 'Nunca usei' }
    ]
  },
  {
    id: 'targetAudience',
    question: '👥 Quem é seu público ideal?',
    options: [], // Campo aberto
    isOpen: true
  },
  {
    id: 'clinicPosition',
    question: '🏷️ Como você define sua clínica?',
    options: [
      { value: 'premium', label: 'Premium/Luxo' },
      { value: 'humanizada', label: 'Humanizada/Acolhedora' },
      { value: 'acessivel', label: 'Acessível/Popular' },
      { value: 'tecnica', label: 'Técnica/Científica' },
      { value: 'moderna', label: 'Moderna/Inovadora' }
    ]
  }
];
