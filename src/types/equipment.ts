
/**
 * Types for equipment
 */

export interface Equipment {
  id: string;
  nome: string;
  efeito?: string;
  beneficios: string;
  tecnologia: string;
  fabricante?: string;
  site?: string;
  ativo: boolean;
  categoria?: string;
  modelo?: string;
  pais_origem?: string;
  reg_anvisa?: string;
  classificacao?: string;
  ano_lancamento?: string;
  garantia?: string;
  parametros?: string;
  protocolos?: string;
  indicacoes: string[] | string;
  contraindicacoes?: string[];
  caracteristicas?: string[];
  beneficios_lista?: string[];
  areas_corpo?: string[];
  image_url?: string;
  data_cadastro?: string;
  diferenciais: string;
  linguagem: string;
}

// Interface for equipment search filters
export interface EquipmentFilters {
  searchTerm?: string;
  status?: 'active' | 'inactive' | 'all';
  category?: string;
  technology?: string;
}

// Interface for equipment creation objects
export interface EquipmentCreationProps {
  nome: string;
  efeito?: string;
  tecnologia: string;
  indicacoes: string[] | string;
  beneficios: string;
  diferenciais: string;
  linguagem: string;
  image_url?: string;
  ativo: boolean;
  [key: string]: any;
}

// Interface for equipment validation
export interface EquipmentValidation {
  nome?: string;
  tecnologia?: string;
  indicacoes?: string;
  beneficios?: string;
  diferenciais?: string;
  linguagem?: string;
  efeito?: string;
  [key: string]: string | undefined;
}

// Validation functions
export const validateEquipment = (equipment: Partial<Equipment> | EquipmentCreationProps): EquipmentValidation => {
  const errors: EquipmentValidation = {};
  
  if (!equipment.nome || equipment.nome.trim() === '') {
    errors.nome = "O nome do equipamento é obrigatório";
  }
  
  if (!equipment.tecnologia || equipment.tecnologia.trim() === '') {
    errors.tecnologia = "A tecnologia do equipamento é obrigatória";
  }
  
  if (!equipment.indicacoes || (typeof equipment.indicacoes === 'string' ? equipment.indicacoes.trim() === '' : equipment.indicacoes.length === 0)) {
    errors.indicacoes = "As indicações do equipamento são obrigatórias";
  }
  
  if (!equipment.beneficios || equipment.beneficios.toString().trim() === '') {
    errors.beneficios = "Os benefícios do equipamento são obrigatórios";
  }
  
  if (!equipment.diferenciais || equipment.diferenciais.toString().trim() === '') {
    errors.diferenciais = "Os diferenciais do equipamento são obrigatórios";
  }
  
  if (!equipment.linguagem || equipment.linguagem.toString().trim() === '') {
    errors.linguagem = "A linguagem recomendada é obrigatória";
  }
  
  return errors;
};

export const hasValidationErrors = (errors: EquipmentValidation): boolean => {
  return Object.keys(errors).length > 0;
};

// Interfaces and functions for drafts
interface EquipmentDraft {
  data: Partial<Equipment> | EquipmentCreationProps;
  timestamp: string;
}

// Save draft to localStorage
export const saveEquipmentDraft = (equipment: Partial<Equipment> | EquipmentCreationProps): void => {
  const draft: EquipmentDraft = {
    data: equipment,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('equipment_draft', JSON.stringify(draft));
};

// Get draft from localStorage
export const getEquipmentDraft = (): EquipmentDraft | null => {
  const draft = localStorage.getItem('equipment_draft');
  return draft ? JSON.parse(draft) : null;
};

// Clear draft from localStorage
export const clearEquipmentDraft = (): void => {
  localStorage.removeItem('equipment_draft');
};

// Helper function to convert string to array when needed
export const convertStringToArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(',').map(item => item.trim()).filter(Boolean);
};
