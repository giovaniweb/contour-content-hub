import { v4 as uuidv4 } from 'uuid';
import { MarketingObjectiveType } from '@/types/script';

export type ScriptType = "videoScript" | "dailySales" | "bigIdea" | "reelsScript";

export interface ScriptResponse {
  id: string;
  title: string;
  content: string;
  type: ScriptType;
  createdAt: string;
  suggestedVideos: VideoSuggestion[];
  captionTips: string[];
  pdf_url?: string;
  equipment?: string;
  marketingObjective?: MarketingObjectiveType;
  observation?: string;
}

export interface VideoSuggestion {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  url: string;
}

export interface ScriptHistoryItem extends ScriptResponse {
  status: "gerado" | "aprovado" | "editado";
  contentHtml?: string;
  evento_agenda_id?: string;
}

export interface ScriptRequest {
  type: ScriptType;
  topic: string;
  equipment?: string[];
  bodyArea?: string;
  purposes?: string[];
  additionalInfo?: string;
  tone?: string;
  marketingObjective?: MarketingObjectiveType;
}

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  type: "video_pronto" | "take" | "image";
  thumbnailUrl: string;
  videoUrl?: string;
  isFavorite: boolean;
  rating: number;
  equipment: string[];
  purpose: string[];
  bodyArea: string;
  duration?: string;
  fecha_criacao?: string;
  shortDescription?: string;
}

export interface CalendarSuggestion {
  id: string;
  date: string;
  title: string;
  description: string;
  format?: "video" | "image" | "story";
  equipment?: string;
  hook?: string;
  caption?: string;
  completed: boolean;
  purpose?: string;
  type?: string;
}

export interface CalendarPreferences {
  frequency: "daily" | "weekly" | "custom";
  topics: string[];
  equipment: string[];
  autoGenerate: boolean;
  formats?: string[];
  purpose?: string[];
}

export async function generatePDF(scriptId: string): Promise<string> {
  console.log(`Generating PDF for script ${scriptId}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return `https://example.com/scripts/${scriptId}.pdf`;
}

export async function linkScriptToCalendar(scriptId: string, calendarEventId: string): Promise<boolean> {
  console.log(`Linking script ${scriptId} to event ${calendarEventId}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return true;
}

export async function toggleFavorite(mediaId: string): Promise<boolean> {
  console.log(`Toggling favorite for media ${mediaId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function rateMedia(mediaId: string, rating: number): Promise<boolean> {
  console.log(`Rating media ${mediaId} with ${rating} stars`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function updateScript(
  scriptId: string, 
  content: string, 
  observation?: string, 
  status?: "aprovado" | "editado" | "gerado"
): Promise<boolean> {
  console.log(`Updating script ${scriptId}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
}

export async function updateCalendarCompletion(date: string, completed: boolean): Promise<boolean> {
  console.log(`Updating event from ${date} to ${completed ? 'completed' : 'pending'}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function getCalendarSuggestions(): Promise<CalendarSuggestion[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      date: new Date().toISOString(),
      title: 'Video about facial treatment',
      description: 'Talk about the benefits of facial treatment with Adella Laser',
      format: 'video',
      equipment: 'Adella Laser',
      hook: 'Did you know it\'s possible to rejuvenate the skin without invasive procedures?',
      caption: 'Meet Adella Laser, the technology that revolutionizes facial treatment!',
      completed: false,
      purpose: 'Demonstrate results'
    },
    {
      id: '2',
      date: new Date(Date.now() + 86400000).toISOString(),
      title: 'Story about results',
      description: 'Share real results from customers who used Hipro',
      format: 'story',
      equipment: 'Hipro',
      completed: false,
      purpose: 'Show success stories'
    }
  ];
}

export async function getMediaItems(filters?: any): Promise<MediaItem[]> {
  // Simulating search for media items with fallback data
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      title: 'Adella Laser Demonstration',
      description: 'Video demonstrating the use of Adella Laser equipment for facial rejuvenation treatments.',
      type: 'video_pronto',
      thumbnailUrl: 'https://picsum.photos/seed/adella/300/200',
      videoUrl: 'https://example.com/videos/adella-demo',
      isFavorite: true,
      rating: 4.5,
      equipment: ['Adella Laser'],
      purpose: ['Demonstration', 'Tutorial'],
      bodyArea: 'Face',
      duration: '3:45'
    },
    {
      id: '2',
      title: 'Before and After - Hipro',
      description: 'Impressive results with Hipro equipment for body contouring and cellulite reduction.',
      type: 'image',
      thumbnailUrl: 'https://picsum.photos/seed/hipro/300/200',
      isFavorite: false,
      rating: 5,
      equipment: ['Hipro'],
      purpose: ['Before and after', 'Results'],
      bodyArea: 'Abdomen'
    },
    {
      id: '3',
      title: 'Como usar Ultralift',
      description: 'Tutorial detalhado sobre como utilizar o equipamento Ultralift para tratamentos de lifting facial.',
      type: 'video_pronto',
      thumbnailUrl: 'https://picsum.photos/seed/ultralift/300/200',
      videoUrl: 'https://example.com/videos/ultralift-tutorial',
      isFavorite: false,
      rating: 4,
      equipment: ['Ultralift'],
      purpose: ['Tutorial', 'Treinamento'],
      bodyArea: 'Face',
      duration: '5:12'
    },
    {
      id: '4',
      title: 'Procedimento Enygma',
      description: 'Take demonstrando procedimento completo com equipamento Enygma para tratamento de flacidez.',
      type: 'take',
      thumbnailUrl: 'https://picsum.photos/seed/enygma/300/200',
      videoUrl: 'https://example.com/videos/enygma-procedure',
      isFavorite: true,
      rating: 4.8,
      equipment: ['Enygma'],
      purpose: ['Procedimento', 'Demonstração'],
      bodyArea: 'Pernas',
      duration: '8:30'
    },
    {
      id: '5',
      title: 'Resultados Reverso',
      description: 'Galeria de imagens mostrando resultados impressionantes com equipamento Reverso.',
      type: 'image',
      thumbnailUrl: 'https://picsum.photos/seed/reverso/300/200',
      isFavorite: false,
      rating: 4.2,
      equipment: ['Reverso'],
      purpose: ['Resultados', 'Antes e depois'],
      bodyArea: 'Braços'
    },
    {
      id: '6',
      title: 'Como tratar Lipedema',
      description: 'Vídeo educativo sobre tratamentos para lipedema utilizando diversos equipamentos.',
      type: 'video_pronto',
      thumbnailUrl: 'https://picsum.photos/seed/lipedema/300/200',
      videoUrl: 'https://example.com/videos/lipedema-treatment',
      isFavorite: true,
      rating: 5,
      equipment: ['Adella Laser', 'Hipro'],
      purpose: ['Educativo', 'Informativo'],
      bodyArea: 'Pernas',
      duration: '10:15'
    }
  ];
}

export async function getScriptHistory(): Promise<ScriptHistoryItem[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      title: 'Benefits of Adella Laser',
      content: 'Lorem ipsum dolor sit amet...',
      contentHtml: '<p>Lorem ipsum dolor sit amet...</p>',
      type: 'videoScript',
      createdAt: new Date().toISOString(),
      status: 'aprovado',
      suggestedVideos: [],
      captionTips: [],
      pdf_url: 'https://example.com/pdfs/adella-script.pdf'
    },
    {
      id: '2',
      title: 'Hipro Summer Campaign',
      content: 'Lorem ipsum dolor sit amet...',
      contentHtml: '<p>Lorem ipsum dolor sit amet...</p>',
      type: 'bigIdea',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'gerado',
      suggestedVideos: [],
      captionTips: []
    }
  ];
}

export async function clearPlanning(): Promise<boolean> {
  console.log('Clearing calendar planning');
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function approvePlanning(): Promise<boolean> {
  console.log('Approving calendar planning');
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function setCalendarPreferences(prefs: CalendarPreferences): Promise<boolean> {
  console.log('Saving calendar preferences', prefs);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}
