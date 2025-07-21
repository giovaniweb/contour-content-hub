export type ProfessionalType = 'videomaker' | 'storymaker';
export type InvestmentRange = '300-500' | '500-800' | '800-1000' | '1000-1200' | 'acima-1200';

export interface Videomaker {
  id: string;
  user_id: string;
  nome_completo: string;
  telefone: string;
  video_referencia_url?: string;
  instagram?: string;
  cidade: string;
  tipo_profissional: ProfessionalType;
  foto_url?: string;
  
  // Equipamentos
  camera_celular: string;
  modelo_microfone?: string;
  possui_iluminacao: boolean;
  emite_nota_fiscal: boolean;
  
  // Investimento
  valor_diaria: InvestmentRange;
  
  // Avaliações
  media_avaliacao: number;
  total_avaliacoes: number;
  
  // Metadados
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideomakerFormData {
  nome_completo: string;
  telefone: string;
  video_referencia_url?: string;
  instagram?: string;
  cidade: string;
  tipo_profissional: ProfessionalType;
  camera_celular: string;
  modelo_microfone?: string;
  possui_iluminacao: boolean;
  emite_nota_fiscal: boolean;
  valor_diaria: InvestmentRange;
  foto_url?: string;
}

export interface VideomakerAvaliacao {
  id: string;
  videomaker_id: string;
  avaliador_id: string;
  nota: number;
  comentario?: string;
  created_at: string;
  updated_at: string;
}