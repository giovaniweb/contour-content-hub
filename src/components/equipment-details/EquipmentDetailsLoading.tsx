
// Substituir Layout legado por AppLayout
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Loader2 } from 'lucide-react';

export const EquipmentDetailsLoading: React.FC = () => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Carregando detalhes do equipamento...</p>
      </div>
    </AppLayout>
  );
};
