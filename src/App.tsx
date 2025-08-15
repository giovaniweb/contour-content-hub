
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppRoutes from '@/components/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider defaultOpen={false}>
          <div className="App aurora-dark-bg">
            {/* Aurora background effects */}
            <div className="aurora-particles"></div>
            <div className="aurora-glow"></div>
            
            <AppRoutes />
            
            {/* Toast notifications */}
            <Toaster />
            <SonnerToaster />
          </div>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
