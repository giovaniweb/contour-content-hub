
import React from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { BrainCircuit } from "lucide-react";
import AkinatorMarketingConsultant from "@/components/akinator-marketing-consultant/AkinatorMarketingConsultant";

const MarketingConsultant: React.FC = () => {
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
        </div>

        <div className="max-w-4xl mx-auto">
          <AkinatorMarketingConsultant />
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketingConsultant;
