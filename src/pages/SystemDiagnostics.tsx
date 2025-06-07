
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { usePermissions } from '@/hooks/use-permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
}

const SystemDiagnostics: React.FC = () => {
  const { hasPermission } = usePermissions();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  if (!hasPermission('admin')) {
    return (
      <Layout title="Acesso Negado">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar esta página.
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  const runDiagnostics = async () => {
    setIsRunning(true);
    
    // Simulated diagnostics
    const results: DiagnosticResult[] = [
      { name: 'Conexão com Banco de Dados', status: 'success', message: 'Conectado com sucesso' },
      { name: 'API Externa', status: 'success', message: 'Respondendo normalmente' },
      { name: 'Cache Redis', status: 'warning', message: 'Latência elevada' },
    ];
    
    setDiagnostics(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Layout title="Diagnósticos do Sistema">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Diagnósticos do Sistema</CardTitle>
            <CardDescription>
              Verifique o status dos componentes do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={runDiagnostics} disabled={isRunning}>
                {isRunning ? 'Executando...' : 'Executar Diagnósticos'}
              </Button>
              
              {diagnostics.length > 0 && (
                <div className="space-y-2">
                  {diagnostics.map((diagnostic, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                      {getStatusIcon(diagnostic.status)}
                      <span className="font-medium">{diagnostic.name}</span>
                      <span className="text-sm text-gray-600">{diagnostic.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SystemDiagnostics;
