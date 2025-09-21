import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, User, MapPin, Building, Phone, AlertTriangle, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createCompleteUser, checkOrphanUser, type CreateUserData, type OrphanUser } from '@/services/auth/userManagement';

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [newUser, setNewUser] = useState({
    nome: '',
    email: '',
    password: '',
    role: 'user',
    cidade: '',
    clinica: '',
    telefone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orphanUser, setOrphanUser] = useState<OrphanUser | null>(null);
  const [showOrphanDialog, setShowOrphanDialog] = useState(false);
  const { toast } = useToast();

  const checkForOrphanUser = async (email: string) => {
    if (!email) return;
    
    const orphan = await checkOrphanUser(email);
    if (orphan) {
      setOrphanUser(orphan);
      setShowOrphanDialog(true);
    } else {
      setOrphanUser(null);
      setShowOrphanDialog(false);
    }
  };

  const handleCreateUser = async (adoptOrphan = false) => {
    if (!newUser.nome || !newUser.email || (!newUser.password && !adoptOrphan)) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: adoptOrphan 
          ? "Nome e email são obrigatórios." 
          : "Nome, email e senha são obrigatórios.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const userData: CreateUserData = {
        nome: newUser.nome,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role as any,
        cidade: newUser.cidade || undefined,
        clinica: newUser.clinica || undefined,
        telefone: newUser.telefone || undefined,
      };

      await createCompleteUser(userData);

      toast({
        title: adoptOrphan ? "Usuário recuperado" : "Usuário criado",
        description: adoptOrphan 
          ? "Perfil criado para usuário existente com sucesso!" 
          : "Usuário foi criado com sucesso!",
      });

      resetForm();
      onSuccess();
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      
      let errorMessage = "Não foi possível criar o usuário.";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = "Este email já está registrado. Verifique se o usuário já existe ou se precisa de um perfil.";
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "Email inválido. Verifique o formato do endereço de email.";
      } else if (error.message?.includes('Password')) {
        errorMessage = "Senha deve ter pelo menos 6 caracteres.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setShowOrphanDialog(false);
    }
  };

  const resetForm = () => {
    setNewUser({
      nome: '',
      email: '',
      password: '',
      role: 'user',
      cidade: '',
      clinica: '',
      telefone: ''
    });
    setOrphanUser(null);
    setShowOrphanDialog(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Criar Novo Usuário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações Básicas
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    placeholder="Nome completo"
                    value={newUser.nome}
                    onChange={(e) => setNewUser(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={newUser.email}
                        onChange={(e) => {
                          const email = e.target.value;
                          setNewUser(prev => ({ ...prev, email }));
                          // Verificar usuário órfão quando sair do campo
                          if (email && email.includes('@')) {
                            checkForOrphanUser(email);
                          }
                        }}
                        onBlur={() => checkForOrphanUser(newUser.email)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                <div>
                  <Label htmlFor="password">Senha Temporária *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Senha inicial"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="role">Tipo de Usuário</Label>
                  <Select 
                    value={newUser.role}
                    onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Profissionais */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Informações Profissionais
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="clinica">Clínica/Empresa</Label>
                  <Input
                    id="clinica"
                    placeholder="Nome da clínica ou empresa"
                    value={newUser.clinica}
                    onChange={(e) => setNewUser(prev => ({ ...prev, clinica: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cidade"
                      placeholder="Cidade"
                      value={newUser.cidade}
                      onChange={(e) => setNewUser(prev => ({ ...prev, cidade: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      value={newUser.telefone}
                      onChange={(e) => setNewUser(prev => ({ ...prev, telefone: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerta para usuário órfão */}
          {orphanUser && showOrphanDialog && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="space-y-2">
                  <p className="font-medium">Usuário existente encontrado</p>
                  <p className="text-sm">
                    Este email já está registrado no sistema desde {new Date(orphanUser.created_at).toLocaleDateString('pt-BR')}, 
                    mas não possui um perfil completo.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      onClick={() => handleCreateUser(true)}
                      disabled={isLoading}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      {isLoading ? 'Recuperando...' : 'Recuperar Usuário'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowOrphanDialog(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleCreateUser(false)} 
              disabled={isLoading || showOrphanDialog}
            >
              {isLoading ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserModal;