
import React from 'react';
import { Toaster } from './ui/toaster';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { usePermissions } from '@/hooks/use-permissions';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
  transparentHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  fullWidth = false,
  transparentHeader = false
}) => {
  const { user } = useAuth();
  const { canViewConsultantPanel } = usePermissions();

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`w-full border-b ${transparentHeader ? 'bg-transparent border-transparent' : ''}`}>
        <div className={`${fullWidth ? 'w-full px-4' : 'container mx-auto'} py-3 flex justify-between items-center`}>
          <Link to={ROUTES.DASHBOARD} className="font-bold text-xl">
            Fluida
          </Link>
          
          <nav className="space-x-4">
            <Link to={ROUTES.DASHBOARD} className="text-sm font-medium">
              Dashboard
            </Link>
            <Link to={ROUTES.CONTENT.STRATEGY} className="text-sm font-medium">
              Estratégia
            </Link>
            <Link to={ROUTES.CONTENT.SCRIPTS.GENERATOR} className="text-sm font-medium">
              Roteiros
            </Link>
            <Link to={ROUTES.CONTENT.CALENDAR} className="text-sm font-medium">
              Agenda
            </Link>
            {canViewConsultantPanel() && (
              <Link to={ROUTES.CONSULTANT.PANEL} className="text-sm font-medium">
                Painel Consultor
              </Link>
            )}
            <Link to={ROUTES.PROFILE} className="text-sm font-medium">
              Perfil
            </Link>
            <Link to={ROUTES.WORKSPACE_SETTINGS} className="text-sm font-medium">
              Configurações
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {title && (
          <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        )}
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
