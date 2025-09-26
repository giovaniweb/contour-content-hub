
export type UserRole = 
  | 'admin' 
  | 'gerente' 
  | 'operador' 
  | 'consultor' 
  | 'superadmin'
  | 'cliente'
  | 'editAllContent'
  | 'manageClients'
  | 'viewSales';

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
  nome?: string;
  email: string;
  role: UserRole;
  workspace_id?: string;
  passwordChanged?: boolean;
  clinica?: string;
  cidade?: string;
  telefone?: string;
  equipamentos?: string[];
  idioma?: "PT" | "EN" | "ES";
  foto_url?: string;
  especialidade?: string;
  estado?: string;
  endereco_completo?: string;
  observacoes_conteudo?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
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
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  refreshAuth: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  isLoading: boolean;
  isAuthenticated?: boolean;
}
