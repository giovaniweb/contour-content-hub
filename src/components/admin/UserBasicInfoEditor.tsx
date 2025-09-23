import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Save, AlertTriangle } from 'lucide-react';

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  cidade?: string;
  clinica?: string;
  telefone?: string;
  equipamentos?: string[];
  observacoes_conteudo?: string;
  data_criacao: string;
}

interface UserBasicInfoEditorProps {
  user: User;
  onUpdate: () => void;
}

const UserBasicInfoEditor: React.FC<UserBasicInfoEditorProps> = ({ user, onUpdate }) => {
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const { toast } = useToast();

  // Check if current user is admin
  const { data: currentUserRole } = useQuery({
    queryKey: ['current-user-role'],
    queryFn: async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return null;
      
      const { data, error } = await supabase
        .from('perfis')
        .select('role')
        .eq('id', authUser.id)
        .single();
      
      if (error) return null;
      return data.role;
    }
  });

  const isAdmin = currentUserRole === 'admin' || currentUserRole === 'superadmin';

  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const { error } = await supabase
        .from('perfis')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Usuário atualizado",
        description: "Informações do usuário foram atualizadas com sucesso!",
      });
      onUpdate();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o usuário.",
      });
    }
  });

  const handleSave = () => {
    const updates: Partial<User> = {
      nome: editedUser.nome,
      role: editedUser.role,
      cidade: editedUser.cidade,
      clinica: editedUser.clinica,
      telefone: editedUser.telefone,
      equipamentos: editedUser.equipamentos,
      observacoes_conteudo: editedUser.observacoes_conteudo
    };

    // Include email in updates if user is admin and email changed
    if (isAdmin && editedUser.email !== user.email) {
      updates.email = editedUser.email;
    }

    updateUserMutation.mutate(updates);
  };

  const hasChanges = JSON.stringify(editedUser) !== JSON.stringify(user);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={editedUser.nome}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editedUser.email}
                  disabled={!isAdmin}
                  className={!isAdmin ? "bg-muted" : ""}
                  onChange={(e) => isAdmin && setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {isAdmin 
                    ? "Como administrador, você pode alterar o email do usuário"
                    : "O email não pode ser alterado por questões de segurança"
                  }
                </p>
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={editedUser.telefone || ''}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, telefone: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Função no Sistema</Label>
                <Select 
                  value={editedUser.role}
                  onValueChange={(value) => setEditedUser(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="consultor">Consultor</SelectItem>
                    <SelectItem value="operador">Operador</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="superadmin">Super Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  placeholder="Ex: São Paulo, SP"
                  value={editedUser.cidade || ''}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, cidade: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="clinica">Clínica/Empresa</Label>
                <Input
                  id="clinica"
                  placeholder="Nome da clínica ou empresa"
                  value={editedUser.clinica || ''}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, clinica: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações sobre Conteúdo</Label>
            <Textarea
              id="observacoes"
              placeholder="Adicione observações sobre o perfil de conteúdo do usuário..."
              value={editedUser.observacoes_conteudo || ''}
              onChange={(e) => setEditedUser(prev => ({ 
                ...prev, 
                observacoes_conteudo: e.target.value 
              }))}
              rows={4}
            />
          </div>

          {editedUser.role === 'admin' || editedUser.role === 'superadmin' ? (
            <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Atenção: Função Administrativa</p>
                <p className="text-sm text-amber-700">
                  Este usuário possui privilégios administrativos. Tenha cuidado ao alterar suas permissões.
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Membro desde: {new Date(user.data_criacao).toLocaleDateString('pt-BR')}
            </p>
            
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges || updateUserMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {updateUserMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBasicInfoEditor;