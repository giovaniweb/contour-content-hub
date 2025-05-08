
import { ContentPlannerItem, ContentPlannerStatus } from '@/types/content-planner';

// Mock data for content planner items
export const mockContentItems: ContentPlannerItem[] = [
  {
    id: '1',
    title: 'Como usar equipamento para melhores resultados',
    description: 'Vídeo tutorial sobre o equipamento',
    status: 'idea' as ContentPlannerStatus,
    tags: ['tutorial', 'equipamento'],
    format: 'vídeo',
    objective: '🟡 Atrair Atenção',
    distribution: 'YouTube',
    equipmentId: 'eq1',
    equipmentName: 'Equipamento X',
    authorId: 'user1',
    authorName: 'João Silva',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false,
    responsibleId: 'user1',
    responsibleName: 'João Silva'
  },
  {
    id: '2',
    title: 'Benefícios do equipamento Y',
    description: 'Carrossel com infográficos dos benefícios',
    status: 'script_generated' as ContentPlannerStatus,
    tags: ['benefícios', 'infográfico'],
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
    aiGenerated: true,
    responsibleId: 'user2',
    responsibleName: 'Maria Souza'
  }
];
