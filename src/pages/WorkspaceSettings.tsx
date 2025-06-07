
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import WorkspaceUsers from '@/components/workspace/WorkspaceUsers';

const WorkspaceSettings: React.FC = () => {
  return (
    <Layout title="Configurações do Workspace">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Configurações do Workspace</h1>
            <p className="text-muted-foreground">
              Gerencie seu workspace e usuários
            </p>
          </div>
        </div>
        
        <WorkspaceUsers />
        
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configurações adicionais do workspace estarão disponíveis em breve.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WorkspaceSettings;
