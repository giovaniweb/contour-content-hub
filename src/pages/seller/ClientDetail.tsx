
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { usePermissions } from '@/hooks/use-permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = usePermissions();

  if (!hasPermission('viewSales')) {
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
    <Layout title={`Cliente ${id}`}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Cliente</CardTitle>
            <CardDescription>
              Informações detalhadas do cliente {id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Detalhes do cliente serão implementados aqui.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClientDetail;
