
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

interface EquipmentDetailsErrorProps {
  title: string;
  message: string;
}

export const EquipmentDetailsError: React.FC<EquipmentDetailsErrorProps> = ({ 
  title, 
  message 
}) => {
  return (
    <Layout title={title}>
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <h2 className="text-2xl font-semibold text-destructive">{title}</h2>
        <p className="text-muted-foreground">{message}</p>
        <Button asChild>
          <Link to="/admin/equipments">Voltar para Gerenciamento de Equipamentos</Link>
        </Button>
      </div>
    </Layout>
  );
};
