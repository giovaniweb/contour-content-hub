
import React, { ReactNode } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/use-permissions';

interface TabContentProps {
  children: ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({ children }) => (
  <div className="p-4">{children}</div>
);

interface ConsultantPanelProps {
  headerTitle?: string;
}

const ConsultantPanel: React.FC<ConsultantPanelProps> = ({ headerTitle = "Área do Consultor" }) => {
  const { user } = useAuth();
  const { canViewConsultantPanel } = usePermissions();
  
  if (!canViewConsultantPanel()) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-4">
            Você não tem permissão para acessar a área do consultor.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{headerTitle}</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <TabContent>
            <h2 className="text-xl font-medium mb-4">Bem-vindo, {user?.nome || 'Consultor'}</h2>
            <p className="text-muted-foreground mb-4">
              Esta é sua central de consultor onde você pode visualizar seus clientes e relatórios.
            </p>
          </TabContent>
        </TabsContent>
        
        <TabsContent value="clients">
          <TabContent>
            <h2 className="text-xl font-medium mb-4">Seus Clientes</h2>
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">Nenhum cliente encontrado</p>
            </div>
          </TabContent>
        </TabsContent>
        
        <TabsContent value="reports">
          <TabContent>
            <h2 className="text-xl font-medium mb-4">Relatórios</h2>
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">Nenhum relatório disponível</p>
            </div>
          </TabContent>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsultantPanel;
