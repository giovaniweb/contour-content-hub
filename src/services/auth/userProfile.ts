
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/auth';

export const fetchUserProfile = async (userId?: string): Promise<UserProfile | null> => {
  try {
    console.log('fetchUserProfile: Iniciando busca do perfil', { userId });
    let targetUserId = userId;
    
    if (!targetUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log('fetchUserProfile: Nenhuma sessão ativa encontrada');
        return null;
      }
      targetUserId = session.user.id;
    }

    console.log('fetchUserProfile: Buscando perfil para usuário', { targetUserId });
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('fetchUserProfile: Perfil não encontrado para o usuário');
        return null;
      }
      console.error('fetchUserProfile: Erro ao buscar perfil:', error);
      throw error;
    }

    if (!data) {
      console.log('fetchUserProfile: Dados do perfil não encontrados');
      return null;
    }

    console.log('fetchUserProfile: Perfil encontrado, construindo UserProfile');
    const userProfile: UserProfile = {
      id: data.id,
      email: data.email,
      nome: data.nome,
      role: (data.role as UserRole) || 'cliente',
      clinica: data.clinica,
      cidade: data.cidade,
      telefone: data.telefone,
      equipamentos: data.equipamentos,
      idioma: (data.idioma as 'PT' | 'EN' | 'ES') || 'PT',
      profilePhotoUrl: data.foto_url || undefined,
      created_at: data.data_criacao,
      updated_at: data.data_criacao
    };

    console.log('fetchUserProfile: UserProfile construído com sucesso');
    return userProfile;
  } catch (error) {
    console.error('fetchUserProfile: Erro inesperado:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  console.log('updateUserProfile: Atualizando perfil', { userId, data });
  const { error } = await supabase
    .from('perfis')
    .update({
      nome: data.nome,
      clinica: data.clinica,
      cidade: data.cidade,
      telefone: data.telefone,
      equipamentos: data.equipamentos,
      idioma: data.idioma,
      foto_url: data.profilePhotoUrl,
    })
    .eq('id', userId);

  if (error) {
    console.error('updateUserProfile: Erro ao atualizar perfil:', error);
    throw error;
  }
  console.log('updateUserProfile: Perfil atualizado com sucesso');
};

export const validateRole = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    'superadmin': 6,
    'admin': 5,
    'gerente': 4,
    'operador': 3,
    'consultor': 2,
    'cliente': 1
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
};

export const ensureUserProfile = (user: any): UserProfile => {
  return {
    id: user.id,
    email: user.email,
    nome: user.nome || user.name,
    role: user.role || 'cliente',
    clinica: user.clinica,
    cidade: user.cidade,
    telefone: user.telefone,
    equipamentos: user.equipamentos,
    idioma: user.idioma || 'PT',
    workspace_id: user.workspace_id,
    profilePhotoUrl: user.profilePhotoUrl || user.profile_photo_url,
    created_at: user.created_at || user.data_criacao,
    updated_at: user.updated_at || user.data_criacao
  };
};
