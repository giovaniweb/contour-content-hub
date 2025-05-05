
import { ValidationResult } from "@/utils/validation/types";

export type MarketingObjectiveType = 
  | '🟡 Atrair Atenção'
  | '🟢 Criar Conexão'
  | '🔴 Fazer Comprar'
  | '🔁 Reativar Interesse'
  | '✅ Fechar Agora'
  | string; // Maintaining string for compatibility, but ideally should be just the specific types

export interface ScriptResponse {
  id: string;
  title: string;
  content: string;
  type: 'videoScript' | 'bigIdea' | 'dailySales' | 'reelsScript';
  createdAt: string;
  suggestedVideos: any[];
  captionTips: any[];
  equipment?: string;
  marketingObjective?: MarketingObjectiveType;
  pdf_url?: string;
  validationScore?: number;
  validationMetrics?: {
    hookScore?: number;
    clarityScore?: number;
    ctaScore?: number;
    emotionalScore?: number;
  };
  validationResult?: ValidationResult;
  improvementSuggestions?: string[];
}
