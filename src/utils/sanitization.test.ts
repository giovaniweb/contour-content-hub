import { describe, it, expect } from 'vitest';
import { BAN_LIST } from './openaiConfig';

describe('BAN_LIST sanitization', () => {
  const sanitize = (text: string) => BAN_LIST.reduce((acc, re) => acc.replace(re, ''), text).replace(/\s{2,}/g, ' ').trim();

  it('removes banned phrases case-insensitively', () => {
    const input = 'Texto com Ladeira CopyWarrior e do JEITO LADEIRA e metodologia Ladeira.';
    const out = sanitize(input);
    expect(out.toLowerCase()).not.toContain('copywarrior');
    expect(out.toLowerCase()).not.toContain('jeito ladeira');
    expect(out.toLowerCase()).not.toContain('metodologia ladeira');
  });
});
