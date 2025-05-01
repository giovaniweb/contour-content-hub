
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  clinic?: string;
  city?: string;
  phone?: string;
  equipment?: string[];
  language: "PT" | "EN" | "ES";
  profilePhotoUrl?: string;
  passwordChanged: boolean;
  role: 'cliente' | 'admin' | 'operador';
};

type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Omit<UserProfile, "id" | "passwordChanged" | "role"> & { password: string }) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Inicializar sessão e listener de autenticação
  useEffect(() => {
    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Buscar perfil do usuário quando a sessão mudar
          setTimeout(async () => {
            const userProfile = await fetchUserProfile(currentSession.user.id);
            setUser(userProfile);
          }, 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Verificar sessão inicial
    const initSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession?.user) {
        const userProfile = await fetchUserProfile(initialSession.user.id);
        setUser(userProfile);
        setSession(initialSession);
      }
      
      setIsLoading(false);
    };
    
    initSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      // Buscar perfil do usuário no Supabase
      const { data: perfil, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !perfil) {
        console.error("Erro ao buscar perfil:", error);
        return null;
      }

      // Type guard to ensure role is one of the allowed values
      const validateRole = (role: string): 'cliente' | 'admin' | 'operador' => {
        if (role === 'cliente' || role === 'admin' || role === 'operador') {
          return role;
        }
        return 'cliente'; // Default to 'cliente' if an invalid role is found
      };

      // Converter o formato do banco para o formato esperado pelo frontend
      return {
        id: perfil.id,
        name: perfil.nome || '',
        email: perfil.email,
        clinic: perfil.clinica || '',
        city: perfil.cidade || '',
        phone: perfil.telefone || '',
        equipment: perfil.equipamentos || [],
        language: (perfil.idioma?.toUpperCase() as "PT" | "EN" | "ES") || "EN",
        profilePhotoUrl: perfil.foto_url || '/placeholder.svg',
        passwordChanged: true, // Presumimos que usuários no banco já alteraram a senha
        role: validateRole(perfil.role || 'cliente')
      };
    } catch (error) {
      console.error("Erro ao processar perfil:", error);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Login falhou",
          description: error.message || "Verifique seu email e senha",
        });
        return;
      }
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao ReelLine!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login falhou",
        description: error?.message || "Algo deu errado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<UserProfile, "id" | "passwordChanged" | "role"> & { password: string }) => {
    try {
      setIsLoading(true);
      
      // Registrar o usuário no auth do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            nome: userData.name,
          },
        },
      });
      
      if (authError) {
        toast({
          variant: "destructive",
          title: "Registro falhou",
          description: authError.message,
        });
        return;
      }
      
      // Se o registro for bem-sucedido, atualizar o perfil com dados adicionais
      if (authData.user) {
        const { error: updateError } = await supabase
          .from('perfis')
          .update({
            nome: userData.name,
            clinica: userData.clinic,
            cidade: userData.city,
            telefone: userData.phone,
            equipamentos: userData.equipment || [],
            idioma: userData.language.toLowerCase(),
            role: 'cliente'  // Novos usuários sempre começam como clientes
          })
          .eq('id', authData.user.id);
          
        if (updateError) {
          console.error("Erro ao atualizar perfil:", updateError);
        }
      }
      
      toast({
        title: "Registro bem-sucedido",
        description: "Bem-vindo ao ReelLine!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registro falhou",
        description: error?.message || "Algo deu errado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Atualização de senha falhou",
          description: error.message,
        });
        return false;
      }
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso",
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Atualização de senha falhou",
        description: error?.message || "Algo deu errado",
      });
      return false;
    }
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      // Converter do formato frontend para o formato do banco
      const perfilData: any = {};
      
      if (data.name) perfilData.nome = data.name;
      if (data.clinic) perfilData.clinica = data.clinic;
      if (data.city) perfilData.cidade = data.city;
      if (data.phone) perfilData.telefone = data.phone;
      if (data.equipment) perfilData.equipamentos = data.equipment;
      if (data.language) perfilData.idioma = data.language.toLowerCase();
      if (data.profilePhotoUrl) perfilData.foto_url = data.profilePhotoUrl;
      
      const { error } = await supabase
        .from('perfis')
        .update(perfilData)
        .eq('id', user.id);
        
      if (error) {
        toast({
          variant: "destructive",
          title: "Atualização falhou",
          description: error.message,
        });
        return;
      }
      
      // Atualizar estado local
      setUser({ ...user, ...data });
      
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Atualização falhou",
        description: error?.message || "Algo deu errado",
      });
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate("/");
      
      toast({
        title: "Logout realizado",
        description: "Você saiu com sucesso",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Falha ao sair",
        description: error?.message || "Algo deu errado",
      });
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateUser,
    updatePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
