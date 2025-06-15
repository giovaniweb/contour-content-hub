
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar/sidebar-context';
import Sidebar from './Sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import Navbar from '../navbar/Navbar';

interface AppLayoutProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
      return;
    }
    if (requireAdmin && user.role !== 'admin') {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [isAuthenticated, user, isLoading, navigate, location.pathname, requireAdmin]);

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

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col min-h-screen w-full bg-aurora-background">
        {/* TOPBAR FIXA */}
        <Navbar />

        <div className="flex flex-1 w-full">
          {/* SIDEBAR FIXA */}
          <Sidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              {/* Removido SidebarTrigger, pois o trigger está incluso no Navbar se desejado */}
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 text-slate-50" />
                <Separator orientation="vertical" className="mr-2 h-4 bg-slate-600" />
              </div>
            </header>
            <main className="flex-1 overflow-auto pt-2 md:pt-4">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
