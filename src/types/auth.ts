
import { User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'gerente' | 'operador' | 'consultor' | 'superadmin';

export type Workspace = {
  id: string;
  nome: string;
  plano: string;
  criado_em: string;
};

export type UserProfile = {
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
  role: UserRole;
  workspace_id?: string;
};

export type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Omit<UserProfile, "id" | "passwordChanged" | "role"> & { password: string; role?: UserRole }) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
};
