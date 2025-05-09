
// Define the Equipment interface that includes all possible properties
export interface Equipment {
  id: string;
  nome: string;
  tecnologia: string;
  efeito: string;
  beneficios: string;
  diferenciais: string;
  indicacoes: string[] | string; // Allow both string[] and string to handle both formats
  linguagem: string;
  data_cadastro: string;
  image_url: string;
  ativo: boolean;
  descricao?: string; // Optional
  categoria?: string; // Optional
}

// Interface for creating new equipment
export interface EquipmentCreationProps {
  nome: string;
  tecnologia: string;
  indicacoes: string[] | string;
  beneficios: string;
  diferenciais: string;
  linguagem: string;
  image_url?: string;
  ativo?: boolean;
  efeito?: string;
  descricao?: string;
  categoria?: string;
}

// Validation error interface
export interface ValidationErrors {
  nome?: string;
  tecnologia?: string;
  indicacoes?: string;
  beneficios?: string;
  diferenciais?: string;
  linguagem?: string;
  efeito?: string;
  [key: string]: string | undefined;
}

// Helper function to ensure Equipment objects have all required properties
export function ensureEquipmentFields(equipment: Partial<Equipment>): Equipment {
  return {
    id: equipment.id || '',
    nome: equipment.nome || '',
    tecnologia: equipment.tecnologia || '',
    efeito: equipment.efeito || '',
    beneficios: equipment.beneficios || '',
    diferenciais: equipment.diferenciais || '',
    indicacoes: equipment.indicacoes || '',
    linguagem: equipment.linguagem || '',
    data_cadastro: equipment.data_cadastro || new Date().toISOString(),
    image_url: equipment.image_url || '',
    ativo: equipment.ativo ?? true,
    descricao: equipment.descricao || '',
    categoria: equipment.categoria || '',
  };
}

// Helper function to convert string to array
export function convertStringToArray(str: string | string[]): string[] {
  if (Array.isArray(str)) return str;
  if (!str) return [];
  
  // Try to parse if it's a JSON string
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // Not a JSON string, continue with split
  }
  
  // Split by common delimiters (semicolons, commas, or line breaks)
  return str
    .split(/[;,\n]/)
    .map(item => item.trim())
    .filter(Boolean);
}

// Validation functions
export function validateEquipment(equipment: Partial<Equipment>): ValidationErrors {
  const errors: ValidationErrors = {};
  
  if (!equipment.nome || equipment.nome.trim() === '') {
    errors.nome = "Nome é obrigatório";
  }
  
  if (!equipment.tecnologia || equipment.tecnologia.trim() === '') {
    errors.tecnologia = "Tecnologia é obrigatória";
  }
  
  if (!equipment.beneficios || equipment.beneficios.trim() === '') {
    errors.beneficios = "Benefícios são obrigatórios";
  }
  
  if (!equipment.diferenciais || equipment.diferenciais.trim() === '') {
    errors.diferenciais = "Diferenciais são obrigatórios";
  }
  
  return errors;
}

// Check if validation errors exist
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

// Draft management functions
const EQUIPMENT_DRAFT_KEY = 'equipment_draft';

interface EquipmentDraft {
  data: Partial<Equipment>;
  timestamp: string;
}

export function saveEquipmentDraft(equipment: Partial<Equipment>): void {
  const draft: EquipmentDraft = {
    data: equipment,
    timestamp: new Date().toISOString()
  };
  
  try {
    localStorage.setItem(EQUIPMENT_DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error('Error saving equipment draft:', error);
  }
}

export function getEquipmentDraft(): EquipmentDraft | null {
  try {
    const draftJson = localStorage.getItem(EQUIPMENT_DRAFT_KEY);
    if (!draftJson) return null;
    
    return JSON.parse(draftJson) as EquipmentDraft;
  } catch (error) {
    console.error('Error retrieving equipment draft:', error);
    return null;
  }
}

export function clearEquipmentDraft(): void {
  try {
    localStorage.removeItem(EQUIPMENT_DRAFT_KEY);
  } catch (error) {
    console.error('Error clearing equipment draft:', error);
  }
}
