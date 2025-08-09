import { describe, it, expect } from 'vitest';

function validateStructuredDiagnostic(obj: any): boolean {
  try {
    if (!obj || !Array.isArray(obj.secoes) || obj.secoes.length !== 6) return false;
    for (const s of obj.secoes) {
      if (!s || typeof s.titulo !== 'string' || typeof s.conteudo !== 'string' || !s.titulo.trim() || !s.conteudo.trim()) return false;
    }
    if (!Array.isArray(obj.plano4Semanas) || obj.plano4Semanas.length !== 4) return false;
    for (let i = 0; i < 4; i++) {
      const w = obj.plano4Semanas[i];
      if (!w) return false;
      if (typeof w.semana !== 'number' || w.semana !== i + 1) return false;
      if (typeof w.datasRelativas !== 'string' || !w.datasRelativas.trim()) return false;
      if (typeof w.entregaveis !== 'object' || !w.entregaveis) return false;
      if (!Array.isArray(w.kpis) || w.kpis.length === 0) return false;
    }
    return true;
  } catch {
    return false;
  }
}

describe('Structured diagnostic schema', () => {
  it('validates a correct object', () => {
    const obj = {
      secoes: Array.from({ length: 6 }, (_, i) => ({ titulo: `T${i+1}`, conteudo: 'ok' })),
      plano4Semanas: [1,2,3,4].map((n) => ({
        semana: n,
        datasRelativas: 'semana '+n,
        entregaveis: { instagram: ['p1','p2'] },
        kpis: ['alcance','cliques']
      }))
    };
    expect(validateStructuredDiagnostic(obj)).toBe(true);
  });

  it('fails when sections are not 6', () => {
    const obj = { secoes: Array.from({ length: 5 }, (_, i) => ({ titulo: `T${i+1}`, conteudo: 'ok' })), plano4Semanas: [] } as any;
    expect(validateStructuredDiagnostic(obj)).toBe(false);
  });
});
