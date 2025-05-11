
import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

export const ErrorBoundaryGeneric: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="max-w-md w-full p-6 bg-card border rounded-lg shadow-sm">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-destructive/10 rounded-full">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Algo deu errado</h2>
          
          <div className="text-sm text-muted-foreground">
            <p>Ocorreu um erro inesperado na aplicação.</p>
            <div className="mt-2 p-2 bg-muted rounded text-xs text-left overflow-auto">
              <code>{error.message}</code>
            </div>
          </div>

          <Button onClick={resetErrorBoundary} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryGeneric;
