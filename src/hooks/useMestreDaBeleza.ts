import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DbPerfil } from '@/lib/supabase/schema-types';
import { handleSupabaseError } from '@/utils/validation/supabaseHelpers';
import { getErrorMessage } from '@/utils/errorUtils';

interface MestreDaBelezaData {
  id: string;
  nome: string;
  email: string;
  role: string;
  cidade?: string;
  clinica?: string;
  telefone?: string;
  foto_url?: string;
  data_criacao?: string;
  equipamentos?: string[];
  idioma?: string;
  observacoes_conteudo?: string;
}

interface UseMestreDaBelezaResult {
  data: MestreDaBelezaData | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<MestreDaBelezaData>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
  removeAvatar: () => Promise<void>;
}

export const useMestreDaBeleza = (): UseMestreDaBelezaResult => {
  const [data, setData] = useState<MestreDaBelezaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error(userError?.message || 'Usuário não autenticado');
      }

      const userId = userData.user.id;

      const { data: profileData, error: profileError } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      if (profileData) {
        setData(profileData as MestreDaBelezaData);
      } else {
        setData(null);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar perfil';
      console.error('Erro ao carregar perfil:', errorMessage);
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<MestreDaBelezaData>): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error(userError?.message || 'Usuário não autenticado');
      }

      const userId = userData.user.id;

      const { error: updateError } = await supabase
        .from('perfis')
        .update(updates)
        .eq('id', userId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Refresh profile data after update
      await fetchProfile();
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar perfil';
      console.error('Erro ao atualizar perfil:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error(userError?.message || 'Usuário não autenticado');
      }

      const userId = userData.user.id;
      const filePath = `avatars/${userId}/${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: getUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = getUrlData.publicUrl;

      // Update profile with avatar URL
      await updateProfile({ foto_url: avatarUrl });

      return avatarUrl;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao fazer upload do avatar';
      console.error('Erro ao fazer upload do avatar:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeAvatar = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error(userError?.message || 'Usuário não autenticado');
      }

      const userId = userData.user.id;

      // Get current profile to get the avatar URL
      const { data: profileData, error: profileError } = await supabase
        .from('perfis')
        .select('foto_url')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      const currentAvatarUrl = profileData?.foto_url;

      if (currentAvatarUrl) {
        // Extract file path from URL
        const filePath = currentAvatarUrl.replace(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/`, '');

        // Delete the file from storage
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([filePath]);

        if (deleteError) {
          console.error('Erro ao remover avatar do storage:', deleteError);
          // Don't throw, continue to update the profile
        }
      }

      // Update profile to remove avatar URL
      await updateProfile({ foto_url: null });
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao remover avatar';
      console.error('Erro ao remover avatar:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    const errorMessage = getErrorMessage(error);
    console.error('Mestre da Beleza error:', errorMessage);
    setError(errorMessage);
  };

  return {
    data,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  };
};
