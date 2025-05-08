
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Create a client with retry configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Query error:", error);
      }
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Root error boundary that wraps the whole application
// All providers are inside the error boundary
createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
