
export type MarketingObjectiveType = 
  | '🟡 Atrair Atenção'
  | '🟢 Criar Conexão'
  | '🔴 Fazer Comprar'
  | '🔁 Reativar Interesse'
  | '✅ Fechar Agora'
  | string; // Mantendo string para compatibilidade, mas idealmente deveria ser apenas os tipos específicos

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
  pdf_url?: string; // Adicionando para compatibilidade com ScriptCard
}
