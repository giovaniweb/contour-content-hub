
import { ContentPlannerColumn, ContentPlannerItem } from '@/types/content-planner';

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

// Dados de exemplo para simular conteúdo no Planner
export const mockItems: ContentPlannerItem[] = [
  {
    id: 'item-1',
    title: 'Benefícios do ácido hialurônico para pele madura',
    description: 'Vídeo explicativo sobre como o ácido hialurônico pode beneficiar peles acima dos 40 anos',
    status: 'idea',
    tags: ['skincare', 'ácido hialurônico', 'pele madura'],
    format: 'vídeo',
    objective: 'Educar',
    distribution: 'Instagram',
    equipmentId: 'equip-123',
    equipmentName: 'Equipamento Facial X200',
    authorId: 'user-1',
    authorName: 'Maria Silva',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    aiGenerated: false,
    responsibleId: 'user-2',
    responsibleName: 'João Costa'
  },
  {
    id: 'item-2',
    title: 'Comparativo: laser vs radiofrequência',
    description: 'Análise detalhada das diferenças, vantagens e indicações de cada tecnologia',
    status: 'script_generated',
    scriptId: 'script-456',
    tags: ['laser', 'radiofrequência', 'comparativo', 'tecnologia'],
    format: 'carrossel',
    objective: 'Comparar',
    distribution: 'Instagram',
    equipmentId: 'equip-456',
    equipmentName: 'Laser Pro Max',
    authorId: 'user-1',
    authorName: 'Maria Silva',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    aiGenerated: true,
    responsibleId: 'user-3',
    responsibleName: 'Ana Ferreira'
  },
  {
    id: 'item-3',
    title: 'Tutorial: aplicação correta de preenchimento labial',
    description: 'Passo a passo detalhado sobre a técnica mais segura para preenchimento labial com ácido hialurônico',
    status: 'approved',
    scriptId: 'script-789',
    tags: ['tutorial', 'preenchimento', 'lábios', 'técnica'],
    format: 'vídeo',
    objective: 'Instruir',
    distribution: 'YouTube',
    equipmentId: 'equip-789',
    equipmentName: 'Kit Preenchimento Premium',
    authorId: 'user-2',
    authorName: 'João Costa',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    aiGenerated: false,
    responsibleId: 'user-1',
    responsibleName: 'Maria Silva'
  },
  {
    id: 'item-4',
    title: 'Resultados reais: antes e depois com o equipamento X',
    description: 'Demonstração de resultados de pacientes reais após tratamento com o equipamento X',
    status: 'scheduled',
    scriptId: 'script-101',
    tags: ['resultados', 'antes e depois', 'casos reais'],
    format: 'reels',
    objective: 'Demonstrar',
    distribution: 'Instagram',
    equipmentId: 'equip-123',
    equipmentName: 'Equipamento Facial X200',
    scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    scheduledTime: '14:30',
    calendarEventId: 'cal-123',
    authorId: 'user-3',
    authorName: 'Ana Ferreira',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    aiGenerated: true,
    responsibleId: 'user-2',
    responsibleName: 'João Costa'
  },
  {
    id: 'item-5',
    title: '5 mitos sobre tratamentos estéticos',
    description: 'Desmistificando informações falsas sobre procedimentos estéticos comuns',
    status: 'published',
    scriptId: 'script-102',
    tags: ['mitos', 'educação', 'esclarecimento'],
    format: 'carrossel',
    objective: 'Educar',
    distribution: 'Instagram',
    scheduledDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    scheduledTime: '10:00',
    calendarEventId: 'cal-456',
    authorId: 'user-1',
    authorName: 'Maria Silva',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    aiGenerated: false,
    responsibleId: 'user-1',
    responsibleName: 'Maria Silva'
  }
];
