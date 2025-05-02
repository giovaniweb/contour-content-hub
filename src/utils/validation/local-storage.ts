
import { ValidationResult } from './types';

// Prefixo para chaves de validação para melhor organização
const VALIDATION_KEY_PREFIX = 'val_';
const MAX_STORAGE_ITEMS = 5; // Limitar o número de validações salvas localmente

// Funções para armazenamento local de validações
export const saveLocalValidation = (scriptId: string, validation: ValidationResult): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const validationKey = `${VALIDATION_KEY_PREFIX}${scriptId}`;
    
    // Criar cópia simplificada para economizar espaço
    const lightValidation = {
      nota_geral: validation.nota_geral,
      gancho: validation.gancho,
      clareza: validation.clareza,
      cta: validation.cta,
      emocao: validation.emocao,
      total: validation.total,
      sugestoes: validation.sugestoes,
      timestamp: new Date().toISOString()
    };
    
    // Incluir blocos limitados (apenas se houver)
    if (validation.blocos && validation.blocos.length > 0) {
      const simplifiedBlocks = validation.blocos
        .slice(0, 6) // Limitar a 6 blocos no máximo
        .map(bloco => ({
          tipo: bloco.tipo,
          nota: bloco.nota,
          texto: bloco.texto?.substring(0, 150) || "", // Limitar texto
          substituir: bloco.substituir,
          sugestao: bloco.sugestao?.substring(0, 150) || "" // Limitar sugestão
        }));
      
      // @ts-ignore
      lightValidation.blocos = simplifiedBlocks;
    }
    
    // Salvar de forma otimizada
    localStorage.setItem(validationKey, JSON.stringify(lightValidation));
    
    // Limpar validações antigas se exceder o limite
    clearOldValidations();
  } catch (error) {
    console.warn('Erro ao salvar validação local:', error);
  }
};

export const getLocalValidation = (scriptId: string): ValidationResult & {timestamp?: string} | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const validationKey = `${VALIDATION_KEY_PREFIX}${scriptId}`;
    const storedValidation = localStorage.getItem(validationKey);
    
    if (storedValidation) {
      return JSON.parse(storedValidation);
    }
  } catch (error) {
    console.warn('Erro ao ler validação local:', error);
  }
  return null;
};

// Função para limpar validações antigas
const clearOldValidations = (): void => {
  try {
    // Buscar todas as chaves de validação
    const validationKeys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(VALIDATION_KEY_PREFIX)) {
        validationKeys.push(key);
      }
    }
    
    // Se exceder o limite, remover as mais antigas
    if (validationKeys.length > MAX_STORAGE_ITEMS) {
      // Ordenar por data (as mais antigas primeiro)
      const sortedKeys = validationKeys.sort((a, b) => {
        const valA = JSON.parse(localStorage.getItem(a) || '{"timestamp":"0"}');
        const valB = JSON.parse(localStorage.getItem(b) || '{"timestamp":"0"}');
        return new Date(valA.timestamp).getTime() - new Date(valB.timestamp).getTime();
      });
      
      // Remover as mais antigas
      const keysToRemove = sortedKeys.slice(0, sortedKeys.length - MAX_STORAGE_ITEMS);
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  } catch (error) {
    console.warn('Erro ao limpar validações antigas:', error);
  }
};
