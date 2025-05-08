
import { ContentPlannerColumn, ContentPlannerItem } from '@/types/content-planner';

export const initialColumns: ContentPlannerColumn[] = [
  {
    id: 'idea',
    title: 'Ideias',
    items: [],
    icon: '💡'
  },
  {
    id: 'script_generated',
    title: 'Roteiro Gerado',
    items: [],
    icon: '✍️'
  },
  {
    id: 'approved',
    title: 'Aprovado',
    items: [],
    icon: '✅'
  },
  {
    id: 'scheduled',
    title: 'Agendado',
    items: [],
    icon: '📅'
  },
  {
    id: 'published',
    title: 'Publicado',
    items: [],
    icon: '📢'
  }
];

export const mockItems: ContentPlannerItem[] = [
  {
    id: '1',
    title: 'Como usar o equipamento X para melhorar seus resultados',
    description: 'Vídeo explicativo sobre as funcionalidades avançadas do equipamento',
    status: 'idea',
    tags: ['tutorial', 'iniciante'],
    format: 'vídeo',
    objective: '🟡 Atrair Atenção',
    distribution: 'YouTube',
    equipmentId: 'eq1',
    equipmentName: 'Equipamento X',
    authorId: 'user1',
    authorName: 'João Silva',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false
  },
  {
    id: '2',
    title: 'Principais benefícios do equipamento Y',
    description: 'Carrossel com infográficos dos benefícios',
    status: 'script_generated',
    tags: ['benefícios', 'comparativo'],
    scriptId: 'script1',
    format: 'carrossel',
    objective: '🟢 Criar Conexão',
    distribution: 'Instagram',
    equipmentId: 'eq2',
    equipmentName: 'Equipamento Y',
    authorId: 'user1',
    authorName: 'João Silva',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: true
  },
  {
    id: '3',
    title: 'Promoção especial - Equipamento Z',
    description: 'Reels mostrando a promoção limitada',
    status: 'approved',
    tags: ['promoção', 'limitado'],
    scriptId: 'script2',
    format: 'reels',
    objective: '🔴 Fazer Comprar',
    distribution: 'Instagram',
    equipmentId: 'eq3',
    equipmentName: 'Equipamento Z',
    authorId: 'user2',
    authorName: 'Maria Souza',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false
  },
  {
    id: '4',
    title: 'Depoimentos de clientes satisfeitos',
    description: 'Vídeo com depoimentos de clientes',
    status: 'scheduled',
    tags: ['depoimentos', 'resultados'],
    scriptId: 'script3',
    format: 'vídeo',
    objective: '✅ Fechar Agora',
    distribution: 'YouTube',
    equipmentId: 'eq1',
    equipmentName: 'Equipamento X',
    scheduledDate: '2025-05-15',
    authorId: 'user2',
    authorName: 'Maria Souza',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false,
    calendarEventId: 'calendar1'
  }
];
