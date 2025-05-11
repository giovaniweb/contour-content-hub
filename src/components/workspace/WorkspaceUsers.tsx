
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import InviteUserModal from './InviteUserModal';
import { UserRole } from '@/types/auth';
import { AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import { fetchWorkspaceUsers } from '@/services/authService';

// Define types for users and pending invites
interface WorkspaceUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  last_sign_in_at?: string;
}

interface PendingInvite {
  id: string;
  email_convidado: string;
  role_sugerido: UserRole;
  status: 'pendente' | 'aceito' | 'rejeitado';
  criado_em: string;
}

const WorkspaceUsers: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<WorkspaceUser[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (!user?.workspace_id) return;

      try {
        setIsLoading(true);

        // Fetch workspace users
        const workspaceUsers = await fetchWorkspaceUsers(user.workspace_id);
        setUsers(workspaceUsers as WorkspaceUser[]);

        // Fetch pending invites
        await fetchPendingInvites();
      } catch (error) {
        console.error('Error fetching workspace users:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os usuários do workspace',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPendingInvites = async () => {
      if (!user?.workspace_id) return;

      try {
        const { data: invites, error } = await supabase
          .from('user_invites')
          .select(`
            id, 
            email_convidado,
            role_sugerido,
            status,
            criado_em
          `)
          .eq('workspace_id', user.workspace_id)
          .eq('status', 'pendente');

        if (error) {
          console.error('Error fetching invites:', error);
          return;
        }

        setPendingInvites(invites as PendingInvite[]);
      } catch (error) {
        console.error('Error fetching pending invites:', error);
      }
    };

    fetchWorkspaceData();
  }, [user, toast]);

  const cancelInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('user_invites')
        .delete()
        .eq('id', inviteId);

      if (error) throw error;

      setPendingInvites((prev) => prev.filter((invite) => invite.id !== inviteId));

      toast({
        title: 'Convite cancelado',
        description: 'O convite foi cancelado com sucesso',
      });
    } catch (error) {
      console.error('Error canceling invite:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar o convite',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || 'U';
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'gerente':
        return 'bg-blue-100 text-blue-800';
      case 'operador':
        return 'bg-green-100 text-green-800';
      case 'consultor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'gerente':
        return 'Gerente';
      case 'operador':
        return 'Operador';
      case 'consultor':
        return 'Consultor';
      case 'superadmin':
        return 'Super Admin';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Usuários do Workspace</CardTitle>
          <CardDescription>Gerencie os usuários com acesso ao seu workspace</CardDescription>
        </div>
        <InviteUserModal />
      </CardHeader>
      <CardContent>
        {pendingInvites.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Convites Pendentes</h3>
            <div className="space-y-2">
              {pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{invite.email_convidado}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={getRoleBadgeColor(invite.role_sugerido)}
                        >
                          {getRoleLabel(invite.role_sugerido)}
                        </Badge>
                        <span className="ml-2">
                          Enviado em {new Date(invite.criado_em).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cancelInvite(invite.id)}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancelar convite</span>
                  </Button>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
          </div>
        )}

        {users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 hover:bg-accent/20 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{getInitials(user.nome)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.nome}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Nenhum usuário encontrado. Convide colaboradores para o seu workspace.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkspaceUsers;
