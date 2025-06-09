
import React from 'react';
import { TrendingUp } from "lucide-react";
import { DiagnosticSection } from './DiagnosticSection';

interface InsightsSectionProps {
  content: string;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ content }) => {
  return (
    <DiagnosticSection
      title="📈 Insights Estratégicos Fluida"
      content={content}
      icon={<TrendingUp className="h-4 w-4 text-green-400" />}
      color="green-400"
      index={0}
    />
  );
};
