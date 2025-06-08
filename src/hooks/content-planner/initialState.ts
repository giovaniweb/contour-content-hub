
import { ContentPlannerColumn } from '@/types/content-planner';

export const initialColumns: ContentPlannerColumn[] = [
  {
    id: 'idea',
    title: '💡 Ideias',
    icon: '💡',
    items: []
  },
  {
    id: 'script_generated',
    title: '✍️ Roteiro Gerado',
    icon: '✍️',
    items: []
  },
  {
    id: 'approved',
    title: '✅ Aprovado',
    icon: '✅',
    items: []
  },
  {
    id: 'scheduled',
    title: '📅 Agendado',
    icon: '📅',
    items: []
  },
  {
    id: 'published',
    title: '📢 Publicado',
    icon: '📢',
    items: []
  }
];
