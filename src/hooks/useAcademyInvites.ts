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
    let inviteId: string | null = null;
    
    try {
      setError(null);

      // Gerar token único para o convite
      const inviteToken = crypto.randomUUID();
      
      // Calcular data de expiração
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (inviteData.expires_hours || 24));

      console.log('Creating invite:', { email: inviteData.email, courses: inviteData.course_ids.length });

      // Primeiro, criar o convite no banco
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
      
      inviteId = data.id;
      console.log('Invite created successfully:', inviteId);

      // Tentar enviar e-mail - se falhar, convite ainda é válido
      try {
        await sendInviteEmail(data as AcademyInvite);
        
        // Marcar email como enviado com sucesso
        await supabase
          .from('academy_invites')
          .update({ 
            updated_at: new Date().toISOString()
          })
          .eq('id', inviteId);

        toast.success('Convite criado e e-mail enviado com sucesso!');
      } catch (emailError: any) {
        console.error('Email sending failed, but invite was created:', emailError);
        
        // Convite foi criado, mas email falhou - ainda é válido
        toast.error('Convite criado, mas falha no envio do e-mail. Use "Reenviar" para tentar novamente.');
        // Não fazer throw aqui - convite foi criado
      }

      await fetchInvites();
      return data;
    } catch (err: any) {
      console.error('Error creating invite:', err);
      
      // Se o convite foi criado mas houve erro depois, não deletar
      if (inviteId) {
        console.log('Invite was created despite error, keeping it:', inviteId);
      }
      
      const errorMessage = err.message || 'Erro ao criar convite';
      setError(errorMessage);
      
      // Só mostrar toast de erro se não foi erro de email
      if (!inviteId) {
        toast.error(errorMessage);
        throw err;
      }
    }
  };

  const sendInviteEmail = async (invite: AcademyInvite) => {
    const startTime = Date.now();
    console.log('Sending invite email to:', invite.email);
    
    try {
      // Buscar nomes dos cursos
      const { data: courses } = await supabase
        .from('academy_courses')
        .select('title')
        .in('id', invite.course_ids);

      const courseNames = courses?.map(c => c.title).join(', ') || 'Cursos selecionados';
      console.log('Courses for invite:', courseNames);
      
      // URL para aceitar convite (seria uma página dedicada)
      const quickAccessUrl = `${window.location.origin}/academy/accept-invite/${invite.invite_token}`;
      const resetPasswordUrl = `${window.location.origin}/auth/reset-password`;

      const variables = {
        user: {
          first_name: invite.first_name,
          email: invite.email
        },
        invite: {
          title: `Academia Fluida - ${courseNames}`,
          courses: courseNames,
          expires_at: new Date(invite.expires_at).toLocaleDateString('pt-BR'),
          token: invite.invite_token
        },
        quick_access_url: quickAccessUrl,
        reset_password_url: resetPasswordUrl,
        academy_url: window.location.origin + '/academy'
      };

      console.log('Invoking send-academy-email function...');
      const { data, error } = await supabase.functions.invoke('send-academy-email', {
        body: {
          template_type: 'invite',
          to_email: invite.email,
          variables
        }
      });

      const elapsed = Date.now() - startTime;
      
      if (error) {
        console.error('Email function returned error:', error);
        throw new Error(`Falha no envio: ${error.message || 'Erro desconhecido'}`);
      }

      console.log(`Email sent successfully in ${elapsed}ms:`, data);
    } catch (err: any) {
      const elapsed = Date.now() - startTime;
      console.error(`Error sending invite email after ${elapsed}ms:`, err);
      
      // Provide more specific error messages
      if (err.message?.includes('Template not found')) {
        throw new Error('Template de e-mail não configurado. Contate o administrador.');
      } else if (err.message?.includes('Invalid email')) {
        throw new Error('Formato de e-mail inválido.');
      } else if (err.message?.includes('API key')) {
        throw new Error('Configuração de e-mail inválida. Contate o administrador.');
      }
      
      throw new Error(`Erro no envio do e-mail: ${err.message || 'Erro desconhecido'}`);
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