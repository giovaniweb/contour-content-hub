
import React from "react";
import Layout from "@/components/Layout";

export const EquipmentLoading: React.FC = () => {
  return (
    <Layout title="Carregando...">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </Layout>
  );
};
