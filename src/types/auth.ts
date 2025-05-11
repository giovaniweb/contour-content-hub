
import { User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'gerente' | 'operador' | 'consultor' | 'superadmin' | 'cliente';

export type Workspace = {
  id: string;
  nome: string;
  plano: string;
  criado_em: string;
};

export type UserProfile = {
  id: string;
  email: string;
  nome?: string; 
  clinic?: string;
  city?: string;
  phone?: string;
  equipment?: string[];
  language?: "PT" | "EN" | "ES";
  profilePhotoUrl?: string;
  passwordChanged?: boolean;
  role: UserRole;
  workspace_id?: string;
};

export type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { 
    email: string; 
    password: string; 
    name?: string;
    role?: UserRole;
    clinic?: string;
    city?: string;
    phone?: string;
    equipment?: string[];
    language?: "PT" | "EN" | "ES";
  }) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  error: string | null;
  resetPassword: (email: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
};
