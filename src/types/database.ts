export interface VimeoConfig {
  folder_id?: string;
}

export interface IntegrationConfig {
  id?: string;
  tipo: string;
  config: any;
  criado_em?: string;
  atualizado_em?: string;
}

export interface GptConfig {
  id: string;
  nome: string;
  chave_api: string;
  modelo: string;
  prompt: string;
  tipo: string;
  ativo: boolean;
  data_configuracao: string;
}

export interface DropboxConfig {
  id?: string;
  token: string;
  pasta_padrao: string;
  link_base?: string;
}

export type IntegrationStatus = 'integrated' | 'not_configured' | 'error';
