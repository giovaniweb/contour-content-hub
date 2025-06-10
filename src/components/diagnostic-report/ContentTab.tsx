
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Trello } from "lucide-react";
import { toast } from "sonner";
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
  const navigate = useNavigate();

  const getMainSpecialty = () => {
    if (session.state.clinicType === 'clinica_medica') {
      return session.state.medicalSpecialty || 'Medicina';
    }
    return session.state.aestheticFocus || 'Estética';
  };

  const contentSuggestions = generateContentSuggestions(getMainSpecialty());

  const handleGoToPlanner = () => {
    toast.success("📋 Redirecionando para o Planejador", {
      description: "Organize suas ideias de conteúdo no planejador!"
    });
    navigate('/content-planner');
  };

  return (
    <div className="space-y-6">
      {/* Header com botão para o planejador */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sugestões de Conteúdo</h2>
          <p className="text-foreground/60">Ideias personalizadas baseadas no seu diagnóstico</p>
        </div>
        <Button 
          onClick={handleGoToPlanner}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Trello className="h-4 w-4" />
          📋 Ir para o Planejador
        </Button>
      </div>

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
