
export interface Equipment {
  id: string;
  nome: string;
  tecnologia: string;
  indicacoes: string[] | string;
  beneficios: string;
  diferenciais: string;
  linguagem: string;
  ativo: boolean;
  image_url?: string;
  efeito?: string;
  data_cadastro?: string;
}

export interface EquipmentCreationProps {
  nome: string;
  tecnologia: string;
  indicacoes: string[] | string;
  beneficios: string;
  diferenciais: string;
  linguagem: string;
  ativo?: boolean;
  image_url?: string;
  efeito?: string;
}

// Added EquipmentValidation interface to fix missing export error
export interface EquipmentValidation {
  [key: string]: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Helper to validate equipment data
export const validateEquipment = (data: Equipment | EquipmentCreationProps): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.nome || data.nome.trim().length < 2) {
    errors.nome = 'Nome é obrigatório e deve ter pelo menos 2 caracteres';
  }

  if (!data.tecnologia || data.tecnologia.trim().length < 2) {
    errors.tecnologia = 'A tecnologia é obrigatória e deve ter pelo menos 2 caracteres';
  }

  return errors;
};

// Helper to check if validation errors exist
export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// Helper to save equipment draft to localStorage
export const saveEquipmentDraft = (data: Partial<Equipment>): void => {
  const draft = {
    data,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem('equipment_draft', JSON.stringify(draft));
};

// Helper to get equipment draft from localStorage
export const getEquipmentDraft = (): { data: Partial<Equipment>; timestamp: string } | null => {
  const draftString = localStorage.getItem('equipment_draft');
  if (!draftString) return null;
  
  try {
    return JSON.parse(draftString);
  } catch (error) {
    return null;
  }
};

// Helper to clear equipment draft from localStorage
export const clearEquipmentDraft = (): void => {
  localStorage.removeItem('equipment_draft');
};

// Helper to convert string to array
export const convertStringToArray = (value: string | string[]): string[] => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  
  // Split by semicolons or new lines
  return value
    .split(/[;\n]/)
    .map(item => item.trim())
    .filter(Boolean);
};
