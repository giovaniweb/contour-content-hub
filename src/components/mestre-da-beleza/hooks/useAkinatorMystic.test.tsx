
/// <reference types="vitest" />

import { renderHook } from '@testing-library/react';
import { useAkinatorMystic } from './useAkinatorMystic';

describe('useAkinatorMystic', () => {
  it('retorna a frase inicial no progresso 0', () => {
    const { result } = renderHook(() => useAkinatorMystic(0));
    expect(typeof result.current).toBe('string');
    expect(result.current).toContain('Consultando os astros');
  });

  it('retorna a última frase com progresso 100', () => {
    const { result } = renderHook(() => useAkinatorMystic(100));
    expect(result.current).toContain('Finalizando o diagnóstico');
  });

  it('retorna frases diferentes para progressos distintos', () => {
    const { result: r0 } = renderHook(() => useAkinatorMystic(0));
    const { result: r50 } = renderHook(() => useAkinatorMystic(50));
    const { result: r100 } = renderHook(() => useAkinatorMystic(100));
    expect(r0.current).not.toEqual(r100.current);
    expect(r0.current).not.toEqual(r50.current);
  });
});

