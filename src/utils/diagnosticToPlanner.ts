
import { ContentPlannerItem, ContentFormat, ContentDistribution } from '@/types/content-planner';
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';

export interface DiagnosticAction {
  title: string;
  description: string;
  priority: string;
  time: string;
  category: string;
  type?: string;
}

export const convertActionToContentItem = (
  action: DiagnosticAction,
  session: DiagnosticSession
): Partial<ContentPlannerItem> => {
  // Map diagnostic priorities to content objectives
  const priorityToObjective = {
    'Alta': '🔴 Fazer Comprar',
    'Média': '🟡 Atrair Atenção',
    'Baixa': '🟢 Criar Conexão'
  };

  // Map categories to formats
  const categoryToFormat: Record<string, ContentFormat> = {
    'Conteúdo': 'carrossel',
    'Setup': 'story',
    'Networking': 'vídeo',
    'Credibilidade': 'carrossel',
    'Resultados': 'reels',
    'Testimonials': 'vídeo',
    'Posicionamento': 'carrossel',
    'Inovação': 'reels',
    'Promoção': 'story',
    'CTA': 'story',
    'Automação': 'texto',
    'Website': 'texto',
    'Retenção': 'carrossel',
    'Partnerships': 'vídeo',
    'Otimização': 'texto',
    'Vendas': 'reels'
  };

  const specialty = session.state.clinicType === 'clinica_medica' 
    ? session.state.medicalSpecialty 
    : session.state.aestheticFocus;

  return {
    title: action.title,
    description: `${action.description}\n\n📋 Origem: Consultoria de Marketing - ${specialty}`,
    status: 'idea',
    tags: [
      'consultoria-marketing',
      specialty?.toLowerCase().replace(/\s+/g, '-') || 'clinica',
      action.category.toLowerCase(),
      action.priority.toLowerCase()
    ],
    format: categoryToFormat[action.category] || 'carrossel',
    objective: priorityToObjective[action.priority as keyof typeof priorityToObjective] || '🟡 Atrair Atenção',
    distribution: 'Instagram' as ContentDistribution,
    aiGenerated: true
  };
};

export const convertMultipleActionsToContentItems = (
  actions: DiagnosticAction[],
  session: DiagnosticSession
): Partial<ContentPlannerItem>[] => {
  return actions.map(action => convertActionToContentItem(action, session));
};
