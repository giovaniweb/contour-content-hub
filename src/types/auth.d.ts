
export type UserRole = 
  | 'admin' 
  | 'gerente' 
  | 'operador' 
  | 'consultor'
  | 'superadmin'
  | 'cliente'
  | 'viewSales'
  | 'manageClients'
  | 'editAllContent';

export type WorkspaceRole = 
  | 'admin' 
  | 'gerente' 
  | 'operador' 
  | 'consultor';

export interface Workspace {
  id: string;
  nome: string;
  plano: string;
  criado_em: string;
}

export interface User {
  id: string;
  nome?: string;
  email: string;
  workspace_id?: string;
  role: UserRole;
  clinic?: string;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  workspace_id?: string;
  passwordChanged?: boolean;
  clinic?: string;
  city?: string;
  phone?: string;
  equipment?: string[];
  language?: "PT" | "EN" | "ES";
  profilePhotoUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
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
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
  isLoading: boolean;
}
