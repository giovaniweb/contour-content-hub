// Types for MEGA CÉREBRO system
export type IntentType = 
  | 'script_generation'
  | 'learning'
  | 'equipment_consultation'
  | 'video_search'
  | 'performance_analysis'
  | 'general_consultation'
  | 'academy_question'
  | 'scientific_research';

export interface DetectedIntent {
  type: IntentType;
  confidence: number;
  keywords: string[];
  context?: any;
}

export interface ModuleResponse {
  content: string;
  metadata?: {
    equipmentUsed?: number;
    articlesConsulted?: number;
    videosFound?: number;
    coursesRecommended?: number;
    scriptsGenerated?: number;
  };
  suggestedActions?: SuggestedAction[];
}

export interface SuggestedAction {
  type: 'watch_video' | 'take_course' | 'generate_script' | 'view_equipment' | 'read_article';
  label: string;
  data: any;
}

export interface MegaCerebroConfig {
  enabledModules: IntentType[];
  userContext: UserContext;
  modelTier: 'standard' | 'gpt5';
}

export interface UserContext {
  profile?: string;
  specialty?: string;
  preferences?: any;
  history?: any[];
  equipmentAccess?: string[];
}

export interface SpecializedModule {
  name: string;
  description: string;
  icon: string;
  intentTypes: IntentType[];
  systemPrompt: string;
}