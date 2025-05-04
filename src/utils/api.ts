import { v4 as uuidv4 } from 'uuid';

export type ScriptType = "videoScript" | "dailySales" | "bigIdea" | "reelsScript";
export type MarketingObjectiveType = "atrair_atencao" | "criar_conexao" | "fazer_comprar" | "reativar_interesse" | "fechar_agora";

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
  formats: string[];
  purpose: string[];
}

export async function generatePDF(scriptId: string): Promise<string> {
  // Simulating PDF generation
  console.log(`Generating PDF for script ${scriptId}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real case, this would be a URL to the generated PDF file
  return `https://example.com/scripts/${scriptId}.pdf`;
}

export async function linkScriptToCalendar(scriptId: string, calendarEventId: string): Promise<boolean> {
  // Simulating link between script and calendar event
  console.log(`Linking script ${scriptId} to event ${calendarEventId}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real case, here the link would be made in the database
  return true;
}

export async function toggleFavorite(mediaId: string): Promise<boolean> {
  // Simulating favorite toggle
  console.log(`Toggling favorite for media ${mediaId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function rateMedia(mediaId: string, rating: number): Promise<boolean> {
  // Simulating media rating
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
  // Simulating script update
  console.log(`Updating script ${scriptId}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
}

export async function updateCalendarCompletion(date: string, completed: boolean): Promise<boolean> {
  // Simulating calendar completion status update
  console.log(`Updating event from ${date} to ${completed ? 'completed' : 'pending'}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function getCalendarSuggestions(): Promise<CalendarSuggestion[]> {
  // Simulating getting calendar suggestions
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
      date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
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
  // Simulating search for media items
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      title: 'Adella Laser Demonstration',
      description: 'Video demonstrating the use of Adella Laser equipment',
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
      description: 'Impressive results with Hipro equipment',
      type: 'image',
      thumbnailUrl: 'https://picsum.photos/seed/hipro/300/200',
      isFavorite: false,
      rating: 5,
      equipment: ['Hipro'],
      purpose: ['Before and after', 'Results'],
      bodyArea: 'Abdomen'
    }
  ];
}

export async function getScriptHistory(): Promise<ScriptHistoryItem[]> {
  // Simulating getting script history
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
