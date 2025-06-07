
import React from 'react';
import Layout from "@/components/Layout";
import { BrainCircuit } from "lucide-react";
import FluidaConsultant from "@/components/marketing-consultant/FluidaConsultant";

const MarketingConsultant: React.FC = () => {
  return (
    <Layout title="Consultor de Marketing">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Consultor Fluida</h1>
              <p className="text-muted-foreground">
                Estrategista especialista em marketing para clínicas de estética
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <FluidaConsultant />
        </div>
      </div>
    </Layout>
  );
};

export default MarketingConsultant;
