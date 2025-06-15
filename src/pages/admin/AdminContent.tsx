
import React from "react";
import { LayoutDashboard, FileText, Video, BookOpen } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import MaterialContentManager from "@/components/admin/MaterialContentManager";
import ScientificArticleManager from "@/components/admin/ScientificArticleManager";
import VideoContentManager from "@/components/admin/VideoContentManager";

const AdminContent: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Administração de Conteúdo</h1>
            <p className="text-slate-400">
              Gerencie todos os materiais, vídeos e artigos científicos
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        {/* Materiais */}
        <Card className="aurora-card border-0 shadow-aurora-glow">
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
        <Card className="aurora-card border-0 shadow-aurora-glow">
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
        <Card className="aurora-card border-0 shadow-aurora-glow">
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
  );
};

export default AdminContent;
