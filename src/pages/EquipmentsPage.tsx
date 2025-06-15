
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Toolbox } from "lucide-react";

const EquipmentsPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center gap-3 mb-4">
          <Toolbox className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-slate-50">Equipamentos</h1>
        </div>
        <div className="bg-muted rounded-xl p-8 text-center text-muted-foreground">
          A listagem e o gerenciamento de equipamentos será implementado aqui.
        </div>
      </div>
    </AppLayout>
  );
};

export default EquipmentsPage;
