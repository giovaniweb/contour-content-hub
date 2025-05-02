
export interface Equipment {
  id: string;
  nome: string;
  tecnologia: string;
  beneficios: string;
  indicacoes: string;
  diferenciais: string;
  image_url?: string;
  ativo: boolean;
  data_cadastro: string;
  linguagem?: string;
}

export interface EquipmentResponse {
  data: Equipment[] | null;
  error: any;
}

export interface EquipmentCreationProps {
  nome: string;
  tecnologia: string;
  beneficios: string;
  indicacoes: string;
  diferenciais: string;
  image_url?: string;
  linguagem: string;
  ativo?: boolean;
}

export interface EquipmentUpdateProps {
  id: string;
  nome?: string;
  tecnologia?: string;
  beneficios?: string;
  indicacoes?: string;
  diferenciais?: string;
  image_url?: string;
  linguagem?: string;
  ativo?: boolean;
}
