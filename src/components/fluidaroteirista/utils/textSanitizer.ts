
/**
 * Função universal para limpeza rigorosa de texto
 * Remove caracteres indesejados, formatação markdown e quebras de linha desnecessárias
 */
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    // Remove caracteres de escape e formatação markdown problemática
    .replace(/\[|\]|\n\n\s*\\|\\\s*\[|\\\s*\]|\\n|\\t/g, '')
    // Remove sequências de escape específicas
    .replace(/\]\n\n\s*\\\s*\[/g, '')
    .replace(/\\\[|\\\]/g, '')
    // Remove múltiplas quebras de linha
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Remove espaços excessivos
    .replace(/\s{3,}/g, ' ')
    .replace(/\t+/g, ' ')
    // Remove caracteres de controle
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    // Remove caracteres específicos problemáticos
    .replace(/[^\w\s\-.,!?;:()\n'"áàâãéèêíìîóòôõúùûüçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÜÇ]/g, '')
    // Limpa início e fim
    .trim();
};

/**
 * Limpa especificamente estruturas de roteiro mantendo formatação básica
 */
export const sanitizeScriptStructure = (text: string): string => {
  const cleaned = sanitizeText(text);
  
  return cleaned
    // Garante estrutura limpa para slides/stories
    .replace(/Slide:\s*([^\n]+)/gi, 'Slide: $1')
    .replace(/Texto:\s*([^\n]+)/gi, 'Texto: $1')
    .replace(/Imagem:\s*([^\n]+)/gi, 'Imagem: $1')
    .replace(/Story:\s*([^\n]+)/gi, 'Story: $1')
    .replace(/Conteúdo:\s*([^\n]+)/gi, 'Conteúdo: $1')
    // Remove linhas vazias excessivas
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/**
 * Valida se o texto está limpo e bem formatado
 */
export const validateTextCleanliness = (text: string): { isClean: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Verifica caracteres problemáticos
  if (/\[|\]|\\/.test(text)) {
    issues.push('Contém caracteres de escape indesejados');
  }
  
  // Verifica múltiplas quebras de linha
  if (/\n{3,}/.test(text)) {
    issues.push('Contém múltiplas quebras de linha desnecessárias');
  }
  
  // Verifica espaços excessivos
  if (/\s{3,}/.test(text)) {
    issues.push('Contém espaçamento excessivo');
  }
  
  return {
    isClean: issues.length === 0,
    issues
  };
};
