
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { usePermissions } from '@/hooks/use-permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Brain } from 'lucide-react';

const SystemIntelligence: React.FC = () => {
  const { hasPermission } = usePermissions();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <Layout title="Inteligência do Sistema">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Inteligência do Sistema</span>
            </CardTitle>
            <CardDescription>
              Configure e monitore os módulos de IA do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button disabled={isLoading}>
                {isLoading ? 'Carregando...' : 'Configurar IA'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SystemIntelligence;
