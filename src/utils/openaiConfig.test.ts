import { describe, it, expect } from 'vitest';
import { modelRouter, GPT5_CORE, GPT5_MINI, G4_1 } from './openaiConfig';
import type { ModelTier } from '@/types/ai';

describe('modelRouter', () => {
  it('routes gpt5 tier correctly', () => {
    const res = modelRouter('gpt5' as ModelTier);
    expect(res).toEqual([GPT5_CORE, GPT5_MINI, G4_1]);
  });

  it('routes standard tier correctly', () => {
    const res = modelRouter('standard' as ModelTier);
    expect(res).toEqual([G4_1]);
  });
});
