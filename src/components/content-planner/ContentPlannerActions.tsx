
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";

interface ContentPlannerActionsProps {
  onNewItem: () => void;
  onGenerateSuggestions: () => void;
  isGeneratingSuggestions: boolean;
}

const ContentPlannerActions: React.FC<ContentPlannerActionsProps> = ({
  onNewItem,
  onGenerateSuggestions,
  isGeneratingSuggestions
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={onGenerateSuggestions}
        disabled={isGeneratingSuggestions}
        className="flex items-center"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isGeneratingSuggestions ? "Gerando..." : "Gerar Sugestões"}
      </Button>
      <Button onClick={onNewItem} className="flex items-center">
        <Plus className="h-4 w-4 mr-2" />
        Novo Conteúdo
      </Button>
    </div>
  );
};

export default ContentPlannerActions;
