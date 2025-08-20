
export type ModelTier = 'standard' | 'gpt5';

export const getSelectedModelTier = (): ModelTier => {
  try {
    if (typeof window !== 'undefined') {
      const mode = localStorage.getItem('aiMode');
      // PADRONIZAÇÃO: 'standard' como padrão (GPT-4.1)
      return mode === 'gpt5' ? 'gpt5' : 'standard';
    }
  } catch {
    // ignore
  }
  // DEFAULT: sempre retorna 'standard' para usar GPT-4.1 como padrão
  return 'standard';
};
