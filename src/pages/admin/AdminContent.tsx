import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";

const AdminContent: React.FC = () => {
  return (
    <AdminLayout title="Gerenciar Conteúdo">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciar Conteúdo</h1>
        {/* Admin content management interface will be implemented here */}
        <p>Interface para gerenciar conteúdo.</p>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
