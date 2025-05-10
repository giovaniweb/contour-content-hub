
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserRole } from "@/types/auth";
import { User } from "@supabase/supabase-js";

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Buscar perfil do usuário no Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error("Erro ao buscar usuário:", userError);
      return null;
    }

    // Buscar dados do workspace se existir
    let workspaceData = null;
    if (userData.workspace_id) {
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', userData.workspace_id)
        .single();
      
      workspaceData = workspace;
    }

    // Type guard to ensure role is one of the allowed values
    const validateRole = (role: string): UserRole => {
      if (role === 'admin' || role === 'gerente' || role === 'operador' || role === 'consultor' || role === 'superadmin') {
        return role as UserRole;
      }
      return 'operador'; // Default to 'operador' if an invalid role is found
    };

    // Converter o formato do banco para o formato esperado pelo frontend
    return {
      id: userData.id,
      name: userData.nome || '',
      email: userData.email,
      clinic: workspaceData?.nome || '',
      city: '',
      phone: '',
      equipment: [],
      language: "PT",
      profilePhotoUrl: '',
      passwordChanged: true,
      role: validateRole(userData.role || 'operador'),
      workspace_id: userData.workspace_id || undefined
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
  name: string;
  role?: UserRole;
  clinic?: string;
  city?: string;
  phone?: string;
  equipment?: string[];
  language: "PT" | "EN" | "ES";
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

  // Se for fornecido o nome da clínica, vamos criar um novo workspace
  if (userData.clinic && userData.role === 'admin') {
    const { data: workspaceData, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        nome: userData.clinic
      })
      .select()
      .single();

    if (workspaceError) {
      console.error("Erro ao criar workspace:", workspaceError);
      throw workspaceError;
    }

    // Agora atualizamos o usuário com o workspace_id e role de admin
    const { error: updateError } = await supabase
      .from('users')
      .update({
        nome: userData.name,
        role: userData.role || 'admin',
        workspace_id: workspaceData.id
      })
      .eq('id', authData.user.id);
      
    if (updateError) {
      console.error("Erro ao atualizar usuário:", updateError);
      throw updateError;
    }
  } else {
    // Se não for um admin com clínica, apenas atualizamos o perfil básico
    const { error: updateError } = await supabase
      .from('users')
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
  
  if (data.name) userData.nome = data.name;
  if (data.role) userData.role = data.role;
  
  return await supabase
    .from('users')
    .update(userData)
    .eq('id', userId);
}

// Funções específicas para gerenciamento de workspaces e usuários
export async function createWorkspace(nome: string, plano: string = 'free') {
  const { data, error } = await supabase
    .from('workspaces')
    .insert({ nome, plano })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function fetchWorkspaces() {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*');
    
  if (error) throw error;
  return data;
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
      role_sugerido: roleSugerido
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
    .select('*, workspaces(*)')
    .eq('email_convidado', user.email)
    .eq('status', 'pendente');
    
  if (error) throw error;
  return data;
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
    .from('users')
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
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('workspace_id', workspaceId);
    
  if (error) throw error;
  return data;
}
