
import { ContentPlannerColumn, ContentPlannerItem } from '@/types/content-planner';

export const initialColumns: ContentPlannerColumn[] = [
  {
    id: 'idea',
    title: '💡 Ideias',
    icon: '💡',
    items: []
  },
  {
    id: 'approved',
    title: '⚡ Executar',
    icon: '⚡',
    items: []
  },
  {
    id: 'published',
    title: '📢 Publicar',
    icon: '📢',
    items: []
  }
];

// Mock items para teste - com dados reais visíveis
export const mockItems: ContentPlannerItem[] = [
  {
    id: 'item-1',
    title: 'Vídeo tutorial sobre tratamento facial',
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
    status: 'approved',
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
  },
  {
    id: 'item-3',
    title: 'Post sobre cuidados pós-procedimento',
    description: 'Dicas importantes para cuidados após procedimentos estéticos',
    status: 'published',
    tags: ['cuidados', 'pós-procedimento', 'dicas'],
    format: 'carrossel',
    objective: '🟢 Criar Conexão',
    distribution: 'Instagram',
    authorId: 'user-1',
    authorName: 'Dr. Silva',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false
  }
];
