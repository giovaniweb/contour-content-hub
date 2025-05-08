
export interface Topic {
  id: string;
  title: string;
  score: number;
  content?: string;
  tags: string[];
  category: string;
  equipment?: string;
}

export interface ScriptResponse {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  suggestedVideos: any[];
  captionTips: string[];
  equipment?: string;
  [key: string]: any;
}
