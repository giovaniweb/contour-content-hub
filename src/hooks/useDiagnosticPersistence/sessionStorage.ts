
import { DiagnosticSession } from './types';
import { CURRENT_SESSION_KEY } from './constants';

export const loadCurrentSessionFromStorage = (): DiagnosticSession | null => {
  try {
    const current = localStorage.getItem(CURRENT_SESSION_KEY);
    if (current) {
      return JSON.parse(current);
    }
  } catch (error) {
    console.error('Erro ao carregar sessão atual:', error);
  }
  return null;
};

export const saveCurrentSessionToStorage = (session: DiagnosticSession): void => {
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Erro ao salvar sessão no localStorage:', error);
  }
};

export const clearCurrentSessionFromStorage = (): void => {
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  } catch (error) {
    console.error('Erro ao limpar sessão:', error);
  }
};
