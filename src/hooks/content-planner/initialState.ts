
import { ContentPlannerColumn, ContentPlannerItem } from '@/types/content-planner';

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

// Mock items for testing
export const mockItems: ContentPlannerItem[] = [
  {
    id: 'item-1',
    title: 'Video tutorial sobre tratamento facial',
    description: 'Vídeo explicativo sobre os benefícios do tratamento facial com ácido hialurônico',
    status: 'idea',
    tags: ['facial', 'tutorial', 'ácido'],
    format: 'vídeo',
    objective: '🟡 Atrair Atenção',
    distribution: 'Instagram',
    authorId: 'user-1',
    authorName: 'Dr. Silva',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false
  },
  {
    id: 'item-2',
    title: 'Benefícios do lifting facial',
    description: 'Conteúdo sobre os principais benefícios do lifting facial não cirúrgico',
    status: 'script_generated',
    tags: ['facial', 'lifting', 'rejuvenescimento'],
    scriptId: 'script-123',
    format: 'reels',
    objective: '🟡 Atrair Atenção',
    distribution: 'Instagram',
    authorId: 'user-1',
    authorName: 'Dr. Silva',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: true
  }
];
