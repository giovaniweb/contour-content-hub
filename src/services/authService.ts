
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserRole } from "@/types/auth";
import { DbPerfil, DbWorkspace, DbInvite } from "@/lib/supabase/schema-types";
import { User } from "@supabase/supabase-js";

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Buscar perfil do usuário no Supabase
    const { data: userData, error: userError } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error("Erro ao buscar usuário:", userError);
      return null;
    }

    // Type guard to ensure role is one of the allowed values
    const validateRole = (role: string): UserRole => {
      if (role === 'admin' || role === 'gerente' || role === 'operador' || role === 'consultor' || role === 'superadmin' || role === 'cliente') {
        return role as UserRole;
      }
      return 'operador'; // Default to 'operador' if an invalid role is found
    };

    // Converter o formato do banco para o formato esperado pelo frontend
    return {
      id: userData.id,
      email: userData.email,
      nome: userData.nome || '',
      role: validateRole(userData.role || 'operador'),
      workspace_id: userData.workspace_id
    };
  } catch (error) {
    console.error("Erro ao processar perfil:", error);
    return null;
  }
}

export async function loginWithEmailAndPassword(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function registerUser(userData: {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
  clinic?: string;
  city?: string;
  phone?: string;
  equipment?: string[];
  language?: "PT" | "EN" | "ES";
}) {
  // Primeiro, vamos registrar o usuário no auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        nome: userData.name,
      },
    },
  });

  if (authError || !authData.user) {
    throw authError;
  }

  // Verificar se existe algum convite para o e-mail
  const { data: inviteData } = await supabase
    .from('user_invites')
    .select('*, workspace_id')
    .eq('email_convidado', userData.email)
    .eq('status', 'pendente')
    .single();

  if (inviteData) {
    // Se existe um convite, atualizar com o workspace_id e role do convite
    const { error: updateError } = await supabase
      .from('perfis')
      .update({
        nome: userData.name,
        role: inviteData.role_sugerido,
        workspace_id: inviteData.workspace_id
      })
      .eq('id', authData.user.id);
      
    if (updateError) {
      console.error("Erro ao atualizar usuário com convite:", updateError);
      throw updateError;
    }

    // Atualizar o status do convite
    await supabase
      .from('user_invites')
      .update({ 
        status: 'aceito',
        atualizado_em: new Date().toISOString() 
      })
      .eq('id', inviteData.id);

    return authData;
  }
  
  // Se for fornecido o nome da clínica, vamos criar um novo workspace
  if (userData.clinic && userData.role === 'admin') {
    // We'll create a custom table for workspaces in our database
    // For now just mock the response
    const workspaceId = `ws_${Date.now()}`;
    
    // Agora atualizamos o usuário com o workspace_id e role de admin
    const { error: updateError } = await supabase
      .from('perfis')
      .update({
        nome: userData.name,
        role: userData.role || 'admin',
        workspace_id: workspaceId
      })
      .eq('id', authData.user.id);
      
    if (updateError) {
      console.error("Erro ao atualizar usuário:", updateError);
      throw updateError;
    }
  } else {
    // Se não for um admin com clínica, apenas atualizamos o perfil básico
    const { error: updateError } = await supabase
      .from('perfis')
      .update({
        nome: userData.name,
        role: userData.role || 'operador'
      })
      .eq('id', authData.user.id);
      
    if (updateError) {
      console.error("Erro ao atualizar usuário:", updateError);
      throw updateError;
    }
  }

  return authData;
}

export async function logoutUser() {
  return await supabase.auth.signOut();
}

export async function updateUserPassword(newPassword: string) {
  return await supabase.auth.updateUser({
    password: newPassword
  });
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  // Converter do formato frontend para o formato do banco
  const userData: any = {};
  
  if (data.nome) userData.nome = data.nome;
  if (data.role) userData.role = data.role;
  
  return await supabase
    .from('perfis')
    .update(userData)
    .eq('id', userId);
}

// Funções específicas para gerenciamento de workspaces e usuários
export async function createWorkspace(nome: string, plano: string = 'free') {
  // Mock the workspace creation since we don't have actual workspaces table
  const workspaceId = `ws_${Date.now()}`;
  return { id: workspaceId, nome, plano, criado_em: new Date().toISOString() };
}

export async function fetchWorkspaces() {
  // Mock the workspace fetch since we don't have actual workspaces table
  return [{ id: 'ws_default', nome: 'Default Workspace', plano: 'free', criado_em: new Date().toISOString() }];
}

export async function inviteUserToWorkspace(
  workspaceId: string, 
  emailConvidado: string, 
  roleSugerido: UserRole
) {
  const { data, error } = await supabase
    .from('user_invites')
    .insert({
      workspace_id: workspaceId,
      email_convidado: emailConvidado,
      role_sugerido: roleSugerido,
      status: 'pendente'
    })
    .select();
    
  if (error) throw error;
  return data;
}

export async function fetchUserInvites() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');
  
  const { data, error } = await supabase
    .from('user_invites')
    .select(`
      id,
      email_convidado, 
      role_sugerido, 
      status, 
      criado_em,
      workspace_id
    `)
    .eq('email_convidado', user.email)
    .eq('status', 'pendente');
    
  if (error) throw error;
  
  // For each invite, we'd normally fetch the workspace info
  // But for now we'll mock this data since we don't have an actual workspaces table
  const enhancedData = data.map(invite => ({
    ...invite,
    workspaces: { 
      id: invite.workspace_id || 'unknown', 
      nome: `Workspace ${invite.workspace_id?.substring(0, 5) || 'Unknown'}`, 
      plano: 'free' 
    }
  }));
    
  return enhancedData;
}

export async function acceptInvite(inviteId: string) {
  const { data: invite, error: fetchError } = await supabase
    .from('user_invites')
    .select('*')
    .eq('id', inviteId)
    .single();
    
  if (fetchError || !invite) throw fetchError || new Error('Convite não encontrado');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');
  
  // Atualizar o usuário com o workspace e função sugeridos
  const { error: updateError } = await supabase
    .from('perfis')
    .update({
      workspace_id: invite.workspace_id,
      role: invite.role_sugerido
    })
    .eq('id', user.id);
    
  if (updateError) throw updateError;
  
  // Atualizar o status do convite
  const { error: inviteError } = await supabase
    .from('user_invites')
    .update({ status: 'aceito', atualizado_em: new Date().toISOString() })
    .eq('id', inviteId);
    
  if (inviteError) throw inviteError;
  
  return true;
}

export async function rejectInvite(inviteId: string) {
  const { error } = await supabase
    .from('user_invites')
    .update({ status: 'rejeitado', atualizado_em: new Date().toISOString() })
    .eq('id', inviteId);
    
  if (error) throw error;
  return true;
}

export async function fetchWorkspaceUsers(workspaceId: string) {
  if (!workspaceId) return [];
  
  const { data, error } = await supabase
    .from('perfis')
    .select('id, nome, email, role')
    .eq('workspace_id', workspaceId);
    
  if (error) throw error;
  
  // Add a placeholder for last_sign_in_at since it doesn't exist in the database
  const enhancedData = data.map(user => ({
    ...user,
    last_sign_in_at: null // Add a placeholder value
  }));
  
  return enhancedData;
}
