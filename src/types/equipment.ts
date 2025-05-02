
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
  efeito?: string;
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
  efeito?: string;
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
  efeito?: string;
}

// Validation interface
export interface EquipmentValidation {
  nome?: string;
  tecnologia?: string;
  beneficios?: string;
  indicacoes?: string;
  diferenciais?: string;
  linguagem?: string;
  efeito?: string;
  [key: string]: string | undefined;
}

// Equipment validation function
export function validateEquipment(equipment: Partial<Equipment>): EquipmentValidation {
  const errors: EquipmentValidation = {};
  
  if (!equipment.nome || equipment.nome.trim() === '') {
    errors.nome = "Nome do equipamento é obrigatório";
  }
  
  if (!equipment.tecnologia || equipment.tecnologia.trim() === '') {
    errors.tecnologia = "Tecnologia é obrigatória";
  }
  
  if (!equipment.beneficios || equipment.beneficios.trim() === '') {
    errors.beneficios = "Benefícios são obrigatórios";
  }
  
  if (!equipment.indicacoes || equipment.indicacoes.trim() === '') {
    errors.indicacoes = "Indicações são obrigatórias";
  }
  
  if (!equipment.diferenciais || equipment.diferenciais.trim() === '') {
    errors.diferenciais = "Diferenciais são obrigatórios";
  }
  
  if (!equipment.linguagem || equipment.linguagem.trim() === '') {
    errors.linguagem = "Linguagem recomendada é obrigatória";
  }
  
  return errors;
}

// Helper function to check if validation has errors
export function hasValidationErrors(validation: EquipmentValidation): boolean {
  return Object.keys(validation).length > 0;
}
