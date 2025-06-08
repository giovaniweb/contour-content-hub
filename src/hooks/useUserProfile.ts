
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  clinic_type: 'clinica_medica' | 'clinica_estetica' | null;
  // Adicione outros campos do perfil conforme necessário
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        // Por enquanto, vamos usar um valor padrão ou localStorage
        // até implementarmos a tabela de perfis
        const savedClinicType = localStorage.getItem('userClinicType') as 'clinica_medica' | 'clinica_estetica' | null;
        
        setProfile({
          id: user.id,
          clinic_type: savedClinicType
        });
        
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError('Erro ao carregar perfil do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateClinicType = (clinicType: 'clinica_medica' | 'clinica_estetica') => {
    localStorage.setItem('userClinicType', clinicType);
    setProfile(prev => prev ? { ...prev, clinic_type: clinicType } : null);
  };

  return {
    profile,
    loading,
    error,
    updateClinicType
  };
};
