
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InviteUserModal from './InviteUserModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface WorkspaceUser {
  id: string;
  nome: string | null;
  email: string;
  role: string;
}

interface PendingInvite {
  id: string;
  email_convidado: string;
  role_sugerido: string;
  status: string;
  criado_em: string;
}

const WorkspaceUsers: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<WorkspaceUser[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user?.workspace_id) {
      fetchWorkspaceUsers();
      fetchPendingInvites();
    }
  }, [user?.workspace_id]);
  
  const fetchWorkspaceUsers = async () => {
    if (!user?.workspace_id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, nome, email, role')
        .eq('workspace_id', user.workspace_id);
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: 'Erro ao carregar usuários',
        description: 'Não foi possível carregar a lista de usuários.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPendingInvites = async () => {
    if (!user?.workspace_id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_invites')
        .select('id, email_convidado, role_sugerido, status, criado_em')
        .eq('workspace_id', user.workspace_id)
        .eq('status', 'pendente');
      
      if (error) throw error;
      
      setPendingInvites(data || []);
    } catch (error) {
      console.error('Erro ao carregar convites pendentes:', error);
    }
  };
  
  const cancelInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('user_invites')
        .delete()
        .eq('id', inviteId);
      
      if (error) throw error;
      
      setPendingInvites(pendingInvites.filter(invite => invite.id !== inviteId));
      
      toast({
        title: 'Convite cancelado',
        description: 'O convite foi cancelado com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao cancelar convite:', error);
      toast({
        title: 'Erro ao cancelar convite',
        description: 'Não foi possível cancelar o convite.',
        variant: 'destructive',
      });
    }
  };
  
  const handleInviteSent = () => {
    fetchPendingInvites();
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Equipe</h2>
        <InviteUserModal />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Usuários do Workspace</CardTitle>
            <CardDescription>
              Usuários que fazem parte da sua equipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-4 text-center">Carregando usuários...</div>
            ) : users.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                Nenhum usuário encontrado
              </div>
            ) : (
              <div className="space-y-3">
                {users.map(user => (
                  <div
                    key={user.id}
                    className="p-3 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{user.nome || user.email}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-block mt-1 capitalize">
                        {user.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Convites Pendentes</CardTitle>
            <CardDescription>
              Convites enviados que estão aguardando aceitação
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingInvites.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                Nenhum convite pendente
              </div>
            ) : (
              <div className="space-y-3">
                {pendingInvites.map(invite => (
                  <div
                    key={invite.id}
                    className="p-3 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{invite.email_convidado}</div>
                      <div className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full inline-block mt-1 capitalize">
                        {invite.role_sugerido}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Enviado em {new Date(invite.criado_em).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancelar convite?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso cancelará permanentemente o convite enviado para {invite.email_convidado}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => cancelInvite(invite.id)}>
                            Confirmar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default WorkspaceUsers;
