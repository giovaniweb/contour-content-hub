
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate, useLocation } from "react-router-dom";
import MaterialContentManager from "@/components/admin/MaterialContentManager";
import EnhancedScientificArticleManager from "@/components/admin/enhanced/EnhancedScientificArticleManager";
import VideoContentManager from "@/components/admin/VideoContentManager";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types/auth";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Images 
} from "lucide-react";

const AdminContent: React.FC = () => {
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const { toast } = useToast();
  
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<string>(
    tabFromUrl === 'videos' || tabFromUrl === 'articles' || 
    tabFromUrl === 'images' || tabFromUrl === 'materials' 
      ? tabFromUrl 
      : 'materials'
  );
  
  useEffect(() => {
    if (tabFromUrl === 'videos' || tabFromUrl === 'articles' || 
        tabFromUrl === 'images' || tabFromUrl === 'materials') {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);
  
  if (!hasPermission('editAllContent' as UserRole)) {
    toast({
      variant: "destructive",
      title: "Acesso Negado",
      description: "Você não possui permissões para acessar esta página",
    });
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Conteúdo ReelLine</h1>
            <p className="text-muted-foreground">
              Gerencie materiais, vídeos, artigos científicos e imagens
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="materials" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Materiais</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Vídeos</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Artigos</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              <span className="hidden sm:inline">Imagens</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="materials" className="space-y-4">
            <MaterialContentManager />
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <VideoContentManager />
          </TabsContent>

          <TabsContent value="articles" className="space-y-4">
            <EnhancedScientificArticleManager />
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="p-8 text-center border rounded-lg">
              <Images className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Gerenciamento de Imagens</h3>
              <p className="text-muted-foreground mb-4">
                Este módulo está em desenvolvimento e estará disponível em breve.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
