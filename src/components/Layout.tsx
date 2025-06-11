
import React from 'react';
import { Navbar } from '@/components/navbar/Navbar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  fullWidth?: boolean;
  transparentHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  fullWidth = false,
  transparentHeader = false 
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <div className={`${fullWidth ? 'w-full' : 'container mx-auto'} px-4 py-8`}>
          {(title || subtitle) && (
            <div className="mb-8">
              {title && <h1 className="text-3xl font-bold mb-2">{title}</h1>}
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>
          )}
          
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
