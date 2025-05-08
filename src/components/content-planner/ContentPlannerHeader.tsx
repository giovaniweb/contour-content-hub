
import React from "react";
import ContentPlannerActions from "./ContentPlannerActions";

interface ContentPlannerHeaderProps {
  onNewItem: () => void;
  onGenerateSuggestions: () => void;
  isGeneratingSuggestions: boolean;
}

const ContentPlannerHeader: React.FC<ContentPlannerHeaderProps> = ({
  onNewItem,
  onGenerateSuggestions,
  isGeneratingSuggestions
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-2xl font-semibold">Planejador de Conteúdo</h1>
        <p className="text-muted-foreground">
          Organize seu plano de marketing de forma visual e estratégica
        </p>
      </div>
      <ContentPlannerActions 
        onNewItem={onNewItem}
        onGenerateSuggestions={onGenerateSuggestions}
        isGeneratingSuggestions={isGeneratingSuggestions}
      />
    </div>
  );
};

export default ContentPlannerHeader;
