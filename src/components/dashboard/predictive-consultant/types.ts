
export interface Suggestion {
  id: string;
  title: string;
  message: string;
  type: 'equipment' | 'content' | 'strategy' | 'motivation';
  actionText: string;
  actionPath: string;
  isNew: boolean;
}
