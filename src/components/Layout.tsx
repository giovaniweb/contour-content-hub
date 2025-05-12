
import React from 'react';
import AppLayout from './layout/AppLayout';
import { Toaster } from './ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
  transparentHeader?: boolean;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title,
  fullWidth = false,
  transparentHeader = false,
  requireAuth = true
}) => {
  // Adicionar log para debug
  console.log('Layout rendering', { title, fullWidth, transparentHeader });
  
  return (
    <AppLayout requireAuth={requireAuth}>
      <div className={`${fullWidth ? 'w-full' : 'container mx-auto'} py-4`}>
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        )}
        {children}
      </div>
      <Toaster />
    </AppLayout>
  );
};

export default Layout;
