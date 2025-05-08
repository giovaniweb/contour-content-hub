
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }
  
  handleResetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <AlertTriangle className="h-16 w-16 text-amber-500" />
              <h2 className="text-2xl font-bold text-center">Ops! Algo deu errado</h2>
              <p className="text-muted-foreground text-center mb-4">
                Encontramos um problema ao renderizar esta página.
              </p>
              
              <div className="w-full space-y-4">
                <Button asChild variant="default" className="w-full">
                  <Link to="/">Voltar à página inicial</Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    this.handleResetError();
                    window.location.reload();
                  }}
                >
                  Tentar novamente
                </Button>
              </div>
              
              {process.env.NODE_ENV !== 'production' && this.state.error && (
                <div className="mt-6 p-4 bg-muted rounded-md overflow-auto w-full">
                  <p className="font-mono text-xs text-red-500 whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <p className="font-mono text-xs mt-2 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component-level error boundary HOC
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent: React.ReactNode = null
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={FallbackComponent}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
