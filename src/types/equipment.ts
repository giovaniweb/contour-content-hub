
export interface Equipment {
  id?: string;
  nome: string;
  tecnologia: string;
  indicacoes: string;
  beneficios: string;
  diferenciais: string;
  linguagem: string;
  ativo?: boolean;
  data_cadastro?: string;
  image_url?: string;
}

export interface EquipmentValidation {
  nome?: string;
  tecnologia?: string;
  indicacoes?: string;
  beneficios?: string;
  diferenciais?: string;
  linguagem?: string;
  image_url?: string;
}

export const validateEquipment = (equipment: Partial<Equipment>): EquipmentValidation => {
  const errors: EquipmentValidation = {};
  
  if (!equipment.nome || equipment.nome.trim() === '') {
    errors.nome = 'Nome do equipamento é obrigatório';
  }
  
  if (!equipment.tecnologia || equipment.tecnologia.trim() === '') {
    errors.tecnologia = 'Tecnologia é obrigatória';
  }
  
  if (!equipment.indicacoes || equipment.indicacoes.trim() === '') {
    errors.indicacoes = 'Indicações são obrigatórias';
  }
  
  if (!equipment.beneficios || equipment.beneficios.trim() === '') {
    errors.beneficios = 'Benefícios são obrigatórios';
  }
  
  if (!equipment.diferenciais || equipment.diferenciais.trim() === '') {
    errors.diferenciais = 'Diferenciais são obrigatórios';
  }
  
  if (!equipment.linguagem || equipment.linguagem.trim() === '') {
    errors.linguagem = 'Linguagem recomendada é obrigatória';
  }
  
  return errors;
};

export const hasValidationErrors = (validation: EquipmentValidation): boolean => {
  return Object.keys(validation).length > 0;
};
