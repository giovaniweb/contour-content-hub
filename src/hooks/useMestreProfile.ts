
import { useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  perfil?: 'medico' | 'profissional_estetica' | 'cliente_final';
  primeira_interacao: boolean;
  cadastrado: boolean;
  tipo_usuario?: 'cliente_final' | 'clinica_contourline' | 'clinica_externa';
  equipamento_informado: boolean;
  step: 'profile' | 'intention' | 'diagnosis' | 'recommendation' | 'completed';
  responses: Record<string, any>;
  idade_estimada?: number;
  area_problema?: string;
  problema_identificado?: string;
  current_question_index: number;
  session_id: string;
}

const SESSION_KEY = 'mestre_da_beleza_session';

export function useMestreProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        return JSON.parse(savedSession);
      }
    } catch {}
    return {
      primeira_interacao: true,
      cadastrado: false,
      equipamento_informado: false,
      step: 'profile',
      responses: {},
      current_question_index: 0,
      session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({
      ...prev,
      ...updates,
      responses: { ...prev.responses, ...updates.responses }
    }));
  }, []);

  const resetProfile = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUserProfile({
      primeira_interacao: true,
      cadastrado: false,
      equipamento_informado: false,
      step: 'profile',
      responses: {},
      current_question_index: 0,
      session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  }, []);

  return { userProfile, updateProfile, resetProfile, setUserProfile };
}
