
import React from "react";
import { FileText, BookOpen, Video, Images, LayoutDashboard } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import MaterialContentManager from "@/components/admin/MaterialContentManager";
import ScientificArticleManager from "@/components/admin/ScientificArticleManager";
import VideoContentManager from "@/components/admin/VideoContentManager";

const AdminContent: React.FC = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-8">
        {/* Header estilo aurora */}
        <div className="flex items-center justify-between mb-10 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <LayoutDashboard className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Gerenciar Conteúdo
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Administre materiais, vídeos e artigos científicos do sistema
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Materiais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Materiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MaterialContentManager />
            </CardContent>
          </Card>
          
          {/* Vídeos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Vídeos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VideoContentManager />
            </CardContent>
          </Card>

          {/* Artigos Científicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Artigos Científicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScientificArticleManager />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;

