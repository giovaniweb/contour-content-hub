
export type MarketingObjectiveType = 
  | '🟡 Atrair Atenção'
  | '🟢 Criar Conexão'
  | '🔴 Fazer Comprar'
  | '🔁 Reativar Interesse'
  | '✅ Fechar Agora'
  | string;

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
}
