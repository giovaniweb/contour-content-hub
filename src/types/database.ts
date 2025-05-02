
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
  observacoes_conteudo?: string;
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
  descricao_curta?: string;
  descricao_detalhada?: string;
  equipamentos: string[];
  area_corpo: string;
  finalidade: string[];
  url_video?: string;
  preview_url?: string;
  tipo_video: 'video_pronto' | 'take';
  duracao?: string;
  data_upload: string;
  tags?: string[];
  curtidas?: number;
  compartilhamentos?: number;
  favoritos_count?: number;
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
  categoria?: string;
  tags?: string[];
}

export interface AgendaItem {
  id: string;
  usuario_id: string;
  data: string;
  titulo: string;
  tipo: string;
  descricao?: string;
  roteiro_id?: string;
  status: 'pendente' | 'concluido' | 'aprovado';
  data_criacao: string;
  equipamento?: string;
  objetivo?: string;
  formato?: string;
  gancho?: string;
  legenda?: string;
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
  chave_api?: string;
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

export interface DropboxConfig {
  id?: string;
  token: string;
  pasta_padrao: string;
  link_base?: string;
  data_configuracao?: string;
}

export type IntegrationStatus = 'integrated' | 'not_configured' | 'error';
