
import { ContentPlannerState } from "@/types/content-planner";

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

// Mock items for development and testing
export const mockItems = [
  {
    id: '1',
    title: 'Post sobre tratamento facial',
    description: 'Explicação sobre o novo tratamento de rejuvenescimento',
    date: '2023-10-15',
    status: 'scheduled',
    type: 'post',
    tags: ['facial', 'rejuvenescimento'],
    assignedTo: 'Dr. Silva',
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
    status: 'draft',
    type: 'video',
    tags: ['preenchimento', 'labial', 'técnica'],
    assignedTo: 'Dra. Oliveira',
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
    status: 'published',
    type: 'promotion',
    tags: ['botox', 'promoção', 'desconto'],
    assignedTo: 'Marketing',
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
    media: []
  },
  {
    id: '5',
    title: 'Artigo sobre novas tecnologias',
    description: 'Artigo para o blog sobre as novas tecnologias em estética',
    date: '2023-11-10',
    status: 'draft',
    type: 'article',
    tags: ['tecnologia', 'inovação', 'estética'],
    assignedTo: 'Dr. Mendes',
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
