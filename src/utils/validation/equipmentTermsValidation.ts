// P1-002: Validação de termos proibidos nos equipamentos
export const PROHIBITED_TERMS = ['criofrequência', 'criofrequencia'];

export const validateEquipmentTerms = (text: string): string[] => {
  const errors: string[] = [];
  const lowerText = text.toLowerCase();
  
  PROHIBITED_TERMS.forEach(term => {
    if (lowerText.includes(term)) {
      errors.push(`Termo proibido encontrado: "${term}"`);
    }
  });
  
  return errors;
};

export const sanitizeEquipmentText = (text: string): string => {
  let sanitized = text;
  
  PROHIBITED_TERMS.forEach(term => {
    const regex = new RegExp(term, 'gi');
    sanitized = sanitized.replace(regex, '[TERMO_REMOVIDO]');
  });
  
  return sanitized;
};