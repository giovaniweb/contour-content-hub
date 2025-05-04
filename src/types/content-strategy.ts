
export interface ContentStrategyItem {
  id: string;
  linha: string | null;
  equipamento_id: string | null;
  equipamento_nome?: string; // For UI display
  categoria: ContentCategory;
  formato: ContentFormat;
  responsavel_id: string | null;
  responsavel_nome?: string; // For UI display
  previsao: string | null;
  conteudo: string | null;
  objetivo: ContentObjective;
  prioridade: ContentPriority;
  status: ContentStatus;
  impedimento: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export type ContentCategory = 
  | 'branding'
  | 'vendas'
  | 'educativo'
  | 'informativo'
  | 'engajamento'
  | 'produto'
  | 'outro';

export type ContentFormat = 
  | 'story'
  | 'vídeo'
  | 'layout'
  | 'carrossel'
  | 'reels'
  | 'texto'
  | 'outro';

export type ContentObjective = 
  | 'engajar'
  | 'vender'
  | 'educar'
  | 'informar'
  | 'converter'
  | 'construir autoridade'
  | 'outro';

export type ContentPriority = 
  | 'Alta'
  | 'Média'
  | 'Baixa';

export type ContentStatus = 
  | 'Planejado'
  | 'Em andamento'
  | 'Finalizado'
  | 'Standby'
  | 'Suspenso';

export interface ContentStrategyFilter {
  linha?: string;
  equipamento_id?: string;
  categoria?: ContentCategory;
  formato?: ContentFormat;
  responsavel_id?: string;
  objetivo?: ContentObjective;
  prioridade?: ContentPriority;
  status?: ContentStatus;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}
