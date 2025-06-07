
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { usePermissions } from '@/hooks/use-permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AdminContent: React.FC = () => {
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
    <Layout title="Gerenciamento de Conteúdo">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo Administrativo</CardTitle>
            <CardDescription>
              Gerencie o conteúdo do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button disabled={isLoading}>
                {isLoading ? 'Carregando...' : 'Gerenciar Conteúdo'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminContent;
