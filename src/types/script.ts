
export interface ScriptResponse {
  id: string;
  title: string;
  content: string;
  type: 'videoScript' | 'bigIdea' | 'dailySales';
  createdAt: string;
  suggestedVideos: any[];
  captionTips: any[];
  equipment?: string;
  marketingObjective?: string;
}
