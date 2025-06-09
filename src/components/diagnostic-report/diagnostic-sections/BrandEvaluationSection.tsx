
import React from 'react';
import { Palette } from "lucide-react";
import { DiagnosticSection } from './DiagnosticSection';

interface BrandEvaluationSectionProps {
  content: string;
}

export const BrandEvaluationSection: React.FC<BrandEvaluationSectionProps> = ({ content }) => {
  return (
    <DiagnosticSection
      title="🎨 Avaliação de Marca e Atendimento"
      content={content}
      icon={<Palette className="h-4 w-4 text-pink-400" />}
      color="pink-400"
      index={2}
    />
  );
};
