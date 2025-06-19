
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/theme-provider';
import App from './App.tsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './index.css';

// Importa QueryClient centralizado
import { queryClient } from './config/queryClient';

console.log('Application starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

console.log('Mounting React application');

createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider defaultTheme="light">
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('React application mounted');
