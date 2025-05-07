
export interface GptConfig {
  id: string;
  nome: string;
  tipo: 'roteiro' | 'big_idea' | 'story';
  modelo: string;
  chave_api: string;
  ativo: boolean;
  data_configuracao: string;
}

export interface DropboxConfig {
  id?: string;
  token: string;
  pasta_padrao: string;
  link_base?: string;
  data_configuracao?: string;
}

export interface VimeoConfig {
  id?: string;
  access_token: string;
  folder_id?: string;
  data_configuracao?: string;
}

export interface IntegrationConfig {
  id: string;
  tipo: 'vimeo' | 'dropbox' | 'gpt';
  config: VimeoConfig | DropboxConfig | any;
  criado_em: string;
  atualizado_em: string;
}

export type IntegrationStatus = 'integrated' | 'not_configured' | 'error';
