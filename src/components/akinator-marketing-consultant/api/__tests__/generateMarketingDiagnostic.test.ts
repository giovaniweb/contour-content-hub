import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      functions: {
        invoke: vi.fn(async (_name: string, args: any) => ({ data: { success: true, diagnostic: 'ok' }, error: null, _args: args }))
      }
    }
  };
});

import { generateMarketingDiagnostic } from '../generateMarketingDiagnostic';
import { supabase } from '@/integrations/supabase/client';

describe('generateMarketingDiagnostic API', () => {
  beforeEach(() => {
    // @ts-ignore
    supabase.functions.invoke.mockClear();
    // localStorage mock
    (global as any).localStorage = {
      store: new Map<string, string>(),
      getItem(key: string) { return this.store.get(key) || null; },
      setItem(key: string, val: string) { this.store.set(key, val); },
      removeItem(key: string) { this.store.delete(key); }
    };
  });

  it('sends modelTier from localStorage', async () => {
    localStorage.setItem('aiMode', 'gpt5');
    await generateMarketingDiagnostic({} as any);
    expect(supabase.functions.invoke).toHaveBeenCalled();
    const call = (supabase.functions.invoke as any).mock.calls[0];
    const args = call[1];
    expect(args.body.modelTier).toBe('gpt5');
  });
});
