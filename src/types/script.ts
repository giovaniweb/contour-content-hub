
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
  type: 'videoScript' | 'bigIdea' | 'dailySales';
  createdAt: string;
  suggestedVideos: any[];
  captionTips: any[];
  equipment?: string;
  marketingObjective?: MarketingObjectiveType;
  pdf_url?: string; // Adding for compatibility with ScriptCard
}
