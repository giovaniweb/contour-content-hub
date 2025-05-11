
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

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
      role: invite.role_sugerido
      // Not setting workspace_id as it may not exist in the perfis table
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
