
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/theme-provider';
import App from './App.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryGeneric } from '@/components/ErrorBoundaryGeneric';
import './index.css';

const queryClient = new QueryClient();

console.log('Application starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

console.log('Mounting React application');

createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorBoundaryGeneric}>
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
