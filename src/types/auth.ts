
export type UserRole = 
  | 'admin' 
  | 'gerente' 
  | 'operador' 
  | 'consultor' 
  | 'superadmin'
  | 'cliente'
  | 'user'
  | 'consultant'
  | 'editAllContent'
  | 'manageClients'
  | 'viewSales';

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  name: string;
  role: UserRole;
  profilePhotoUrl?: string;
  workspace_id?: string;
  clinica?: string;
  cidade?: string;
  telefone?: string;
  equipamentos?: string[];
  idioma?: 'PT' | 'EN' | 'ES';
  passwordChanged?: boolean;
  clinic?: string;
  city?: string;
  phone?: string;
  equipment?: string[];
  language?: "PT" | "EN" | "ES";
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading?: boolean;
  error?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register?: (userData: any) => Promise<void>;
  updateUser?: (data: Partial<UserProfile>) => Promise<void>;
  updatePassword?: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword?: (email: string) => Promise<void>;
  refreshAuth?: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
  clinic?: string;
  city?: string;
  phone?: string;
  equipment?: string[];
  language?: "PT" | "EN" | "ES";
}

export interface Workspace {
  id: string;
  nome: string;
  plano: string;
  criado_em: string;
}

// Legacy User interface for compatibility
export interface User extends UserProfile {}
