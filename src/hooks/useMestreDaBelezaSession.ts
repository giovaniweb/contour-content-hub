
import { useCallback } from 'react';

const SESSION_KEY = 'mestre_da_beleza_session';

export function saveSession(data: any) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}
export function loadSession(): any {
  try {
    const s = window.localStorage.getItem(SESSION_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return null;
}
export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function useMestreDaBelezaSession() {
  // Exemplo simples, poderia adaptar ao React Context para sessão global
  const save = useCallback(saveSession, []);
  const load = useCallback(loadSession, []);
  const clear = useCallback(clearSession, []);
  return { save, load, clear };
}
