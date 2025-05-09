
import { ContentPlannerState, ContentPlannerItem } from "@/types/content-planner";

// Initial state for the content planner
export const initialState: ContentPlannerState = {
  items: [],
  loading: false,
  error: null,
  selectedItem: null,
  selectedDate: null,
  view: 'month',
  filters: {
    status: 'all',
    type: 'all',
    search: '',
  },
  isModalOpen: false,
  modalType: null,
  modalData: null,
};

// Add initialColumns to fix build errors
export const initialColumns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'Em Progresso' },
  { id: 'review', title: 'Revisão' },
  { id: 'done', title: 'Concluído' }
];

// Updated mock items to match ContentPlannerItem interface
export const mockItems: ContentPlannerItem[] = [
  {
    id: '1',
    title: 'Post sobre tratamento facial',
    description: 'Explicação sobre o novo tratamento de rejuvenescimento',
    status: 'idea',
    tags: ['facial', 'rejuvenescimento'],
    format: 'vídeo',
    objective: 'Educacional',
    distribution: 'Instagram',
    authorId: 'user1',
    authorName: 'Dr. Silva',
    createdAt: '2023-10-01',
    updatedAt: '2023-10-01',
    aiGenerated: false,
    scheduledDate: '2023-10-15'
  },
  {
    id: '2',
    title: 'Vídeo demonstrativo de preenchimento',
    description: 'Vídeo curto mostrando a técnica de preenchimento labial',
    status: 'script_generated',
    tags: ['preenchimento', 'labial', 'técnica'],
    scriptId: 'script-123',
    format: 'vídeo',
    objective: 'Tutorial',
    distribution: 'YouTube',
    authorId: 'user2',
    authorName: 'Dra. Oliveira',
    createdAt: '2023-10-05',
    updatedAt: '2023-10-10',
    aiGenerated: true,
    scheduledDate: '2023-10-18'
  },
  {
    id: '3',
    title: 'Promoção de Botox',
    description: 'Anúncio da promoção mensal de Botox',
    status: 'approved',
    tags: ['botox', 'promoção', 'desconto'],
    format: 'carrossel',
    objective: 'Promocional',
    distribution: 'Múltiplos',
    authorId: 'user3',
    authorName: 'Equipe de Marketing',
    createdAt: '2023-10-12',
    updatedAt: '2023-10-15',
    aiGenerated: false,
    scheduledDate: '2023-10-25'
  },
  {
    id: '4',
    title: 'Live sobre cuidados pós-procedimento',
    description: 'Live no Instagram sobre cuidados após procedimentos estéticos',
    status: 'scheduled',
    tags: ['cuidados', 'pós-procedimento', 'instagram'],
    format: 'vídeo',
    objective: 'Educacional',
    distribution: 'Instagram',
    authorId: 'user4',
    authorName: 'Dra. Costa',
    createdAt: '2023-10-20',
    updatedAt: '2023-10-25',
    aiGenerated: false,
    scheduledDate: '2023-11-05'
  },
  {
    id: '5',
    title: 'Artigo sobre novas tecnologias',
    description: 'Artigo para o blog sobre as novas tecnologias em estética',
    status: 'published',
    tags: ['tecnologia', 'inovação', 'estética'],
    format: 'texto',
    objective: 'Informativo',
    distribution: 'Blog',
    authorId: 'user5',
    authorName: 'Dr. Mendes',
    createdAt: '2023-10-25',
    updatedAt: '2023-11-05',
    aiGenerated: true,
    scheduledDate: '2023-11-10'
  }
];

// Reducer action types
export enum ActionType {
  FETCH_ITEMS_START = 'FETCH_ITEMS_START',
  FETCH_ITEMS_SUCCESS = 'FETCH_ITEMS_SUCCESS',
  FETCH_ITEMS_FAILURE = 'FETCH_ITEMS_FAILURE',
  SELECT_ITEM = 'SELECT_ITEM',
  SELECT_DATE = 'SELECT_DATE',
  CHANGE_VIEW = 'CHANGE_VIEW',
  SET_FILTER = 'SET_FILTER',
  OPEN_MODAL = 'OPEN_MODAL',
  CLOSE_MODAL = 'CLOSE_MODAL',
  ADD_ITEM = 'ADD_ITEM',
  UPDATE_ITEM = 'UPDATE_ITEM',
  DELETE_ITEM = 'DELETE_ITEM',
}
