import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FluidaInput } from "@/components/ui/fluida-input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, User, Lock, Building, MapPin, Phone, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types/auth";

// Definindo os roles permitidos durante registro
const allowedRegisterRoles = ['admin', 'operador', 'consultor'] as const;
type RegisterRole = typeof allowedRegisterRoles[number];

// Criando o esquema de validação com Zod
const registerFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(allowedRegisterRoles).default("operador"),
  clinic: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  language: z.enum(["PT", "EN", "ES"]).default("PT")
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Register: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedRole, setSelectedRole] = useState<RegisterRole>("operador");
  
  // Formulário com react-hook-form + zod
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "operador",
      clinic: "",
      city: "",
      phone: "",
      language: "PT"
    }
  });

  // Handler para atualizar o selectedRole quando o valor do campo role mudar
  const handleRoleChange = (value: RegisterRole) => {
    setSelectedRole(value);
    form.setValue("role", value);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role,
        clinic: values.clinic,
        city: values.city,
        phone: values.phone,
        language: values.language,
        equipment: []
      });
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode fazer login no sistema."
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: error?.message || "Verifique os dados e tente novamente"
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <FluidaInput 
                        {...field}
                        animatedPlaceholder={["Seu nome completo", "Ex: João da Silva"]}
                        iconRight={<User className="h-5 w-5" />}
                      />
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
                      <FluidaInput 
                        {...field}
                        type="email"
                        animatedPlaceholder={["seu@email.com", "contato@empresa.com.br"]} 
                        iconRight={<Mail className="h-5 w-5" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FluidaInput 
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="******"
                          iconRight={
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Conta</FormLabel>
                    <Select 
                      onValueChange={(value) => handleRoleChange(value as RegisterRole)} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            <SelectValue placeholder="Selecione o tipo de conta" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador de Clínica</SelectItem>
                        <SelectItem value="operador">Operador</SelectItem>
                        <SelectItem value="consultor">Consultor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {(selectedRole === "admin") && (
                <FormField
                  control={form.control}
                  name="clinic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Clínica ou Empresa</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Nome da clínica ou empresa" 
                            {...field}
                            className="pl-10" 
                          />
                          <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade (opcional)</FormLabel>
                      <FormControl>
                        <FluidaInput 
                          {...field}
                          animatedPlaceholder={["Sua cidade", "Ex: São Paulo"]} 
                          iconRight={<MapPin className="h-5 w-5" />}
                        />
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
                      <FormLabel>Telefone (opcional)</FormLabel>
                      <FormControl>
                        <FluidaInput 
                          {...field}
                          animatedPlaceholder={["(00) 00000-0000", "(11) 98765-4321"]} 
                          iconRight={<Phone className="h-5 w-5" />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Já tem uma conta? </span>
                <Link to="/login" className="text-primary hover:underline">
                  Faça login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
