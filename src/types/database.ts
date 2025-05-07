
export interface VimeoConfig {
  access_token: string;
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
