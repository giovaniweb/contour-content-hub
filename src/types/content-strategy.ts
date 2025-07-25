
export interface ContentStrategyItem {
  id: string;
  equipamento_id: string | null;
  equipamento_nome?: string; // For UI display
  categoria: ContentCategory;
  formato: ContentFormat;
  responsavel_id: string | null;
  responsavel_nome?: string; // For UI display
  previsao: string | null;
  conteudo: string | null;
  objetivo: ContentObjective;
  status: ContentStatus;
  distribuicao: ContentDistribution; // Field for distribution platform
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
  | '🟡 Atrair Atenção'
  | '🟢 Criar Conexão'
  | '🔴 Fazer Comprar'
  | '🔁 Reativar Interesse'
  | '✅ Fechar Agora';

export type ContentStatus = 
  | 'Planejado'
  | 'Em andamento'
  | 'Finalizado'
  | 'Standby'
  | 'Suspenso';

export type ContentDistribution =
  | 'Instagram'
  | 'YouTube'
  | 'TikTok'
  | 'Blog'
  | 'Múltiplos'
  | 'Outro';

export interface ContentStrategyFilter {
  equipamento_id?: string;
  categoria?: ContentCategory;
  formato?: ContentFormat;
  responsavel_id?: string;
  objetivo?: ContentObjective;
  status?: ContentStatus;
  distribuicao?: ContentDistribution;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}
