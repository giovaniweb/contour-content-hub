
import React from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { BrainCircuit, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AkinatorMarketingConsultant from "@/components/akinator-marketing-consultant/AkinatorMarketingConsultant";

const MarketingConsultant: React.FC = () => {
  const { toast } = useToast();

  const handleViewHistory = () => {
    toast({
      title: "📊 Abrindo histórico de relatórios...",
      description: "Carregando seus diagnósticos anteriores!"
    });
    window.open('/reports', '_blank');
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Consultor Fluida</h1>
              <p className="text-muted-foreground">
                Diagnóstico inteligente para sua clínica de estética
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleViewHistory}
            variant="outline"
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Histórico de Relatórios
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <AkinatorMarketingConsultant />
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketingConsultant;
