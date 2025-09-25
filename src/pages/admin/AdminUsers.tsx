import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UniversalDeleteService } from '@/services/universalDeleteService';
import { supabase } from '@/integrations/supabase/client';
import { Users, Search, UserPlus, Trash2, Mail, Calendar, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import NewUserModal from '@/components/admin/NewUserModal';
import EditUserModal from '@/components/admin/EditUserModal';
import { DeleteUserDialog } from '@/components/admin/DeleteUserDialog';
import OrphanedUsersCard from '@/components/admin/OrphanedUsersCard';
import { DeleteUserByEmailCard } from '@/components/admin/DeleteUserByEmailCard';

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  cidade?: string;
  clinica?: string;
  telefone?: string;
  data_criacao: string;
  equipamentos?: string[];
}

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch users
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .order('data_criacao', { ascending: false });
      
      if (error) throw error;
      return data as User[];
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<User> }) => {
      const { error } = await supabase
        .from('perfis')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setEditingUser(null);
      toast({
        title: "Usuário atualizado",
        description: "Informações do usuário foram atualizadas com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o usuário.",
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await UniversalDeleteService.deleteUserProfile(userId);
      
      if (!result.success) {
        throw new Error(result.error || 'Falha na exclusão do usuário');
      }
      
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowDeleteDialog(false);
      setUserToDelete(null);
      toast({
        title: 'Usuário excluído com sucesso',
        description: result.message || 'O usuário e todos os dados relacionados foram removidos.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir usuário',
        description: error.message || 'Não foi possível excluir o usuário. Verifique suas permissões.',
      });
    },
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-300';
      case 'superadmin': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'consultor': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    updateUserMutation.mutate({
      id: editingUser.id,
      updates: {
        nome: editingUser.nome,
        role: editingUser.role,
        cidade: editingUser.cidade,
        clinica: editingUser.clinica,
        telefone: editingUser.telefone,
      }
    });
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Gerenciamento de Usuários</h1>
            <p className="text-slate-400">Administre contas de usuário e permissões</p>
          </div>
        </div>
        <Button onClick={() => setShowNewUserModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* System Management Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os roles</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="consultor">Consultor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Orphaned Users Management */}
          <OrphanedUsersCard />
          
          {/* Direct Email Deletion */}
          <DeleteUserByEmailCard />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Usuários ({filteredUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{user.nome}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                      {user.clinica && (
                        <>
                          <span>•</span>
                          <span>{user.clinica}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      disabled={deleteUserMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <NewUserModal 
        isOpen={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-users'] });
          setShowNewUserModal(false);
        }}
      />
      
      <EditUserModal 
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onUpdate={updateUserMutation.mutate}
        onDelete={deleteUserMutation.mutate}
      />

      <DeleteUserDialog
        user={userToDelete}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        isDeleting={deleteUserMutation.isPending}
      />
    </div>
  );
};

export default AdminUsers;