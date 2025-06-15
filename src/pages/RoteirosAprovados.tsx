
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const RoteirosAprovados: React.FC = () => (
  <AppLayout>
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center flex flex-col items-center">
        <Check className="h-12 w-12 text-aurora-emerald mb-2" />
        <h1 className="text-3xl font-bold text-aurora-electric-purple mb-2">Roteiros Aprovados</h1>
        <p className="text-slate-400">Aqui você verá todos os roteiros já aprovados. Filtro, busca e ações em breve!</p>
      </div>
      <Card className="mx-auto max-w-2xl aurora-glass border-aurora-electric-purple/20">
        <CardHeader>
          <CardTitle className="text-aurora-electric-purple">Nenhum roteiro aprovado ainda</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">Quando você aprovar um roteiro, ele aparecerá aqui.</p>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
);

export default RoteirosAprovados;
