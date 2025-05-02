
// Script types and interfaces

// Different script types
export type ScriptType = 'videoScript' | 'bigIdea' | 'dailySales';

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
} from '@/services/supabaseService';

// Export the Supabase functions
export const generateScript = generateScriptFromSupabase;
export const saveScriptFeedback = saveScriptFeedbackToSupabase;

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
export const generatePDF = async (scriptId: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, this would generate and return a PDF URL
  return `/api/pdf/${scriptId}`;
};

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
}

// Export calendar functions
export const getCalendarSuggestions = getCalendarSuggestionsFromSupabase;
export const updateCalendarCompletion = updateCalendarCompletionInSupabase;

// Export user preference functions
export const saveUserPreferences = updateUserPreferences;
export const setEmailPreferences = saveEmailAlertPreferences;
