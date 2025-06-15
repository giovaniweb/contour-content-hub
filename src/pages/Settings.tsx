import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe } from "lucide-react";

const Settings: React.FC = () => {
  const { toast } = useToast();

  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Perfil salvo",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  const handleSaveNotifications = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Preferências de notificação atualizadas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
  };

  return (
    <AppLayout title="Configurações">
      <div className="container py-8 max-w-4xl mx-auto animate-fade-in">
        <div className="flex items-center mb-6">
          <SettingsIcon className="h-6 w-6 mr-2 text-fluida-blue" />
          <h1 className="text-3xl font-bold text-contourline-darkBlue">Configurações</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e profissionais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" defaultValue="Ana Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="ana.silva@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input id="company" defaultValue="Contourline" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input id="position" defaultValue="Marketing Manager" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-fluida-blue hover:bg-fluida-blueDark">
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Conta</CardTitle>
                <CardDescription>
                  Personalize suas preferências de uso da plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="language">Idioma</Label>
                    <p className="text-sm text-muted-foreground">
                      Selecione o idioma da interface.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>Português (Brasil)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emails de Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba as últimas novidades e dicas.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como e quando deseja receber notificações.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNotifications} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações no Navegador</Label>
                        <p className="text-sm text-muted-foreground">
                          Exibir notificações no navegador quando estiver usando o sistema.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Emails de Atualização</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba emails sobre atualizações importantes de conteúdo.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Lembrete de Tarefas</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificações sobre tarefas próximas do prazo.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-fluida-blue hover:bg-fluida-blueDark">
                      Salvar Preferências
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência visual da plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Tema</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 cursor-pointer border-2 border-primary">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Claro</span>
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                      </div>
                      <div className="h-24 bg-white border"></div>
                    </Card>
                    <Card className="p-4 cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Escuro</span>
                        <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                      </div>
                      <div className="h-24 bg-gray-900"></div>
                    </Card>
                    <Card className="p-4 cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Sistema</span>
                        <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                      </div>
                      <div className="h-24 bg-gradient-to-r from-white to-gray-900"></div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Gerencie a segurança da sua conta e sessões ativas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-muted-foreground">
                        Adicione uma camada extra de segurança à sua conta.
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="bg-fluida-blue hover:bg-fluida-blueDark">
                      Alterar Senha
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
