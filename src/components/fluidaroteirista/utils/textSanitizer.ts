
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
    .trim();
};

// CORREÇÃO: Sanitização menos agressiva para preservar estrutura de Stories
export const sanitizeScriptStructure = (text: string): string => {
  if (!text) return '';
  
  // Preservar estrutura de Stories numerados
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
    .replace(/\s+/g, ' ') // Apenas normalizar espaços excessivos
    .trim();
};

export const validateTextCleanliness = (text: string): boolean => {
  if (!text) return false;
  
  // Verificar se tem conteúdo mínimo
  const cleanText = text.trim();
  if (cleanText.length < 10) return false;
  
  // Verificar se não é só caracteres especiais
  const alphanumericCount = (cleanText.match(/[a-zA-Z0-9]/g) || []).length;
  return alphanumericCount > cleanText.length * 0.3;
};
