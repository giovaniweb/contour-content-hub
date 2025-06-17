
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { BookOpen } from "lucide-react";
import ScientificArticleManager from "@/components/admin/ScientificArticleManager";

const AdminScientificArticles: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-cyan-400" />
              Artigos Científicos
            </h1>
            <p className="text-muted-foreground">
              Gerencie a biblioteca de artigos científicos da plataforma
            </p>
          </div>
        </div>
        
        <ScientificArticleManager />
      </div>
    </AdminLayout>
  );
};

export default AdminScientificArticles;
