
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

// Create context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Make sure useAuthState is called inside this functional component
  const authState = useAuthState();
  const { user, isLoading, isAuthenticated } = authState;
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
        description: "Bem-vindo ao ReelLine!",
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
        description: "Bem-vindo ao ReelLine!",
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
