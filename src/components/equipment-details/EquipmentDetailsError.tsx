
// Substituir Layout legado por AppLayout
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";

interface EquipmentDetailsErrorProps {
  error: string;
}

export const EquipmentDetailsError: React.FC<EquipmentDetailsErrorProps> = ({ error }) => {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground mb-4">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/admin/equipments')}
        >
          Voltar para equipamentos
        </Button>
      </div>
    </AppLayout>
  );
};
