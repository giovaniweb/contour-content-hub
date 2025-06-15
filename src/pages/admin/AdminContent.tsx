
import React from "react";
import {
  LayoutDashboard,
  FileText,
  Video,
  BookOpen
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
          flex flex-col
          justify-start
          items-center
          px-4
          py-12
        "
      >
        {/* Header Aurora Boreal */}
        <div className="w-full max-w-5xl flex flex-col items-center mb-12">
          <div className="bg-aurora-electric-purple/20 p-4 rounded-full mb-3 shadow-aurora-glow">
            <LayoutDashboard className="h-10 w-10 text-aurora-electric-purple" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold aurora-text-gradient text-center">
            Gerenciar Conteúdo
          </h1>
          <p className="text-lg text-purple-200 font-light mt-2 text-center max-w-2xl md:text-xl">
            Administre <span className="font-semibold text-purple-300">Materiais</span>, <span className="font-semibold text-purple-300">Vídeos</span> e <span className="font-semibold text-purple-300">Artigos Científicos</span> do sistema.
          </p>
        </div>
        {/* Cards principais */}
        <div className="w-full max-w-5xl flex flex-col gap-10">
          {/* Materiais */}
          <Card className="aurora-card shadow-aurora-glow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 aurora-text-gradient text-2xl">
                <FileText className="h-6 w-6" />
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
              <CardTitle className="flex items-center gap-2 aurora-text-gradient text-2xl">
                <Video className="h-6 w-6" />
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
              <CardTitle className="flex items-center gap-2 aurora-text-gradient text-2xl">
                <BookOpen className="h-6 w-6" />
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
