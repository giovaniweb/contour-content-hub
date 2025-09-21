import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, User, MapPin, Building, Phone, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createCompleteUser, checkExistingProfile, type CreateUserData } from '@/services/auth/userManagement';

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
  const [userExistsWarning, setUserExistsWarning] = useState(false);
  const { toast } = useToast();

  const checkForExistingUser = async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    const exists = await checkExistingProfile(email);
    setUserExistsWarning(exists);
  };

  const handleCreateUser = async () => {
    if (!newUser.nome || !newUser.email || !newUser.password) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Nome, email e senha são obrigatórios.",
      });
      return;
    }

    if (userExistsWarning) {
      toast({
        variant: "destructive",
        title: "Usuário já existe",
        description: "Este email já possui um perfil cadastrado no sistema.",
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
        title: "Usuário criado",
        description: "Usuário foi criado com sucesso!",
      });

      resetForm();
      onSuccess();
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      
      let errorMessage = "Não foi possível criar o usuário.";
      let errorTitle = "Erro ao criar usuário";
      
      if (error.message?.includes('User already registered') || error.message?.includes('já está registrado')) {
        errorTitle = "Email já registrado";
        errorMessage = error.message;
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "Email inválido. Verifique o formato do endereço de email.";
      } else if (error.message?.includes('Password')) {
        errorMessage = "Senha deve ter pelo menos 6 caracteres.";
      } else if (error.message?.includes('já existe e possui perfil')) {
        errorTitle = "Usuário já existe";
        errorMessage = "Este usuário já está cadastrado no sistema.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
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
    setUserExistsWarning(false);
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
                          setUserExistsWarning(false); // Limpar aviso quando digitando
                        }}
                        onBlur={() => checkForExistingUser(newUser.email)}
                        className={`pl-10 ${userExistsWarning ? 'border-orange-500 bg-orange-50' : ''}`}
                      />
                    </div>
                    {userExistsWarning && (
                      <p className="text-sm text-orange-600 mt-1">
                        ⚠️ Este email já possui cadastro no sistema
                      </p>
                    )}
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

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleCreateUser()} 
              disabled={isLoading || userExistsWarning}
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