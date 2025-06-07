
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { usePermissions } from '@/hooks/use-permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Users } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  status: string;
}

const ClientList: React.FC = () => {
  const { hasPermission } = usePermissions();
  const [clients] = useState<Client[]>([
    { id: '1', name: 'Cliente 1', email: 'cliente1@example.com', status: 'Ativo' },
    { id: '2', name: 'Cliente 2', email: 'cliente2@example.com', status: 'Pendente' },
  ]);

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
    <Layout title="Lista de Clientes">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Clientes</span>
            </CardTitle>
            <CardDescription>
              Gerencie sua lista de clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-medium">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{client.status}</span>
                    <Button size="sm" variant="outline">Ver Detalhes</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClientList;
