export interface DbPerfil {
  id: string;
  nome?: string;
  email: string;
  role: string;
  workspace_id?: string;
  // ... other fields that might be in the database but we don't use in the frontend
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
