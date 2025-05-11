
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // User form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [clinic, setClinic] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  useEffect(() => {
    if (user) {
      setName(user.nome || '');
      setEmail(user.email || '');
      // For these fields, we would typically fetch from a profile service
      setClinic('');
      setPhone('');
      setCity('');
    }
  }, [user]);
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Call API to update user profile
      // await updateUserProfile(user.id, { name, email, clinic, phone, city });
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar suas informações."
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "As senhas não conferem",
        description: "A nova senha e a confirmação precisam ser idênticas."
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // Call API to change password
      // await changePassword(currentPassword, newPassword);
      
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso."
      });
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao alterar senha",
        description: "Verifique se a senha atual está correta."
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <Layout title="Perfil">Carregando...</Layout>;
  }
  
  if (!user) {
    return <Layout title="Perfil">
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Não autorizado</AlertTitle>
          <AlertDescription>
            Você precisa estar logado para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    </Layout>;
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getRoleName = (role: string) => {
    const roleMapping: { [key: string]: string } = {
      'admin': 'Administrador',
      'gerente': 'Gerente',
      'operador': 'Operador',
      'consultor': 'Consultor',
      'cliente': 'Cliente',
      'superadmin': 'Super Admin'
    };
    
    return roleMapping[role] || 'Usuário';
  };

  return (
    <Layout title="Perfil">
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xl">{getInitials(name || 'User')}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{name || email}</CardTitle>
                <CardDescription>{email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Função</span>
                    <p>{getRoleName(user.role)}</p>
                  </div>
                  
                  {user.workspace_id && (
                    <div>
                      <span className="text-sm text-muted-foreground">Workspace ID</span>
                      <p className="text-xs font-mono bg-muted p-1 rounded">{user.workspace_id}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-2/3">
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
                <TabsTrigger value="preferences">Preferências</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Atualize suas informações pessoais
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSaveProfile}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input 
                          id="name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label htmlFor="clinic">Clínica</Label>
                        <Input 
                          id="clinic" 
                          value={clinic}
                          onChange={(e) => setClinic(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input 
                            id="city" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input 
                            id="phone" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={saving}>
                        {saving ? 'Salvando...' : 'Salvar alterações'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>
                      Altere sua senha
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleChangePassword}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Senha atual</Label>
                        <Input 
                          id="current-password" 
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova senha</Label>
                        <Input 
                          id="new-password" 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirme a nova senha</Label>
                        <Input 
                          id="confirm-password" 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={saving}>
                        {saving ? 'Alterando senha...' : 'Alterar senha'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferências</CardTitle>
                    <CardDescription>
                      Gerencie suas preferências de notificação e idioma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Preferências em breve...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
