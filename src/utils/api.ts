
// Script types and interfaces

// Different script types
export type ScriptType = 'videoScript' | 'bigIdea' | 'dailySales';

// Marketing objective types
export type MarketingObjectiveType = 'atrair_atencao' | 'criar_conexao' | 'fazer_comprar' | 'reativar_interesse' | 'fechar_agora';

// Script request parameters
export interface ScriptRequest {
  type: ScriptType;
  topic: string;
  equipment?: string[];
  bodyArea?: string;
  purpose?: string[];
  additionalInfo?: string;
  tone?: string;
  language?: string;
  marketingObjective?: MarketingObjectiveType;
}

// Script response object
export interface ScriptResponse {
  id: string;
  title: string;
  content: string;
  type: ScriptType;
  createdAt: string;
  suggestedVideos?: MediaItem[];
  suggestedMusic?: {
    id: string;
    title: string;
    artist: string;
    url: string;
  }[];
  suggestedFonts?: {
    name: string;
    style: string;
  }[];
  captionTips?: string[];
  pdf_url?: string;
  evento_agenda_id?: string;
}

// Import the functions from Supabase service
import { 
  generateScript as generateScriptFromSupabase, 
  saveScriptFeedback as saveScriptFeedbackToSupabase,
  getMediaItems as getMediaItemsFromSupabase,
  toggleFavorite as toggleFavoriteInSupabase,
  rateMedia as rateMediaInSupabase,
  getCalendarSuggestions as getCalendarSuggestionsFromSupabase,
  updateCalendarCompletion as updateCalendarCompletionInSupabase,
  updateUserPreferences,
  saveEmailAlertPreferences,
  clearCalendarPlanning,
  approveCalendarPlanning,
  updateCalendarPreferences,
} from '@/services/supabaseService';

// Equipment API functions
import {
  getEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  importEquipments
} from './api-equipment';

// Script history API functions
import {
  getScriptHistory,
  getScriptById,
  updateScript,
  generateScriptPDF,
  linkScriptToCalendar
} from './api-scripts';

// Script validation API functions
import {
  validateScript,
  getValidation,
  getQualityIndicator
} from './ai-validation';

// Export interface ScriptHistoryItem from here instead of importing it
export interface ScriptHistoryItem {
  id: string;
  title: string;
  content: string;
  contentHtml: string;
  type: ScriptType;
  status: 'gerado' | 'aprovado' | 'editado';
  createdAt: string;
  marketingObjective?: string;
  observation?: string;
  pdf_url?: string;
  evento_agenda_id?: string;
}

// Export the Supabase functions
export const generateScript = generateScriptFromSupabase;
export const saveScriptFeedback = saveScriptFeedbackToSupabase;

// Export equipment API functions
export {
  getEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  importEquipments
};

// Export script history API functions
export {
  getScriptHistory,
  getScriptById,
  updateScript,
  generateScriptPDF,
  linkScriptToCalendar
};

// Export script validation API functions
export {
  validateScript,
  getValidation,
  getQualityIndicator
};

// Media library interfaces
export interface MediaItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl?: string;
  type: "video_pronto" | "take" | "image";
  equipment: string[];
  bodyArea: string[];
  purpose: string[];
  duration?: string;
  rating: number;
  isFavorite: boolean;
}

// Export other functions
export const getMediaItems = getMediaItemsFromSupabase;
export const toggleFavorite = toggleFavoriteInSupabase;
export const rateMedia = rateMediaInSupabase;

// Export file generation functions
export const generatePDF = generateScriptPDF;

// Calendar suggestion interface with enhanced fields
export interface CalendarSuggestion {
  date: string;
  title: string;
  type: ScriptType;
  description: string;
  completed: boolean;
  equipment?: string;
  purpose?: "educate" | "engage" | "sell";
  format?: "video" | "story" | "image";
  hook?: string;
  caption?: string;
  evento_agenda_id?: string;  // Adicionando ID do roteiro associado
}

// Calendar preferences interface
export interface CalendarPreferences {
  equipment?: string;
  contentTypes: {
    video: boolean;
    story: boolean;
    image: boolean;
  };
  frequency: 1 | 2 | 3;
}

// Export calendar functions
export const getCalendarSuggestions = getCalendarSuggestionsFromSupabase;
export const updateCalendarCompletion = updateCalendarCompletionInSupabase;
export const clearPlanning = clearCalendarPlanning;
export const approvePlanning = approveCalendarPlanning;
export const setCalendarPreferences = updateCalendarPreferences;

// Export user preference functions
export const saveUserPreferences = updateUserPreferences;
export const setEmailPreferences = saveEmailAlertPreferences;
