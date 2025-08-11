import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AcademyAccessRequest } from '@/types/academy';
import { useToast } from '@/hooks/use-toast';

export const useAcademyAccessRequests = () => {
  const [requests, setRequests] = useState<AcademyAccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('academy_access_requests')
        .select(`
          *,
          academy_courses(title)
        `)
        .order('requested_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Get user profiles separately to avoid relation issues
      const userIds = data?.map(req => req.user_id) || [];
      const { data: profiles } = await supabase
        .from('perfis')
        .select('id, nome, email')
        .in('id', userIds);

      const requestsWithData = data?.map(request => {
        const userProfile = profiles?.find(p => p.id === request.user_id);
        return {
          ...request,
          course_title: request.academy_courses?.title || '',
          user_name: userProfile?.nome || '',
          user_email: userProfile?.email || '',
          status: request.status as 'pending' | 'approved' | 'rejected'
        };
      }) || [];

      setRequests(requestsWithData);
    } catch (err) {
      console.error('Error fetching access requests:', err);
      setError('Erro ao carregar solicitações');
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (requestId: string, accessDurationDays: number = 30) => {
    try {
      // Get request details
      const { data: request, error: requestError } = await supabase
        .from('academy_access_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Create user access
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + accessDurationDays);

      const { error: accessError } = await supabase
        .from('academy_user_course_access')
        .insert([{
          user_id: request.user_id,
          course_id: request.course_id,
          status: 'not_started',
          access_expires_at: expiresAt.toISOString()
        }]);

      if (accessError) throw accessError;

      // Update request status
      const { error: updateError } = await supabase
        .from('academy_access_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast({
        title: "Solicitação aprovada!",
        description: "O usuário agora tem acesso ao curso.",
      });

      await fetchRequests();
    } catch (err) {
      console.error('Error approving request:', err);
      toast({
        title: "Erro",
        description: "Erro ao aprovar solicitação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const rejectRequest = async (requestId: string, notes?: string) => {
    try {
      const { error: updateError } = await supabase
        .from('academy_access_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          notes
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast({
        title: "Solicitação rejeitada",
        description: "A solicitação foi rejeitada.",
      });

      await fetchRequests();
    } catch (err) {
      console.error('Error rejecting request:', err);
      toast({
        title: "Erro",
        description: "Erro ao rejeitar solicitação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    isLoading,
    error,
    approveRequest,
    rejectRequest,
    refetch: fetchRequests
  };
};