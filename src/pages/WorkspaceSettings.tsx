
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import WorkspaceUsers from '@/components/workspace/WorkspaceUsers';
import { updateUserProfileSettings } from '@/services/userProfileService';

const communicationSettingsSchema = z.object({
  stylePreference: z.string({
    required_error: 'Por favor selecione um estilo preferido',
  }),
  communicationFocus: z.string({
    required_error: 'Por favor selecione um foco de comunicação',
  }),
  procedures: z.array(z.string()).optional(),
});

type CommunicationSettingsValues = z.infer<typeof communicationSettingsSchema>;

const proceduresOptions = [
  { id: 'rejuvenescimento', label: 'Rejuvenescimento Facial' },
  { id: 'gordura', label: 'Redução de Gordura' },
  { id: 'flacidez', label: 'Tratamento de Flacidez' },
  { id: 'celulite', label: 'Redução de Celulite' },
  { id: 'depilacao', label: 'Depilação a Laser' },
];

const WorkspaceSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const communicationForm = useForm<CommunicationSettingsValues>({
    resolver: zodResolver(communicationSettingsSchema),
    defaultValues: {
      stylePreference: 'emocional',
      communicationFocus: 'autoridade',
      procedures: [],
    },
  });
  
  const handleCommunicationSubmit = async (values: CommunicationSettingsValues) => {
    if (!user?.id) return;
    
    try {
      setIsSubmitting(true);
      
      await updateUserProfileSettings({
        userId: user.id,
        stylePreference: values.stylePreference,
        communicationFocus: values.communicationFocus,
        procedures: values.procedures,
      });
      
      toast({
        title: 'Configurações atualizadas',
        description: 'Suas preferências de comunicação foram atualizadas com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        title: 'Erro ao atualizar configurações',
        description: error.message || 'Ocorreu um erro ao atualizar suas configurações.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Configurações do Workspace</h1>
        
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="communication">Comunicação</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <WorkspaceUsers />
          </TabsContent>
          
          <TabsContent value="communication">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Comunicação</CardTitle>
                <CardDescription>
                  Configure como os conteúdos gerados pelo sistema serão adaptados para o seu negócio.
                  Essas configurações serão usadas pelo Fluida Intelligence Core.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...communicationForm}>
                  <form onSubmit={communicationForm.handleSubmit(handleCommunicationSubmit)} className="space-y-6">
                    <FormField
                      control={communicationForm.control}
                      name="stylePreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estilo de Comunicação Preferido</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um estilo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="emocional">Emocional</SelectItem>
                              <SelectItem value="direto">Direto e Objetivo</SelectItem>
                              <SelectItem value="tecnico">Técnico/Científico</SelectItem>
                              <SelectItem value="engracado">Descontraído/Bem-humorado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={communicationForm.control}
                      name="communicationFocus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Foco de Comunicação</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um foco" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="autoridade">Autoridade no Assunto</SelectItem>
                              <SelectItem value="resultados">Resultados/Antes e Depois</SelectItem>
                              <SelectItem value="preco">Preço/Promoções</SelectItem>
                              <SelectItem value="diferencial">Diferenciais da Clínica</SelectItem>
                              <SelectItem value="educativo">Conteúdo Educativo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={communicationForm.control}
                      name="procedures"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Procedimentos Oferecidos</FormLabel>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {proceduresOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={communicationForm.control}
                                name="procedures"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedProcedures = checked
                                              ? [...(field.value || []), option.id]
                                              : field.value?.filter(
                                                  (value) => value !== option.id
                                                ) || [];
                                            field.onChange(updatedProcedures);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Salvando...' : 'Salvar Preferências'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="workspace">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Workspace</CardTitle>
                <CardDescription>
                  Configure as informações básicas do seu workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Nome da Clínica/Empresa</FormLabel>
                      <Input value={user?.clinic || ''} disabled />
                    </div>
                    <div>
                      <FormLabel>Plano Atual</FormLabel>
                      <Input value="Free" disabled />
                    </div>
                  </div>
                  
                  <div>
                    <FormLabel>ID do Workspace</FormLabel>
                    <Input value={user?.workspace_id || ''} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WorkspaceSettings;
