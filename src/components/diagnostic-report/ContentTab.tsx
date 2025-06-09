
import React from 'react';
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { ContentSuggestionCard } from './content-tab/ContentSuggestionCard';
import { ContentIdeasSection } from './content-tab/ContentIdeasSection';
import { PublishingSchedule } from './content-tab/PublishingSchedule';
import { generateContentSuggestions, contentIdeas } from './content-tab/contentSuggestions';
import { getPlatformColor, getEngagementColor } from './content-tab/utils';

interface ContentTabProps {
  session: DiagnosticSession;
}

const ContentTab: React.FC<ContentTabProps> = ({ session }) => {
  const getMainSpecialty = () => {
    if (session.state.clinicType === 'clinica_medica') {
      return session.state.medicalSpecialty || 'Medicina';
    }
    return session.state.aestheticFocus || 'Estética';
  };

  const contentSuggestions = generateContentSuggestions(getMainSpecialty());

  return (
    <div className="space-y-6">
      {/* Sugestões de Conteúdo */}
      <div className="grid gap-6">
        {contentSuggestions.map((suggestion, index) => (
          <ContentSuggestionCard
            key={index}
            suggestion={suggestion}
            getPlatformColor={getPlatformColor}
            getEngagementColor={getEngagementColor}
          />
        ))}
      </div>

      {/* Ideias Extras */}
      <ContentIdeasSection contentIdeas={contentIdeas} />

      {/* Calendário de Publicações */}
      <PublishingSchedule />
    </div>
  );
};

export default ContentTab;
