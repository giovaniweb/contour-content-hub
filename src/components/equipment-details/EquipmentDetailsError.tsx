
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";

interface EquipmentDetailsErrorProps {
  error: string;
}

export const EquipmentDetailsError: React.FC<EquipmentDetailsErrorProps> = ({ error }) => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground mb-4">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/equipments')}
        >
          Voltar para equipamentos
        </Button>
      </div>
    </Layout>
  );
};
