
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Building2, Sparkles } from "lucide-react";

interface ClinicTypeIndicatorProps {
  clinicType: string;
}

const ClinicTypeIndicator: React.FC<ClinicTypeIndicatorProps> = ({ clinicType }) => {
  const isMedical = clinicType === 'clinica_medica';
  
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
      {isMedical ? (
        <>
          <Building2 className="h-5 w-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">🧪 Clínica Médica</span>
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5 text-pink-400" />
          <span className="text-sm font-medium text-pink-400">💆‍♀️ Clínica Estética</span>
        </>
      )}
    </div>
  );
};

export default ClinicTypeIndicator;
