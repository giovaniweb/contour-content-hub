// Interfaces correspondentes às tabelas do banco de dados Supabase

export interface Perfil {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cidade?: string;
  clinica?: string;
  idioma: string;
  equipamentos: string[];
  foto_url?: string;
  data_criacao: string;
  role: 'cliente' | 'admin' | 'operador';
}

export interface Roteiro {
  id: string;
  usuario_id: string;
  tipo: string;
  titulo: string;
  conteudo: string;
  status: 'gerado' | 'aprovado' | 'editado';
  observacoes?: string;
  data_criacao: string;
}

export interface Video {
  id: string;
  titulo: string;
  descricao?: string;
  equipamento: string;
  area_corpo: string;
  finalidade: string;
  url_video?: string;
  preview_url?: string;
  tipo: 'video' | 'raw' | 'image';
  duracao?: string;
  data_upload: string;
}

export interface Favorito {
  id: string;
  usuario_id: string;
  video_id: string;
  data_favorito: string;
}

export interface Avaliacao {
  id: string;
  usuario_id: string;
  video_id: string;
  nota: number;
  comentario?: string;
  data_avaliacao: string;
}

export interface Material {
  id: string;
  nome: string;
  tipo: string;
  preview_url?: string;
  arquivo_url?: string;
  data_upload: string;
}

export interface AgendaItem {
  id: string;
  usuario_id: string;
  data: string;
  titulo: string;
  tipo: string;
  descricao?: string;
  roteiro_id?: string;
  status: 'pendente' | 'concluido';
  data_criacao: string;
}

export interface AlertaEmail {
  id: string;
  usuario_id: string;
  tipo: string;
  ativo: boolean;
  ultima_execucao?: string;
  data_criacao: string;
}

export interface GptConfig {
  id: string;
  nome: string;
  tipo: string;
  modelo: string;
  prompt?: string;
  ativo: boolean;
  data_configuracao: string;
}

export interface LogUso {
  id: string;
  usuario_id: string;
  acao: string;
  detalhe?: string;
  data_log: string;
}
