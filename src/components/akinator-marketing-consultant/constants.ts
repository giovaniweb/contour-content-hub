
import { MarketingStep } from './types';

export const MARKETING_STEPS: MarketingStep[] = [
  {
    id: 'clinicType',
    question: '🏥 Que tipo de clínica você possui?',
    options: [
      { value: 'estetica_facial', label: 'Estética Facial' },
      { value: 'estetica_corporal', label: 'Estética Corporal' },
      { value: 'completa', label: 'Facial e Corporal' },
      { value: 'dermatologia', label: 'Dermatologia Estética' }
    ]
  },
  {
    id: 'businessTime',
    question: '⏰ Há quanto tempo sua clínica está no mercado?',
    options: [
      { value: 'iniciante', label: 'Menos de 1 ano' },
      { value: 'intermediario', label: '1-3 anos' },
      { value: 'consolidado', label: '3-5 anos' },
      { value: 'experiente', label: 'Mais de 5 anos' }
    ]
  },
  {
    id: 'teamSize',
    question: '👥 Qual o tamanho da sua equipe?',
    options: [
      { value: 'solo', label: 'Só eu' },
      { value: 'pequena', label: '2-3 pessoas' },
      { value: 'media', label: '4-7 pessoas' },
      { value: 'grande', label: 'Mais de 8 pessoas' }
    ]
  },
  {
    id: 'currentRevenue',
    question: '💰 Qual seu faturamento mensal atual?',
    options: [
      { value: 'ate_10k', label: 'Até R$ 10.000' },
      { value: '10k_30k', label: 'R$ 10.000 - R$ 30.000' },
      { value: '30k_50k', label: 'R$ 30.000 - R$ 50.000' },
      { value: 'acima_50k', label: 'Acima de R$ 50.000' }
    ]
  },
  {
    id: 'revenueGoal',
    question: '🎯 Qual sua meta de faturamento?',
    options: [
      { value: 'dobrar', label: 'Dobrar o atual' },
      { value: '50_porcento', label: 'Aumentar 50%' },
      { value: '100k', label: 'Chegar a R$ 100.000' },
      { value: 'manter_estavel', label: 'Manter estável' }
    ]
  },
  {
    id: 'mainChallenge',
    question: '🚫 Qual seu maior desafio hoje?',
    options: [
      { value: 'atrair_clientes', label: 'Atrair novos clientes' },
      { value: 'converter_leads', label: 'Converter leads em vendas' },
      { value: 'fidelizar', label: 'Fidelizar clientes' },
      { value: 'aumentar_ticket', label: 'Aumentar ticket médio' }
    ]
  },
  {
    id: 'marketingBudget',
    question: '💳 Quanto investe em marketing mensal?',
    options: [
      { value: 'nada', label: 'Não invisto' },
      { value: 'ate_1k', label: 'Até R$ 1.000' },
      { value: '1k_3k', label: 'R$ 1.000 - R$ 3.000' },
      { value: 'acima_3k', label: 'Acima de R$ 3.000' }
    ]
  },
  {
    id: 'socialMediaPresence',
    question: '📱 Como está sua presença digital?',
    options: [
      { value: 'inexistente', label: 'Não tenho redes sociais' },
      { value: 'basico', label: 'Perfis básicos' },
      { value: 'ativo', label: 'Posto regularmente' },
      { value: 'profissional', label: 'Estratégia profissional' }
    ]
  },
  {
    id: 'targetAudience',
    question: '🎭 Qual seu público principal?',
    options: [
      { value: 'jovens', label: 'Jovens (18-30 anos)' },
      { value: 'adultos', label: 'Adultos (30-45 anos)' },
      { value: 'maduros', label: 'Maduros (45+ anos)' },
      { value: 'todos', label: 'Todos os públicos' }
    ]
  }
];
