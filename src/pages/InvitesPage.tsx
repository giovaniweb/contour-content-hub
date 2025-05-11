
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchUserInvites, acceptInvite, rejectInvite } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/auth';

interface Invite {
  id: string;
  email_convidado: string;
  role_sugerido: UserRole;
  status: string;
  criado_em: string;
  workspaces: {
    id: string;
    nome: string;
    plano: string;
  };
}

const InvitesPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  useEffect(() => {
    loadInvites();
  }, []);
  
  const loadInvites = async () => {
    try {
      setLoading(true);
      const invitesData = await fetchUserInvites();
      setInvites(invitesData as Invite[]);
    } catch (error) {
      console.error('Erro ao carregar convites:', error);
      toast({
        title: 'Erro ao carregar convites',
        description: 'Não foi possível carregar seus convites.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAcceptInvite = async (inviteId: string) => {
    try {
      setProcessingId(inviteId);
      await acceptInvite(inviteId);
      
      toast({
        title: 'Convite aceito',
        description: 'Você agora faz parte deste workspace.',
      });
      
      // Redirecionar para o dashboard após aceitar o convite
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao aceitar convite:', error);
      toast({
        title: 'Erro ao aceitar convite',
        description: error.message || 'Ocorreu um erro ao aceitar o convite.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleRejectInvite = async (inviteId: string) => {
    try {
      setProcessingId(inviteId);
      await rejectInvite(inviteId);
      
      // Atualizar a lista de convites após rejeitar
      setInvites(invites.filter(invite => invite.id !== inviteId));
      
      toast({
        title: 'Convite rejeitado',
        description: 'O convite foi rejeitado com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao rejeitar convite:', error);
      toast({
        title: 'Erro ao rejeitar convite',
        description: error.message || 'Ocorreu um erro ao rejeitar o convite.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Seus Convites</h1>
        
        {loading ? (
          <div className="text-center py-10">Carregando convites...</div>
        ) : invites.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhum convite pendente</CardTitle>
              <CardDescription>
                Você não tem convites pendentes para aceitar.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/dashboard')}>Ir para o Dashboard</Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid gap-6">
            {invites.map(invite => (
              <Card key={invite.id}>
                <CardHeader>
                  <CardTitle>{invite.workspaces.nome}</CardTitle>
                  <CardDescription>
                    Você foi convidado para se juntar a este workspace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Papel sugerido:</span>{' '}
                      <span className="capitalize">{invite.role_sugerido}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Data do convite:</span>{' '}
                      {new Date(invite.criado_em).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Plano do workspace:</span>{' '}
                      <span className="capitalize">{invite.workspaces.plano}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleRejectInvite(invite.id)}
                    disabled={processingId === invite.id}
                  >
                    Rejeitar
                  </Button>
                  <Button
                    onClick={() => handleAcceptInvite(invite.id)}
                    disabled={processingId === invite.id}
                  >
                    {processingId === invite.id ? 'Processando...' : 'Aceitar Convite'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvitesPage;
