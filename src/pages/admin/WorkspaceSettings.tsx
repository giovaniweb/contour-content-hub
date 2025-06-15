
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";

const WorkspaceSettings: React.FC = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Configurações do Workspace</h1>
        <p>Configurações da área de trabalho do admin.</p>
      </div>
    </AdminLayout>
  );
};

export default WorkspaceSettings;

