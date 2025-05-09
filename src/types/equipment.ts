
export interface Equipment {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  marca?: string;
  tecnologia?: string;
  beneficios?: string;
  diferenciais?: string;
  linguagem?: string;
  indicacoes: string[];
  ativo?: boolean;
  image_url?: string;
  data_cadastro?: string;
  efeito?: string;
}

export type EquipmentCreationProps = Omit<Equipment, "id" | "data_cadastro">;

export type EquipmentDraft = Partial<Equipment>;

export interface EquipmentFormProps {
  equipment?: EquipmentDraft;
  onSubmit: (data: EquipmentDraft) => void;
}

export type ValidationErrors = {
  [key: string]: string;
};

/**
 * Validates equipment data
 */
export const validateEquipment = (equipment: Partial<Equipment | EquipmentCreationProps>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!equipment.nome) {
    errors.nome = "O nome do equipamento é obrigatório";
  }

  if (!equipment.tecnologia) {
    errors.tecnologia = "A tecnologia do equipamento é obrigatória";
  }

  if (!equipment.indicacoes || (Array.isArray(equipment.indicacoes) && equipment.indicacoes.length === 0)) {
    errors.indicacoes = "Pelo menos uma indicação é obrigatória";
  }

  if (!equipment.beneficios) {
    errors.beneficios = "Os benefícios do equipamento são obrigatórios";
  }

  if (!equipment.diferenciais) {
    errors.diferenciais = "Os diferenciais do equipamento são obrigatórios";
  }

  if (!equipment.linguagem) {
    errors.linguagem = "A linguagem recomendada é obrigatória";
  }

  return errors;
};

/**
 * Checks if there are validation errors
 */
export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Saves equipment draft to local storage
 */
export const saveEquipmentDraft = (equipment: Partial<Equipment | EquipmentCreationProps>): void => {
  const draft = {
    data: equipment,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('equipment_draft', JSON.stringify(draft));
};

/**
 * Gets equipment draft from local storage
 */
export const getEquipmentDraft = (): { data: Partial<Equipment | EquipmentCreationProps>, timestamp: string } | null => {
  const draft = localStorage.getItem('equipment_draft');
  if (draft) {
    return JSON.parse(draft);
  }
  return null;
};

/**
 * Clears equipment draft from local storage
 */
export const clearEquipmentDraft = (): void => {
  localStorage.removeItem('equipment_draft');
};

/**
 * Convert string to array helper
 */
export const convertStringToArray = (input: string | string[] | undefined): string[] => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  
  // Try to parse if it's a JSON string
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // Not a JSON string, continue with split
  }
  
  // Split by common delimiters (semicolons, commas, or line breaks)
  return input
    .split(/[;,\n]/)
    .map(item => item.trim())
    .filter(Boolean);
};
