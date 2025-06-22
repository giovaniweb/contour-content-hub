
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/auth';

export const fetchUserProfile = async (userId?: string): Promise<UserProfile | null> => {
  try {
    let targetUserId = userId;
    
    if (!targetUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;
      targetUserId = session.user.id;
    }

    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (error || !data) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      nome: data.nome,
      name: data.nome || data.email, // Add required name property
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
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
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
    throw error;
  }
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
    name: user.name || user.nome, // Add required name property
    role: user.role || 'cliente',
    clinica: user.clinica,
    cidade: user.cidade,
    telefone: user.telefone,
    equipamentos: user.equipamentos,
    idioma: user.idioma || 'PT',
    workspace_id: user.workspace_id,
    profilePhotoUrl: user.profilePhotoUrl || user.profile_photo_url,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
};
