
export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  role: 'admin' | 'user' | 'consultant';
  profilePhotoUrl?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
}
