
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";
import VideoContentManager from "@/components/admin/VideoContentManager";
import MaterialContentManager from "@/components/admin/MaterialContentManager";
import { useToast } from "@/hooks/use-toast";

const AdminContent: React.FC = () => {
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState<string>("videos");
  const { toast } = useToast();
  
  // Only users with admin or operator roles can access this page
  if (!hasPermission("editAllContent")) {
    toast({
      variant: "destructive",
      title: "Acesso Negado",
      description: "Você não possui permissões para acessar esta página",
    });
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout title="Gerenciamento de Conteúdo">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Conteúdo ReelLine</h1>
            <p className="text-muted-foreground">
              Gerencie vídeos e materiais da biblioteca de conteúdo
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="videos" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="materials">Materiais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="space-y-4">
            <VideoContentManager />
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-4">
            <MaterialContentManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminContent;
