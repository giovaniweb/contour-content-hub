
export type MarketingObjectiveType = 'emotion' | 'sales' | '🟡 Atrair Atenção' | '🟢 Criar Conexão' | '🔴 Fazer Comprar' | '🔁 Reativar Interesse' | '✅ Fechar Agora' | 'atrair_atencao' | 'criar_conexao' | 'fazer_comprar' | 'reativar_interesse' | 'fechar_agora';

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
  // Add missing properties
  pdf_url?: string;
  type?: string;
  marketingObjective?: MarketingObjectiveType;
  captionTips?: string[];
}
