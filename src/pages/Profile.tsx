
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Pencil, Save, User } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }).optional(),
  clinic: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  equipment: z.string().optional(),
  language: z.enum(["PT", "EN", "ES"]),
});

type ProfileForm = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      clinic: user?.clinic || "",
      city: user?.city || "",
      phone: user?.phone || "",
      equipment: user?.equipment?.join(", ") || "",
      language: user?.language || "PT",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      // Parse equipment string to array
      const equipmentArray = data.equipment?.split(",").map(item => item.trim()).filter(Boolean) || [];
      
      await updateUser({
        name: data.name,
        clinic: data.clinic,
        city: data.city,
        phone: data.phone,
        equipment: equipmentArray,
        language: data.language,
      });
      
      setIsEditing(false);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Layout title="Perfil">Carregando...</Layout>;
  }

  const userInitials = user.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();

  return (
    <Layout title="Perfil">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Seu Perfil</CardTitle>
              <CardDescription>Gerencie suas informações pessoais</CardDescription>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              className="ml-auto"
            >
              {isEditing ? (
                "Cancelar"
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </>
              )}
            </Button>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                {/* Seção Avatar */}
                <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6 pb-4 border-b">
                  <Avatar className="h-24 w-24 border-2 border-muted">
                    <AvatarImage src={user.profilePhotoUrl} className="object-cover" />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-xl font-medium">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {user.role === 'admin' && (
                        <Badge variant="outline" className="bg-primary/10 border-primary/20">
                          Administrador
                        </Badge>
                      )}
                      {user.role === 'operador' && (
                        <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20">
                          Operador
                        </Badge>
                      )}
                      {user.role === 'cliente' && (
                        <Badge variant="outline" className="bg-slate-500/10 border-slate-500/20">
                          Cliente
                        </Badge>
                      )}
                      {user.clinic && (
                        <Badge variant="outline" className="bg-primary/5">
                          {user.clinic}
                        </Badge>
                      )}
                      {user.city && (
                        <Badge variant="outline" className="bg-primary/5">
                          {user.city}
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-primary/10">
                        {user.language === "PT" ? "Português" : user.language === "EN" ? "English" : "Español"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Campos de formulário */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!isEditing && "opacity-75"}`}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={true} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clinic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clínica</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="equipment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipamentos (separados por vírgula)</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idioma Preferido</FormLabel>
                        <Select
                          disabled={!isEditing}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o idioma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PT">Português</SelectItem>
                            <SelectItem value="EN">English</SelectItem>
                            <SelectItem value="ES">Español</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              
              {isEditing && (
                <CardFooter className="flex justify-end space-x-4 pt-4 border-t">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      "Salvando..."
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </form>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
