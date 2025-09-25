
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [city, setCity] = React.useState('');
  const [clinic, setClinic] = React.useState('');
  const [specialization, setSpecialization] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Senhas não conferem", {
        description: "A senha e a confirmação de senha precisam ser iguais."
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await register({
        email,
        password,
        nome: name,
        telefone: phone,
        cidade: city,
        clinica: clinic,
        especialidade: specialization
      });
      toast.success("Conta criada com sucesso", {
        description: "Você será redirecionado para o dashboard."
      });
      // Navigate to dashboard after successful registration
      navigate('/dashboard');
    } catch (error: any) {
      toast.error("Erro ao criar conta", {
        description: error.message || "Não foi possível criar sua conta. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-light">Criar conta</CardTitle>
          <CardDescription>Cadastre-se para começar a usar o sistema</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nome</label>
              <Input 
                id="name" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Senha</label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirme sua senha</label>
              <Input 
                id="confirmPassword" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Telefone (opcional)</label>
              <Input 
                id="phone" 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">Cidade (opcional)</label>
              <Input 
                id="city" 
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)} 
                placeholder="São Paulo"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="clinic" className="text-sm font-medium">Clínica/Empresa (opcional)</label>
              <Input 
                id="clinic" 
                type="text"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)} 
                placeholder="Nome da sua clínica ou empresa"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="specialization" className="text-sm font-medium">Especialidade (opcional)</label>
              <Input 
                id="specialization" 
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)} 
                placeholder="Estética, Medicina, etc."
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Registrar"}
            </Button>
            <div className="text-center text-sm">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
