
import { MarketingObjectiveType } from './script';

export interface FormData {
  idea: string;
  objective: 'emotion' | 'sales';
  audience?: string;
  theme?: string;
}

export interface GeneratedScript {
  title: string;
  opening: string;
  body: string;
  closing: string;
  visualSuggestion: string;
  duration: string;
  finalPhrase: string;
  initialScore: number;
  refinedScript: string;
  finalScore: number;
}

export interface ScriptGeneratorState {
  ideaText?: string;
  objective?: MarketingObjectiveType;
  validatedIdea?: {
    topic: string;
    validationScore: number;
  };
}

export interface ScriptResponse {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  equipment?: string;
  objective?: MarketingObjectiveType;
  suggestedVideos: any[];
  status?: string;
  pdf_url?: string;
  type?: string;
  marketingObjective?: MarketingObjectiveType;
  captionTips?: string[];
}
