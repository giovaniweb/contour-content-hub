
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryGeneric extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Você também pode registrar o erro em um serviço de relatório de erros
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI de fallback personalizada
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-background text-foreground">
          <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6 border border-border">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
              <h2 className="text-2xl font-bold">Algo deu errado</h2>
              <div className="text-muted-foreground">
                <p>Ocorreu um erro inesperado nesta parte da aplicação.</p>
                <p className="mt-2">Tente recarregar esta seção ou a página completa.</p>
              </div>
              
              <div className="mt-4 space-x-2">
                <Button variant="outline" onClick={this.handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar novamente
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Recarregar página
                </Button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-6 text-left w-full">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-red-500 font-medium">Detalhes do erro (somente desenvolvimento)</summary>
                    <pre className="mt-2 p-4 bg-muted rounded overflow-x-auto text-xs">
                      {this.state.error.toString()}
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Se não houver erro, renderiza os filhos normalmente
    return this.props.children;
  }
}

export default ErrorBoundaryGeneric;
