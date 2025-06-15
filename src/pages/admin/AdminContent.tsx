
import React from "react";
import { FileText, BookOpen, Video } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import MaterialContentManager from "@/components/admin/MaterialContentManager";
import ScientificArticleManager from "@/components/admin/ScientificArticleManager";
import VideoContentManager from "@/components/admin/VideoContentManager";

const AdminContent: React.FC = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-8">
        {/* Header no mesmo estilo do /admin/videos */}
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Administração de Conteúdos</h1>
            <p className="text-slate-400">
              Gerencie materiais, vídeos e artigos científicos do sistema
            </p>
          </div>
        </div>
        {/* Três managers empilhados como seções verticais, igual abordagem do /admin/videos */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5" /> Materiais
            </h2>
            <MaterialContentManager />
          </section>
          <section>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
              <Video className="h-5 w-5" /> Vídeos
            </h2>
            <VideoContentManager />
          </section>
          <section>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5" /> Artigos Científicos
            </h2>
            <ScientificArticleManager />
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
