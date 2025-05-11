
export interface DbPerfil {
  id: string;
  nome?: string;
  email: string;
  role: string;
  cidade?: string;
  clinica?: string;
  telefone?: string;
  foto_url?: string;
  data_criacao?: string;
  equipamentos?: string[];
  idioma?: string;
  observacoes_conteudo?: string;
}

export interface DbWorkspace {
  id: string;
  nome: string;
  plano: string;
  criado_em: string;
}

export interface DbInvite {
  id: string;
  email_convidado: string;
  role_sugerido: string;
  status: string;
  criado_em: string;
  workspace_id: string;
  atualizado_em?: string;
}

export interface DbUserProfile {
  user_id: string;
  estilo_preferido?: string;
  foco_comunicacao?: string;
  tipos_conteudo_validados?: string[];
  perfil_comportamental?: string[];
  insights_performance?: string[];
  atualizado_em?: string;
}

export interface WorkspaceUser {
  id: string;
  nome: string;
  email: string;
  role: string;
  last_sign_in_at?: string | null;
}
