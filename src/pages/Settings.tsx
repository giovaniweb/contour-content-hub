
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Lock } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(8, "Nova senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(8, "Confirme sua nova senha"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

const Settings: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onChangePassword = async (data: PasswordForm) => {
    setIsLoading(true);
    try {
      const success = await updatePassword(data.currentPassword, data.newPassword);
      
      if (success) {
        passwordForm.reset();
        toast({
          title: "Senha atualizada",
          description: "Sua senha foi alterada com sucesso",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Layout title="Configurações">Carregando...</Layout>;
  }

  return (
    <Layout title="Configurações">
      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>
                  Atualize sua senha para manter sua conta segura
                </CardDescription>
              </CardHeader>
              
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onChangePassword)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha Atual</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Nova Senha</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Atualizando..." : "Atualizar Senha"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Aviso importante</AlertTitle>
              <AlertDescription>
                Sempre use uma senha forte e única. Nunca compartilhe sua senha com ninguém.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Configurações de Email</CardTitle>
                <CardDescription>
                  Gerencie suas preferências de notificações por email
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="marketing-emails" className="flex items-center gap-2">
                    <input type="checkbox" id="marketing-emails" className="h-4 w-4" />
                    <span>Receber emails sobre novos recursos e atualizações</span>
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reminder-emails" className="flex items-center gap-2">
                    <input type="checkbox" id="reminder-emails" className="h-4 w-4" />
                    <span>Receber lembretes do calendário de conteúdo</span>
                  </Label>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline">Salvar Preferências</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
