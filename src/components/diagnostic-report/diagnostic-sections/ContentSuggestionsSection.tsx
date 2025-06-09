
import React from 'react';
import { Lightbulb } from "lucide-react";
import { DiagnosticSection } from './DiagnosticSection';

interface ContentSuggestionsSectionProps {
  content: string;
}

export const ContentSuggestionsSection: React.FC<ContentSuggestionsSectionProps> = ({ content }) => {
  return (
    <DiagnosticSection
      title="💡 Sugestões de Conteúdo Personalizado"
      content={content}
      icon={<Lightbulb className="h-4 w-4 text-aurora-sage" />}
      color="aurora-sage"
      index={4}
    />
  );
};
