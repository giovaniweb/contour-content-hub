
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/auth';

export const fetchUserProfile = async (userId?: string): Promise<UserProfile | null> => {
  try {
    console.log('fetchUserProfile: Starting with userId:', userId);
    
    let targetUserId = userId;
    
    if (!targetUserId) {
      console.log('fetchUserProfile: No userId provided, getting from session');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log('fetchUserProfile: No session or user ID found');
        return null;
      }
      targetUserId = session.user.id;
      console.log('fetchUserProfile: Got userId from session:', targetUserId);
    }

    console.log('fetchUserProfile: Querying perfis table for userId:', targetUserId);
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (error) {
      console.error('fetchUserProfile: Database error:', error);
      
      // If no profile found, this might be a new user - handle gracefully
      if (error.code === 'PGRST116') {
        console.log('fetchUserProfile: No profile found, user might need to complete registration');
        return null;
      }
      
      throw error;
    }

    if (!data) {
      console.log('fetchUserProfile: No profile data found for user:', targetUserId);
      return null;
    }

    console.log('fetchUserProfile: Successfully retrieved profile data:', data);

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

    console.log('fetchUserProfile: Mapped user profile:', userProfile);
    return userProfile;
  } catch (error) {
    console.error('fetchUserProfile: Unexpected error:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  console.log('updateUserProfile: Updating profile for userId:', userId, 'with data:', data);
  
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
    console.error('updateUserProfile: Error updating profile:', error);
    throw error;
  }

  console.log('updateUserProfile: Profile updated successfully');
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
