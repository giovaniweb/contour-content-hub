
import React from 'react';
import { AlertCircle } from "lucide-react";

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-16 w-16 text-white/30 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">
        Nenhum diagnóstico encontrado
      </h3>
      <p className="text-white/70">
        Inicie um novo diagnóstico para começar a usar o Consultor Fluida
      </p>
    </div>
  );
};

export default EmptyState;
