
import { User } from "@supabase/supabase-js";

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
  role: 'cliente' | 'admin' | 'operador' | 'vendedor';
};

export type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Omit<UserProfile, "id" | "passwordChanged" | "role"> & { password: string }) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
};
