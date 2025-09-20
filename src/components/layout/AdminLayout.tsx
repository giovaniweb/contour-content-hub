
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/use-permissions';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { hasPermission, isSuperUserByEmailSync } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificação de autenticação e acesso admin
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
      return;
    }
    
    // Check superuser allowlist first (synchronous)
    if (isSuperUserByEmailSync(user.email)) {
      return; // Allow access
    }
    
    // Otherwise check normal permissions
    if (!hasPermission('admin')) {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [isAuthenticated, user, isLoading, navigate, location.pathname, hasPermission, isSuperUserByEmailSync]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aurora-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-electric-purple"></div>
          <p className="text-slate-50">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-aurora-background">
      <main className="flex-1 overflow-auto pt-2 md:pt-4 px-2 md:px-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
