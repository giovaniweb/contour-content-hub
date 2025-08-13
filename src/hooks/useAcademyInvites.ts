import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AcademyInvite, InviteFormData } from '@/types/academy';
import { toast } from 'sonner';

export const useAcademyInvites = () => {
  const [invites, setInvites] = useState<AcademyInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvites = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('academy_invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvites((data || []) as AcademyInvite[]);
    } catch (err) {
      console.error('Error fetching invites:', err);
      setError('Erro ao carregar convites');
    } finally {
      setIsLoading(false);
    }
  };

  const createInvite = async (inviteData: InviteFormData) => {
    try {
      setError(null);

      // Gerar token único para o convite
      const inviteToken = crypto.randomUUID();
      
      // Calcular data de expiração
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (inviteData.expires_hours || 24));

      const { data, error } = await supabase
        .from('academy_invites')
        .insert({
          email: inviteData.email,
          first_name: inviteData.first_name,
          course_ids: inviteData.course_ids,
          invite_token: inviteToken,
          expires_at: expiresAt.toISOString(),
          invited_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Enviar e-mail de convite
      await sendInviteEmail(data as AcademyInvite);

      toast.success('Convite enviado com sucesso!');
      await fetchInvites();
      return data;
    } catch (err: any) {
      console.error('Error creating invite:', err);
      const errorMessage = err.message || 'Erro ao criar convite';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const sendInviteEmail = async (invite: AcademyInvite) => {
    try {
      // Buscar nomes dos cursos
      const { data: courses } = await supabase
        .from('academy_courses')
        .select('title')
        .in('id', invite.course_ids);

      const courseNames = courses?.map(c => c.title).join(', ') || '';
      
      // URL para aceitar convite (seria uma página dedicada)
      const quickAccessUrl = `${window.location.origin}/academy/accept-invite/${invite.invite_token}`;
      const resetPasswordUrl = `${window.location.origin}/auth/reset-password`;

      const variables = {
        user: {
          first_name: invite.first_name
        },
        invite: {
          title: `Academia Fluida - ${courseNames}`
        },
        quick_access_url: quickAccessUrl,
        reset_password_url: resetPasswordUrl
      };

      const { error } = await supabase.functions.invoke('send-academy-email', {
        body: {
          template_type: 'invite',
          to_email: invite.email,
          variables
        }
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error sending invite email:', err);
      throw err;
    }
  };

  const cancelInvite = async (inviteId: string) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('academy_invites')
        .update({ status: 'cancelled' })
        .eq('id', inviteId);

      if (error) throw error;

      toast.success('Convite cancelado com sucesso!');
      await fetchInvites();
    } catch (err: any) {
      console.error('Error cancelling invite:', err);
      const errorMessage = err.message || 'Erro ao cancelar convite';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resendInvite = async (inviteId: string) => {
    try {
      setError(null);

      // Buscar convite
      const { data: invite, error: fetchError } = await supabase
        .from('academy_invites')
        .select('*')
        .eq('id', inviteId)
        .single();

      if (fetchError || !invite) throw fetchError || new Error('Convite não encontrado');

      // Renovar expiração
      const newExpiresAt = new Date();
      newExpiresAt.setHours(newExpiresAt.getHours() + 24);

      const { error: updateError } = await supabase
        .from('academy_invites')
        .update({ 
          expires_at: newExpiresAt.toISOString(),
          status: 'pending'
        })
        .eq('id', inviteId);

      if (updateError) throw updateError;

      // Reenviar e-mail
      await sendInviteEmail({ ...invite, expires_at: newExpiresAt.toISOString() } as AcademyInvite);

      toast.success('Convite reenviado com sucesso!');
      await fetchInvites();
    } catch (err: any) {
      console.error('Error resending invite:', err);
      const errorMessage = err.message || 'Erro ao reenviar convite';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  return {
    invites,
    isLoading,
    error,
    createInvite,
    cancelInvite,
    resendInvite,
    refetch: fetchInvites
  };
};