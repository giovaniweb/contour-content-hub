
export type UserRole = 
  | 'superadmin' 
  | 'admin' 
  | 'gerente' 
  | 'operador' 
  | 'consultor' 
  | 'cliente'
  | 'editAllContent'
  | 'manageClients'
  | 'viewSales';

export interface UserProfile {
  id: string;
  email: string;
  nome?: string;
  role: UserRole;
  clinica?: string;
  cidade?: string;
  telefone?: string;
  equipamentos?: string[];
  idioma?: 'PT' | 'EN' | 'ES';
  workspace_id?: string;
  profilePhotoUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: UserProfile["role"];
  clinic?: string;
  city?: string;
  phone?: string;
  equipment?: string[];
  language?: "PT" | "EN" | "ES";
}
