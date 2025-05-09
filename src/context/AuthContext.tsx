
import React, { createContext, useContext } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, UserProfile } from "@/types/auth";
import { 
  loginWithEmailAndPassword, 
  logoutUser, 
  registerUser, 
  updateUserPassword, 
  updateUserProfile 
} from "@/services/authService";

// Create context with a safe default value instead of undefined
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateUser: async () => {},
  updatePassword: async () => false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Make sure useAuthState is called inside this functional component
  const { user, isLoading, isAuthenticated } = useAuthState();
  const { toast } = useToast();
  
  console.log("AuthProvider state:", { 
    isAuthenticated,
    isLoading,
    userExists: !!user,
    userDetails: user ? { id: user.id, name: user.name, role: user.role } : null
  });
  
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await loginWithEmailAndPassword(email, password);
      
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
        description: "Bem-vindo ao Fluida!",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login falhou",
        description: error?.message || "Algo deu errado",
      });
    }
  };

  const register = async (userData: Omit<UserProfile, "id" | "passwordChanged" | "role"> & { password: string }) => {
    try {
      await registerUser(userData);
      
      toast({
        title: "Registro bem-sucedido",
        description: "Bem-vindo ao Fluida!",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registro falhou",
        description: error?.message || "Algo deu errado",
      });
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await updateUserPassword(newPassword);
      
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
      const { error } = await updateUserProfile(user.id, data);
        
      if (error) {
        toast({
          variant: "destructive",
          title: "Atualização falhou",
          description: error.message,
        });
        return;
      }
      
      // Update local state
      // Note: The local state will be updated by the auth listener
      
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
      await logoutUser();
      
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

  // Always provide a complete context value, never null
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a safer hook that throws helpful error if used outside provider
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error(
      "useAuth deve ser usado dentro de um AuthProvider. " +
      "Verifique se o componente está dentro da árvore do AuthProvider."
    );
  }
  
  return context;
};

// Create a safe auth hook that provides graceful fallbacks
export const useSafeAuth = () => {
  try {
    return useContext(AuthContext);
  } catch (error) {
    // Return safe default state if context is unavailable
    console.error("Erro ao acessar AuthContext:", error);
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: async () => {},
      logout: async () => {},
      register: async () => {},
      updateUser: async () => {},
      updatePassword: async () => false
    };
  }
};
