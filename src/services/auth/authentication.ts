
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

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
      emailRedirectTo: `${window.location.origin}/`,
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
        role: inviteData.role_sugerido
        // Note: Not setting workspace_id as it may not exist in the perfis table
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
  
  // Note: Role is now automatically set to 'user' by the database trigger for security
  // Only update additional profile information if provided
  if (userData.clinic || userData.city || userData.phone || userData.equipment || userData.language) {
    const { error: updateError } = await supabase
      .from('perfis')
      .update({
        nome: userData.name,
        clinica: userData.clinic,
        cidade: userData.city,
        telefone: userData.phone,
        equipamentos: userData.equipment,
        idioma: userData.language
        // Note: role is managed by trigger, not set manually for security
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
