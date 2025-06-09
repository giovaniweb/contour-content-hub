
import React from 'react';
import { Calendar } from "lucide-react";
import { DiagnosticSection } from './DiagnosticSection';

interface ActionPlanSectionProps {
  content: string;
}

export const ActionPlanSection: React.FC<ActionPlanSectionProps> = ({ content }) => {
  return (
    <DiagnosticSection
      title="📅 Plano de Ação Semanal"
      content={content}
      icon={<Calendar className="h-4 w-4 text-aurora-deep-purple" />}
      color="aurora-deep-purple"
      index={5}
    />
  );
};
