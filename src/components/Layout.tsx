
import React from 'react';
import { Toaster } from './ui/toaster';
import { Link } from 'react-router-dom';
import { usePermissions } from '@/hooks/use-permissions';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { canViewConsultantPanel } = usePermissions();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full border-b">
        <div className="container mx-auto py-3 flex justify-between items-center">
          <Link to="/dashboard" className="font-bold text-xl">
            Fluida
          </Link>
          
          <nav className="space-x-4">
            <Link to="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/content-strategy" className="text-sm font-medium">
              Estratégia
            </Link>
            <Link to="/script-generator" className="text-sm font-medium">
              Roteiros
            </Link>
            {canViewConsultantPanel() && (
              <Link to="/consultant" className="text-sm font-medium">
                Painel Consultor
              </Link>
            )}
            <Link to="/profile" className="text-sm font-medium">
              Perfil
            </Link>
            <Link to="/workspace-settings" className="text-sm font-medium">
              Configurações
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Fluida AI
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Layout;
