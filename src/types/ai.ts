
export type ModelTier = 'standard' | 'gpt5';

export const getSelectedModelTier = (): ModelTier => {
  try {
    if (typeof window !== 'undefined') {
      const mode = localStorage.getItem('aiMode');
      return mode === 'gpt5' ? 'gpt5' : 'standard';
    }
  } catch {
    // ignore
  }
  return 'standard';
};
