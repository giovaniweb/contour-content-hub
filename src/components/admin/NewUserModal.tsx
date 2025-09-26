import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, User, MapPin, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { createCompleteUser, checkExistingProfile, type CreateUserData } from '@/services/auth/userManagement';
import type { UserRole } from '@/types/auth';

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'consultor', label: 'Consultor' },
  { value: 'operador', label: 'Operador' },
  { value: 'gerente', label: 'Gerente' },
  { value: 'admin', label: 'Administrador' }
];

const ESPECIALIDADES = [
  'Médico Dermatologista',
  'Médico Clínico Geral',
  'Enfermeiro(a)',
  'Fisioterapeuta',
  'Biomédico(a)',
  'Esteticista',
  'Cosmetólogo(a)',
  'Técnico em Estética',
  'Outros'
];

const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const EQUIPAMENTOS_COMUNS = [
  'Laser CO2',
  'Laser Nd:YAG',
  'IPL',
  'Radiofrequência',
  'Ultrassom Focado',
  'Criolipólise',
  'Microagulhamento',
  'Peeling Químico',
  'Luz Pulsada',
  'Outros'
];

const NewUserModal: React.FC<NewUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [newUser, setNewUser] = useState<CreateUserData>({
    nome: '',
    email: '',
    password: '',
    role: 'cliente' as UserRole,
    cidade: '',
    clinica: '',
    telefone: '',
    especialidade: '',
    experiencia: '',
    estado: '',
    endereco_completo: '',
    equipamentos: [],
    observacoes_conteudo: '',
    idioma: 'PT' as 'PT' | 'EN' | 'ES'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const checkForExistingUser = async (email: string) => {
    if (!email) {
      setUserExists(false);
      return;
    }

    try {
      const exists = await checkExistingProfile(email);
      setUserExists(exists);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      setUserExists(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.nome || !newUser.email || !newUser.password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (userExists) {
      toast.error('Este email já está em uso');
      return;
    }

    setIsLoading(true);

    // Normalizar payload - remover campos vazios
    const normalizedUserData = { ...newUser };
    
    // Remover campos de string vazios
    Object.keys(normalizedUserData).forEach(key => {
      const value = normalizedUserData[key];
      if (typeof value === 'string' && !value.trim()) {
        delete normalizedUserData[key];
      }
    });

    // Manter arrays apenas quando têm itens
    if (!normalizedUserData.equipamentos || normalizedUserData.equipamentos.length === 0) {
      delete normalizedUserData.equipamentos;
    }

    try {
      toast.info('Criando usuário...');
      await createCompleteUser(normalizedUserData);
      toast.success('Usuário criado com sucesso! Email de boas-vindas enviado.');
      onSuccess();
      resetForm();
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário', {
        description: error.message || 'Não foi possível criar o usuário. Tente novamente.'
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
      role: 'cliente' as UserRole,
      cidade: '',
      clinica: '',
      telefone: '',
      especialidade: '',
      experiencia: '',
      estado: '',
      endereco_completo: '',
      equipamentos: [],
      observacoes_conteudo: '',
      idioma: 'PT' as 'PT' | 'EN' | 'ES'
    });
    setUserExists(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addEquipamento = (equipamento: string) => {
    if (!newUser.equipamentos?.includes(equipamento)) {
      setNewUser(prev => ({
        ...prev,
        equipamentos: [...(prev.equipamentos || []), equipamento]
      }));
    }
  };

  const removeEquipamento = (equipamento: string) => {
    setNewUser(prev => ({
      ...prev,
      equipamentos: prev.equipamentos?.filter(e => e !== equipamento) || []
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Criar Novo Usuário
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo usuário no sistema
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-4 w-4" />
                Informações Básicas
              </CardTitle>
              <CardDescription>Dados de acesso e identificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={newUser.nome}
                  onChange={(e) => setNewUser(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome completo do usuário"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => {
                    setNewUser(prev => ({ ...prev, email: e.target.value }));
                    checkForExistingUser(e.target.value);
                  }}
                  placeholder="email@exemplo.com"
                />
                {userExists && (
                  <p className="text-sm text-red-500">Este email já está em uso!</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Senha temporária"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função *</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as UserRole }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone/WhatsApp</Label>
                <Input
                  id="telefone"
                  value={newUser.telefone || ''}
                  onChange={(e) => setNewUser(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-4 w-4" />
                Perfil Profissional
              </CardTitle>
              <CardDescription>Especialidade e experiência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade</Label>
                <Select 
                  value={newUser.especialidade || ''} 
                  onValueChange={(value) => setNewUser(prev => ({ ...prev, especialidade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESPECIALIDADES.map(esp => (
                      <SelectItem key={esp} value={esp}>
                        {esp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinica">Clínica/Consultório</Label>
                <Input
                  id="clinica"
                  value={newUser.clinica || ''}
                  onChange={(e) => setNewUser(prev => ({ ...prev, clinica: e.target.value }))}
                  placeholder="Nome da clínica ou consultório"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experiencia">Tempo de Experiência</Label>
                <Select 
                  value={newUser.experiencia || ''} 
                  onValueChange={(value) => setNewUser(prev => ({ ...prev, experiencia: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tempo de experiência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menos_1_ano">Menos de 1 ano</SelectItem>
                    <SelectItem value="1_3_anos">1 a 3 anos</SelectItem>
                    <SelectItem value="3_5_anos">3 a 5 anos</SelectItem>
                    <SelectItem value="5_10_anos">5 a 10 anos</SelectItem>
                    <SelectItem value="mais_10_anos">Mais de 10 anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idioma">Idioma Preferido</Label>
                <Select 
                  value={newUser.idioma || 'PT'} 
                  onValueChange={(value) => setNewUser(prev => ({ ...prev, idioma: value as 'PT' | 'EN' | 'ES' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PT">Português</SelectItem>
                    <SelectItem value="EN">English</SelectItem>
                    <SelectItem value="ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-4 w-4" />
                Localização
              </CardTitle>
              <CardDescription>Endereço e localização</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={newUser.cidade || ''}
                    onChange={(e) => setNewUser(prev => ({ ...prev, cidade: e.target.value }))}
                    placeholder="São Paulo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select 
                    value={newUser.estado || ''} 
                    onValueChange={(value) => setNewUser(prev => ({ ...prev, estado: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_BRASIL.map(estado => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Textarea
                  id="endereco"
                  value={newUser.endereco_completo || ''}
                  onChange={(e) => setNewUser(prev => ({ ...prev, endereco_completo: e.target.value }))}
                  placeholder="Rua, número, bairro, complemento..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Equipamentos e Interesses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Equipamentos de Interesse</CardTitle>
              <CardDescription>Equipamentos com os quais trabalha ou tem interesse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Selecionar Equipamentos</Label>
                <Select onValueChange={addEquipamento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Adicionar equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPAMENTOS_COMUNS.map(eq => (
                      <SelectItem key={eq} value={eq}>
                        {eq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Equipamentos Selecionados</Label>
                <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md bg-muted/30">
                  {newUser.equipamentos?.length ? (
                    newUser.equipamentos.map((equipamento) => (
                      <Badge
                        key={equipamento}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {equipamento}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeEquipamento(equipamento)}
                        />
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Nenhum equipamento selecionado</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Adicionais</Label>
                <Textarea
                  id="observacoes"
                  value={newUser.observacoes_conteudo || ''}
                  onChange={(e) => setNewUser(prev => ({ ...prev, observacoes_conteudo: e.target.value }))}
                  placeholder="Informações adicionais, interesses específicos, etc."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateUser} 
            disabled={isLoading || userExists || !newUser.nome || !newUser.email || !newUser.password}
          >
            {isLoading ? 'Salvando perfil...' : 'Criar Usuário'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserModal;