
import React from 'react';
import { BrainCircuit } from "lucide-react";

const ConsultantHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-3">
        <BrainCircuit className="h-12 w-12 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Consultor Fluida</h1>
          <p className="text-slate-400">
            Sua central de inteligência em marketing para clínicas
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsultantHeader;
