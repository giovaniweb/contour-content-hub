
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
  equipment?: string[];
  purpose?: string[];
  duration?: string;
  fecha_criacao?: string;
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
}

export interface CalendarPreferences {
  frequency: "daily" | "weekly" | "custom";
  topics: string[];
  equipment: string[];
  autoGenerate: boolean;
}

export async function generatePDF(scriptId: string): Promise<string> {
  // Simulação de geração de PDF
  console.log(`Gerando PDF para o roteiro ${scriptId}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Em um caso real, isso seria uma URL para o arquivo PDF gerado
  return `https://example.com/scripts/${scriptId}.pdf`;
}

export async function linkScriptToCalendar(scriptId: string, calendarEventId: string): Promise<boolean> {
  // Simulação de link entre roteiro e evento de calendário
  console.log(`Vinculando roteiro ${scriptId} ao evento ${calendarEventId}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Em um caso real, aqui seria feito o vínculo no banco de dados
  return true;
}

export async function toggleFavorite(mediaId: string): Promise<boolean> {
  // Simulação de alternância de favorito
  console.log(`Alternando favorito para mídia ${mediaId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function rateMedia(mediaId: string, rating: number): Promise<boolean> {
  // Simulação de avaliação de mídia
  console.log(`Avaliando mídia ${mediaId} com ${rating} estrelas`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function updateScript(
  scriptId: string, 
  content: string, 
  observation?: string, 
  status?: "aprovado" | "editado" | "gerado"
): Promise<boolean> {
  // Simulação de atualização de roteiro
  console.log(`Atualizando roteiro ${scriptId}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
}

export async function updateCalendarCompletion(date: string, completed: boolean): Promise<boolean> {
  // Simulação de atualização do status de conclusão do calendário
  console.log(`Atualizando evento de ${date} para ${completed ? 'concluído' : 'pendente'}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function getCalendarSuggestions(): Promise<CalendarSuggestion[]> {
  // Simulação de obtenção de sugestões do calendário
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      date: new Date().toISOString(),
      title: 'Vídeo sobre tratamento facial',
      description: 'Falar sobre os benefícios do tratamento facial com Adella Laser',
      format: 'video',
      equipment: 'Adella Laser',
      hook: 'Você sabia que é possível rejuvenescer a pele sem procedimentos invasivos?',
      caption: 'Conheça o Adella Laser, a tecnologia que revoluciona o tratamento facial!',
      completed: false
    },
    {
      id: '2',
      date: new Date(Date.now() + 86400000).toISOString(), // amanhã
      title: 'Story sobre resultados',
      description: 'Compartilhar resultados reais de clientes que usaram o Hipro',
      format: 'story',
      equipment: 'Hipro',
      completed: false
    }
  ];
}

export async function getMediaItems(filters?: any): Promise<MediaItem[]> {
  // Simulação de busca de itens de mídia
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      title: 'Demonstração Adella Laser',
      description: 'Vídeo demonstrando o uso do equipamento Adella Laser',
      type: 'video_pronto',
      thumbnailUrl: 'https://picsum.photos/seed/adella/300/200',
      videoUrl: 'https://example.com/videos/adella-demo',
      isFavorite: true,
      rating: 4.5,
      equipment: ['Adella Laser'],
      purpose: ['Demonstração', 'Tutorial'],
      duration: '3:45'
    },
    {
      id: '2',
      title: 'Antes e depois - Hipro',
      description: 'Resultados impressionantes com o equipamento Hipro',
      type: 'image',
      thumbnailUrl: 'https://picsum.photos/seed/hipro/300/200',
      isFavorite: false,
      rating: 5,
      equipment: ['Hipro'],
      purpose: ['Antes e depois', 'Resultados']
    }
  ];
}

export async function getScriptHistory(): Promise<ScriptHistoryItem[]> {
  // Simulação de obtenção do histórico de roteiros
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      title: 'Benefícios do Adella Laser',
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
      title: 'Campanha Hipro Verão',
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
  console.log('Limpando planejamento de calendário');
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function approvePlanning(): Promise<boolean> {
  console.log('Aprovando planejamento de calendário');
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}

export async function setCalendarPreferences(prefs: CalendarPreferences): Promise<boolean> {
  console.log('Salvando preferências de calendário', prefs);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
}
