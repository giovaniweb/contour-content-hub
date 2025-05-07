
import React from 'react';
import Layout from '@/components/Layout';
import VimeoAccountManager from '@/components/vimeo/VimeoAccountManager';
import VimeoSetupInstructions from '@/components/vimeo/VimeoSetupInstructions';
import { usePermissions } from '@/hooks/use-permissions';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';

const AdminVimeoSettings: React.FC = () => {
  const { isAdmin } = usePermissions();
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-contourline-darkBlue">Configuração do Vimeo</h1>
        
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="setup">Instruções de Configuração</TabsTrigger>
            <TabsTrigger value="account">Conta Conectada</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="mt-0">
            <Card className="p-6">
              <VimeoSetupInstructions />
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="mt-0">
            <VimeoAccountManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminVimeoSettings;
