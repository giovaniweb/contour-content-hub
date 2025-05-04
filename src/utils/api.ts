
// Define common types used across the application

// Types for marketing objectives
export type MarketingObjectiveType = 
  | "atrair_atencao" 
  | "criar_conexao" 
  | "fazer_comprar" 
  | "reativar_interesse" 
  | "fechar_agora";

// Types for script generation
export type ScriptType = "videoScript" | "dailySales" | "bigIdea";

export interface ScriptRequest {
  title: string;
  type: ScriptType;
  equipment?: string;
  audience?: string;
  purpose?: string;
  length?: string;
  tone?: string;
  extraInstructions?: string;
}

export interface ScriptResponse {
  id: string;
  content: string;
  title: string;
  type: ScriptType;
  createdAt: string;
  suggestedVideos: MediaItem[];
  captionTips: string[];
}

// Types for media library
export interface MediaItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  type: 'video_pronto' | 'take' | 'image';
  equipment: string[];
  bodyArea: string[];
  purpose: string[];
  duration?: string;
  rating?: number;
  isFavorite?: boolean;
}

// Calendar types
export interface CalendarSuggestion {
  date: string;
  title: string;
  description: string;
  format: "video" | "story" | "image";
  completed: boolean;
  equipment?: string;
  purpose?: string;
  hook?: string;
  caption?: string;
  type?: ScriptType;
  evento_agenda_id?: string;
}

export interface CalendarPreferences {
  frequency: number;
  formats: Array<"video" | "story" | "image">;
  equipment?: string;
  purpose?: string;
}
