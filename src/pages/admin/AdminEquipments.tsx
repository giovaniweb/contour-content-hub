
import React from "react";
import { Wrench, Plus } from "lucide-react";
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import EquipmentManager from '@/components/admin/EquipmentManager';

const AdminEquipments: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Administração de Equipamentos</h1>
            <p className="text-slate-400">Gerencie todos os equipamentos do sistema</p>
          </div>
        </div>
        <div>
          <Button className="flex items-center gap-2" onClick={() => window.location.href='/admin/equipments/create'}>
            <Plus className="h-4 w-4" />
            Novo Equipamento
          </Button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <EquipmentManager />
    </div>
  );
};

export default AdminEquipments;
