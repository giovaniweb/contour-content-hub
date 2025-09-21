import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

export interface CreateUserData {
  nome: string;
  email: string;
  password: string;
  role: UserRole;
  cidade?: string;
  clinica?: string;
  telefone?: string;
}

export interface OrphanUser {
  id: string;
  email: string;
  created_at: string;
}

/**
 * Verifica se existe um usuário no auth.users sem perfil correspondente
 */
export async function checkOrphanUser(email: string): Promise<OrphanUser | null> {
  try {
    // Verificar se existe usuário no auth (fazemos isso via RPC pois não temos acesso direto ao auth.users)
    const { data: authCheck, error: authError } = await supabase.rpc('check_user_exists_by_email', {
      user_email: email
    });

    if (authError) {
      console.warn('Não foi possível verificar usuário existente:', authError);
      return null;
    }

    if (!authCheck) {
      return null; // Usuário não existe
    }

    // Verificar se tem perfil
    const { data: profileData, error: profileError } = await supabase
      .from('perfis')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    // Se não tem perfil, é um usuário órfão
    if (!profileData) {
      return {
        id: authCheck.id,
        email: email,
        created_at: authCheck.created_at
      };
    }

    return null; // Usuário existe e tem perfil
  } catch (error) {
    console.error('Erro ao verificar usuário órfão:', error);
    return null;
  }
}

/**
 * Cria um perfil para usuário órfão existente
 */
export async function adoptOrphanUser(orphanUser: OrphanUser, userData: CreateUserData): Promise<void> {
  const { error } = await supabase
    .from('perfis')
    .insert({
      id: orphanUser.id,
      nome: userData.nome,
      email: userData.email,
      role: userData.role,
      cidade: userData.cidade,
      clinica: userData.clinica,
      telefone: userData.telefone
    });

  if (error) {
    throw error;
  }
}

/**
 * Cria um novo usuário completo (auth + perfil)
 */
export async function createCompleteUser(userData: CreateUserData): Promise<void> {
  // Verificar se é usuário órfão primeiro
  const orphanUser = await checkOrphanUser(userData.email);
  
  if (orphanUser) {
    // Se é órfão, apenas criar o perfil
    await adoptOrphanUser(orphanUser, userData);
    return;
  }

  // Criar novo usuário no auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        nome: userData.nome,
        role: userData.role
      }
    }
  });

  if (authError) {
    // Verificar se é erro de usuário já existente
    if (authError.message.includes('User already registered')) {
      // Tentar novamente como usuário órfão
      const retryOrphan = await checkOrphanUser(userData.email);
      if (retryOrphan) {
        await adoptOrphanUser(retryOrphan, userData);
        return;
      }
    }
    throw authError;
  }

  if (!authData.user) {
    throw new Error('Erro ao criar usuário: dados de autenticação não retornados');
  }

  // Atualizar perfil com informações adicionais
  const { error: profileError } = await supabase
    .from('perfis')
    .update({
      nome: userData.nome,
      role: userData.role,
      cidade: userData.cidade,
      clinica: userData.clinica,
      telefone: userData.telefone
    })
    .eq('id', authData.user.id);

  if (profileError) {
    throw profileError;
  }
}

/**
 * Lista todos os usuários órfãos (existem no auth mas não têm perfil)
 */
export async function listOrphanUsers(): Promise<OrphanUser[]> {
  try {
    const { data, error } = await supabase.rpc('get_orphan_users');
    
    if (error) {
      console.error('Erro ao buscar usuários órfãos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao listar usuários órfãos:', error);
    return [];
  }
}

/**
 * Remove um usuário órfão do sistema de autenticação
 */
export async function removeOrphanUser(userId: string): Promise<void> {
  const { error } = await supabase.rpc('delete_auth_user', {
    user_id: userId
  });

  if (error) {
    throw error;
  }
}