
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
      data: {
        nome: userData.name,
      },
    },
  });

  if (authError || !authData.user) {
    throw authError;
  }

  // Prepare data for the 'perfis' table insert
  let perfilDataToInsert: any = {
    id: authData.user.id,
    email: userData.email, // Assuming email should also be in perfis
    nome: userData.name,
    clinica: userData.clinic,
    cidade: userData.city,
    telefone: userData.phone,
    equipamentos: userData.equipment,
    idioma: userData.language,
    role: userData.role || 'operador', // Default role
    // workspace_id: undefined, // Placeholder for workspace_id
  };

  // Check for an existing invite
  const { data: inviteData, error: inviteError } = await supabase
    .from('user_invites')
    .select('*, workspace_id') // Assuming workspace_id is a column in user_invites
    .eq('email_convidado', userData.email)
    .eq('status', 'pendente')
    .single();

  if (inviteError && inviteError.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error("Erro ao buscar convite:", inviteError);
    // Decide if you want to throw here or proceed without invite data
    // For now, let's proceed, and the profile will be created without invite context
  }

  if (inviteData) {
    perfilDataToInsert.role = inviteData.role_sugerido || perfilDataToInsert.role;
    // If workspace_id is part of user_invites and should be part of perfis:
    // perfilDataToInsert.workspace_id = inviteData.workspace_id;
    // For now, assuming workspace_id is not directly on perfis from invite,
    // or will be handled by admin/clinic logic.

    // Update the invite status
    const { error: updateInviteError } = await supabase
      .from('user_invites')
      .update({
        status: 'aceito',
        atualizado_em: new Date().toISOString(),
        aceito_por_usuario_id: authData.user.id // Link the user who accepted
      })
      .eq('id', inviteData.id);

    if (updateInviteError) {
      console.error("Erro ao atualizar status do convite:", updateInviteError);
      // Potentially throw this error or handle it, e.g., by logging
      // For now, we'll let the profile insertion proceed.
    }
  } else if (userData.clinic && (userData.role === 'admin' || perfilDataToInsert.role === 'admin')) {
    // Special handling for new admin with a clinic (and no overriding invite)
    // We'll mock this since there's no workspaces table mentioned for perfis directly.
    // If 'perfis' should have a 'workspace_id', it would be set here.
    // For example: perfilDataToInsert.workspace_id = `ws_${Date.now()}`;
    // The task implies this mocked ID was for the profile, so we ensure the role is admin.
    perfilDataToInsert.role = 'admin'; // Ensure role is admin if clinic is provided by an admin
  }

  // Insert the new profile into 'perfis' table
  const { error: insertError } = await supabase
    .from('perfis')
    .insert([perfilDataToInsert]);

  if (insertError) {
    console.error("Erro ao inserir perfil:", insertError);
    // IMPORTANT: If profile insert fails, we should consider what to do with the auth.user.
    // For now, as per instructions, propagate the error.
    // In a real-world scenario, you might want to delete the auth.user or queue a cleanup.
    throw insertError;
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
