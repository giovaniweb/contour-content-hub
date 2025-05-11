
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/theme-provider';
import App from './App.tsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './index.css';

// Create a client with correct configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Error handling for mutations
      onError: (error) => {
        console.error("Mutation error:", error);
      }
    }
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
        <ThemeProvider defaultTheme="light">
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
