
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/context/AuthContext';
import AppRoutes from '@/components/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App aurora-dark-bg min-h-screen">
          {/* Aurora background effects */}
          <div className="aurora-particles"></div>
          <div className="aurora-glow"></div>
          
          <AppRoutes />
          
          {/* Toast notifications */}
          <Toaster />
          <SonnerToaster />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
