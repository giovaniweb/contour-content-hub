
import React from 'react';
import { BrainCircuit } from "lucide-react";
import { DiagnosticSection } from './DiagnosticSection';

interface StrategicDiagnosticSectionProps {
  content: string;
}

export const StrategicDiagnosticSection: React.FC<StrategicDiagnosticSectionProps> = ({ content }) => {
  return (
    <DiagnosticSection
      title="📊 Diagnóstico Estratégico da Clínica"
      content={content}
      icon={<BrainCircuit className="h-4 w-4 text-aurora-electric-purple" />}
      color="aurora-electric-purple"
      index={3}
    />
  );
};
