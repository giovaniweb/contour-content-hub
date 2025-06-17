
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { FileText } from "lucide-react";
import MaterialContentManager from "@/components/admin/MaterialContentManager";

const AdminMaterials: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-400" />
              Materiais e Arquivos
            </h1>
            <p className="text-muted-foreground">
              Gerencie PDFs, PSDs, logomarcas e outros arquivos da plataforma
            </p>
          </div>
        </div>
        
        <MaterialContentManager />
      </div>
    </AdminLayout>
  );
};

export default AdminMaterials;
