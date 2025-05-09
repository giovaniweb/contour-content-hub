
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
    date: '2023-10-15',
    status: 'idea',
    type: 'post',
    tags: ['facial', 'rejuvenescimento'],
    assignedTo: 'Dr. Silva',
    format: 'vídeo',
    objective: 'Educacional',
    distribution: 'Instagram',
    authorId: 'user1',
    authorName: 'Dr. Silva',
    createdAt: '2023-10-01',
    updatedAt: '2023-10-01',
    aiGenerated: false,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881',
        alt: 'Tratamento facial'
      }
    ]
  },
  {
    id: '2',
    title: 'Vídeo demonstrativo de preenchimento',
    description: 'Vídeo curto mostrando a técnica de preenchimento labial',
    date: '2023-10-18',
    status: 'script_generated',
    type: 'video',
    tags: ['preenchimento', 'labial', 'técnica'],
    assignedTo: 'Dra. Oliveira',
    format: 'vídeo',
    objective: 'Tutorial',
    distribution: 'YouTube',
    authorId: 'user2',
    authorName: 'Dra. Oliveira',
    createdAt: '2023-10-05',
    updatedAt: '2023-10-10',
    aiGenerated: true,
    media: [
      {
        type: 'video',
        url: 'https://example.com/video123.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1562184552-997c461abbe6'
      }
    ]
  },
  {
    id: '3',
    title: 'Promoção de Botox',
    description: 'Anúncio da promoção mensal de Botox',
    date: '2023-10-25',
    status: 'approved',
    type: 'promotion',
    tags: ['botox', 'promoção', 'desconto'],
    assignedTo: 'Marketing',
    format: 'carrossel',
    objective: 'Promocional',
    distribution: 'Múltiplos',
    authorId: 'user3',
    authorName: 'Equipe de Marketing',
    createdAt: '2023-10-12',
    updatedAt: '2023-10-15',
    aiGenerated: false,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937',
        alt: 'Promoção de Botox'
      }
    ]
  },
  {
    id: '4',
    title: 'Live sobre cuidados pós-procedimento',
    description: 'Live no Instagram sobre cuidados após procedimentos estéticos',
    date: '2023-11-05',
    status: 'scheduled',
    type: 'live',
    tags: ['cuidados', 'pós-procedimento', 'instagram'],
    assignedTo: 'Dra. Costa',
    format: 'vídeo',
    objective: 'Educacional',
    distribution: 'Instagram',
    authorId: 'user4',
    authorName: 'Dra. Costa',
    createdAt: '2023-10-20',
    updatedAt: '2023-10-25',
    aiGenerated: false,
    media: []
  },
  {
    id: '5',
    title: 'Artigo sobre novas tecnologias',
    description: 'Artigo para o blog sobre as novas tecnologias em estética',
    date: '2023-11-10',
    status: 'published',
    type: 'article',
    tags: ['tecnologia', 'inovação', 'estética'],
    assignedTo: 'Dr. Mendes',
    format: 'texto',
    objective: 'Informativo',
    distribution: 'Blog',
    authorId: 'user5',
    authorName: 'Dr. Mendes',
    createdAt: '2023-10-25',
    updatedAt: '2023-11-05',
    aiGenerated: true,
    media: []
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
