import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { User, Settings, Shield, Trash2, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppFeature } from '@/hooks/useFeatureAccess';

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

interface UserPermission {
  feature: AppFeature;
  enabled: boolean;
  expires_at?: string;
  granted_at?: string;
}

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: ({ id, updates }: { id: string; updates: Partial<User> }) => void;
  onDelete: (id: string) => void;
}

const AVAILABLE_FEATURES: { feature: AppFeature; label: string; description: string }[] = [
  { feature: 'videos', label: 'Vídeos', description: 'Acesso à biblioteca de vídeos' },
  { feature: 'mestre_beleza', label: 'Mestre da Beleza', description: 'Ferramenta de diagnóstico estético' },
  { feature: 'consultor_mkt', label: 'Consultor de Marketing', description: 'Consultoria de marketing' },
  { feature: 'fluida_roteirista', label: 'Fluida Roteirista', description: 'Criação de roteiros' },
  { feature: 'artigos_cientificos', label: 'Documentos', description: 'Acesso a documentos científicos' },
  { feature: 'fotos', label: 'Antes/Depois', description: 'Galeria de fotos antes e depois' },
  { feature: 'equipamentos', label: 'Equipamentos', description: 'Catálogo de equipamentos' },
  { feature: 'planner', label: 'Planejador', description: 'Planejamento de conteúdo' },
  { feature: 'materiais', label: 'Academia', description: 'Cursos e treinamentos' }
];

const EditUserModal: React.FC<EditUserModalProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete 
}) => {
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const { toast } = useToast();

  // Fetch user permissions
  const { data: permissions = [] } = useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_feature_permissions')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && isOpen
  });

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
    if (permissions) {
      setUserPermissions(permissions);
    }
  }, [user, permissions]);

  const handleSaveBasicInfo = () => {
    if (!editedUser) return;
    
    onUpdate({
      id: editedUser.id,
      updates: {
        nome: editedUser.nome,
        role: editedUser.role,
        cidade: editedUser.cidade,
        clinica: editedUser.clinica,
        telefone: editedUser.telefone,
      }
    });
  };

  const handlePermissionToggle = async (feature: AppFeature, enabled: boolean) => {
    if (!user) return;

    try {
      if (enabled) {
        // Grant permission
        const { error } = await supabase
          .from('user_feature_permissions')
          .upsert({
            user_id: user.id,
            feature,
            enabled: true,
            granted_at: new Date().toISOString()
          }, { 
            onConflict: 'user_id,feature'
          });

        if (error) throw error;
      } else {
        // Remove permission
        const { error } = await supabase
          .from('user_feature_permissions')
          .delete()
          .match({ user_id: user.id, feature });

        if (error) throw error;
      }

      // Update local state
      setUserPermissions(prev => {
        const existing = prev.find(p => p.feature === feature);
        if (enabled) {
          if (existing) {
            return prev.map(p => 
              p.feature === feature 
                ? { ...p, enabled: true, granted_at: new Date().toISOString() }
                : p
            );
          } else {
            return [...prev, { 
              feature, 
              enabled: true, 
              granted_at: new Date().toISOString() 
            }];
          }
        } else {
          return prev.filter(p => p.feature !== feature);
        }
      });

      toast({
        title: "Permissão atualizada",
        description: `Permissão ${enabled ? 'concedida' : 'removida'} com sucesso.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar permissão",
        description: error.message,
      });
    }
  };

  const hasPermission = (feature: AppFeature) => {
    return userPermissions.some(p => p.feature === feature && p.enabled);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-300';
      case 'superadmin': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'consultor': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!user || !editedUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Editar Usuário: {user.nome}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={editedUser.nome}
                      onChange={(e) => setEditedUser(prev => 
                        prev ? { ...prev, nome: e.target.value } : null
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editedUser.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={editedUser.role}
                      onValueChange={(value) => setEditedUser(prev =>
                        prev ? { ...prev, role: value } : null
                      )}
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
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="superadmin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Status Atual</Label>
                    <div className="mt-2">
                      <Badge className={getRoleBadgeColor(editedUser.role)}>
                        {editedUser.role}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="clinica">Clínica</Label>
                    <Input
                      id="clinica"
                      value={editedUser.clinica || ''}
                      onChange={(e) => setEditedUser(prev => 
                        prev ? { ...prev, clinica: e.target.value } : null
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={editedUser.cidade || ''}
                      onChange={(e) => setEditedUser(prev => 
                        prev ? { ...prev, cidade: e.target.value } : null
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={editedUser.telefone || ''}
                      onChange={(e) => setEditedUser(prev => 
                        prev ? { ...prev, telefone: e.target.value } : null
                      )}
                    />
                  </div>

                  <div>
                    <Label>Membro desde</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(user.data_criacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveBasicInfo}>
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Controle de Permissões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {AVAILABLE_FEATURES.map(({ feature, label, description }) => (
                    <div key={feature} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{label}</h4>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <Switch
                        checked={hasPermission(feature)}
                        onCheckedChange={(checked) => handlePermissionToggle(feature, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Histórico de atividades será implementado em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button 
            variant="destructive" 
            onClick={() => onDelete(user.id)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Remover Usuário
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;