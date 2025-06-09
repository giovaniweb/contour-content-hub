
export interface ContentSuggestion {
  id: string;
  title: string;
  description: string;
  format: 'vídeo' | 'reels' | 'carrossel' | 'story';
  objective: string;
  equipment?: string;
  estimatedTime: string;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
}
