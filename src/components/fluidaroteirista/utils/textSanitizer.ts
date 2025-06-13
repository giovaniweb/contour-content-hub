
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

export const validateTextCleanliness = (text: string): { isClean: boolean; issues: string[] } => {
  if (!text) return { isClean: false, issues: ['Texto vazio'] };
  
  const issues: string[] = [];
  
  // Verificar se tem conteúdo mínimo
  const cleanText = text.trim();
  if (cleanText.length < 10) {
    issues.push('Texto muito curto (mínimo 10 caracteres)');
  }
  
  // Verificar se não é só caracteres especiais
  const alphanumericCount = (cleanText.match(/[a-zA-Z0-9]/g) || []).length;
  if (alphanumericCount <= cleanText.length * 0.3) {
    issues.push('Muitos caracteres especiais, pouco conteúdo alfanumérico');
  }
  
  // Verificar se há caracteres de escape não processados
  if (cleanText.includes('\\n') || cleanText.includes('\\"') || cleanText.includes('\\\\')) {
    issues.push('Caracteres de escape não processados');
  }
  
  return {
    isClean: issues.length === 0,
    issues
  };
};
