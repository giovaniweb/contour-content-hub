
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchWorkspaceUsers } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { WorkspaceUser as WorkspaceUserType } from '@/lib/supabase/schema-types';

interface WorkspaceUsersProps {
  workspaceId?: string;
  onInviteUser?: () => void;
}

const WorkspaceUsers: React.FC<WorkspaceUsersProps> = ({ workspaceId, onInviteUser }) => {
  const [users, setUsers] = useState<WorkspaceUserType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (workspaceId || user?.workspace_id) {
      loadUsers();
    }
  }, [workspaceId, user?.workspace_id]);
  
  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await fetchWorkspaceUsers(workspaceId || user?.workspace_id || '');
      setUsers(usersData as WorkspaceUserType[]);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Erro ao carregar usuários',
        description: 'Não foi possível carregar os usuários do workspace.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getRoleColor = (role: string) => {
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
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>Gerencie os usuários do workspace</CardDescription>
          </div>
          {onInviteUser && (
            <Button onClick={onInviteUser}>Convidar Usuário</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Carregando usuários...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">Nenhum usuário encontrado</p>
            {onInviteUser && (
              <Button variant="outline" className="mt-2" onClick={onInviteUser}>
                Convidar Usuários
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {users.map(user => (
              <div key={user.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(user.nome)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.nome || user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkspaceUsers;
