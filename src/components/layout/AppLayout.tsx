
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar/sidebar-context';
import Sidebar from './Sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

interface AppLayoutProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar autenticação
  useEffect(() => {
    // Aguardar carregamento da verificação de autenticação
    if (isLoading) {
      return;
    }

    // Se não estiver autenticado, redirecionar para login
    if (!isAuthenticated || !user) {
      console.log('🚫 Usuário não autenticado, redirecionando para login');
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname }
      });
      return;
    }

    // Verificar se precisa ser admin
    if (requireAdmin && user.role !== 'admin') {
      console.log('🚫 Acesso negado: usuário não é admin');
      navigate('/dashboard', { replace: true });
      return;
    }

    console.log('✅ Usuário autenticado:', user.nome || user.email);
  }, [isAuthenticated, user, isLoading, navigate, location.pathname, requireAdmin]);

  // Mostrar loading durante verificação
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

  // Se não estiver autenticado, não renderizar nada (vai redirecionar)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-aurora-background">
        <Sidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 text-slate-50" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-slate-600" />
              <div className="text-slate-50">
                <span className="text-sm">Bem-vindo, </span>
                <span className="font-medium">{user.nome || user.email}</span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
