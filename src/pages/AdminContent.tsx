
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate, Link } from "react-router-dom";
import VideoContentManager from "@/components/admin/VideoContentManager";
import MaterialContentManager from "@/components/admin/MaterialContentManager";
import ScientificArticleManager from "@/components/admin/ScientificArticleManager";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileVideo, Upload } from "lucide-react";

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
              Gerencie vídeos, materiais e artigos científicos da biblioteca de conteúdo
            </p>
          </div>
          
          {activeTab === "videos" && (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/admin/videos/batch-import">
                  <FileVideo className="mr-2 h-4 w-4" />
                  Importação em Massa
                </Link>
              </Button>
              <Button asChild>
                <Link to="/admin/vimeo-settings">
                  <Upload className="mr-2 h-4 w-4" />
                  Configurar Vimeo
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="videos" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="materials">Materiais</TabsTrigger>
            <TabsTrigger value="articles">Artigos Científicos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="space-y-4">
            <VideoContentManager />
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-4">
            <MaterialContentManager />
          </TabsContent>

          <TabsContent value="articles" className="space-y-4">
            <ScientificArticleManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminContent;
