import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";

const WorkspaceSettings: React.FC = () => {
  return (
    <AdminLayout title="Configurações do Workspace">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Configurações do Workspace</h1>
        {/* Workspace settings content will be implemented here */}
        <p>Configurações gerais do workspace.</p>
      </div>
    </AdminLayout>
  );
};

export default WorkspaceSettings;
