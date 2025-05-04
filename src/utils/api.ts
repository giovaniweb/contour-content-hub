
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
  pdf_url?: string;
  evento_agenda_id?: string;
  equipment?: string;
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
  shortDescription?: string;
  description?: string; // Added to fix errors in MediaLibrary.tsx
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

// Export functions from other files to centralize API access
export { 
  getScriptHistory,
  getScriptById, 
  updateScript,
  generateScriptPDF as generatePDF,
  linkScriptToCalendar
} from '@/utils/api-scripts';

export {
  toggleFavorite,
  rateMedia,
  getMediaItems,
  updateUserPreferences,
  saveEmailAlertPreferences,
  getCalendarSuggestions,
  updateCalendarCompletion,
  clearCalendarPlanning as clearPlanning,
  approveCalendarPlanning as approvePlanning,
  updateCalendarPreferences as setCalendarPreferences
} from '@/services/supabaseService';

export type { ScriptHistoryItem } from '@/utils/api-scripts';

// Re-export validation types and functions
export { validateScript } from '@/utils/validation/api';
