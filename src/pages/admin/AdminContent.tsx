
import React from "react";
import {
  FileText,
  BookOpen,
  Video,
  Images,
  LayoutDashboard,
} from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import MaterialContentManager from "@/components/admin/MaterialContentManager";
import ScientificArticleManager from "@/components/admin/ScientificArticleManager";
import VideoContentManager from "@/components/admin/VideoContentManager";

const AdminContent: React.FC = () => {
  return (
    <AdminLayout>
      <div
        className="
          min-h-screen
          aurora-gradient-bg
          px-4
          md:px-0
          py-12
          flex flex-col items-center
        "
      >
        <div className="flex flex-col items-center mb-10">
          <div className="bg-aurora-electric-purple/20 p-4 rounded-full mb-3 shadow-aurora-glow">
            <LayoutDashboard className="h-10 w-10 text-aurora-electric-purple" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold aurora-text-gradient text-center">
            Gerenciar Conteúdo
          </h1>
          <p className="text-lg text-purple-300 font-light mt-2 text-center max-w-2xl">
            Administre materiais, vídeos e artigos científicos do sistema.
          </p>
        </div>
        <div className="w-full max-w-5xl flex flex-col gap-8">
          {/* Materiais */}
          <Card className="aurora-card shadow-aurora-glow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 aurora-text-gradient">
                <FileText className="h-5 w-5" />
                Materiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MaterialContentManager />
            </CardContent>
          </Card>
          {/* Vídeos */}
          <Card className="aurora-card shadow-aurora-glow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 aurora-text-gradient">
                <Video className="h-5 w-5" />
                Vídeos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VideoContentManager />
            </CardContent>
          </Card>
          {/* Artigos Científicos */}
          <Card className="aurora-card shadow-aurora-glow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 aurora-text-gradient">
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
