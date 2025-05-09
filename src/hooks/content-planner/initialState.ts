
import { ContentPlannerColumn } from '@/types/content-planner';

// Estado inicial das colunas do Kanban
export const initialColumns: ContentPlannerColumn[] = [
  {
    id: 'idea',
    title: '💡 Ideias',
    items: [],
    icon: '💡'
  },
  {
    id: 'script_generated',
    title: '✍️ Roteiro Gerado',
    items: [],
    icon: '✍️'
  },
  {
    id: 'approved',
    title: '✅ Aprovado',
    items: [],
    icon: '✅'
  },
  {
    id: 'scheduled',
    title: '📅 Agendado',
    items: [],
    icon: '📅'
  },
  {
    id: 'published',
    title: '📢 Publicado',
    items: [],
    icon: '📢'
  }
];
