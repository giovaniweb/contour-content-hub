
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useContentPlanner } from "@/hooks/useContentPlanner";
import { MarketingConsultantState } from '../types';
import { generateContentSuggestions } from './content-suggestions/suggestionGenerator';
import { ContentSuggestion } from './content-suggestions/types';
import ContentSuggestionCard from './content-suggestions/ContentSuggestionCard';

interface ContentSuggestionCardsProps {
  state: MarketingConsultantState;
  diagnostic: string;
}

const ContentSuggestionCards: React.FC<ContentSuggestionCardsProps> = ({
  state,
  diagnostic
}) => {
  const { addItem } = useContentPlanner();

  const suggestions = generateContentSuggestions(state);

  const handleAddToPlanner = async (suggestion: ContentSuggestion) => {
    try {
      const newItem = await addItem({
        title: suggestion.title,
        description: suggestion.description,
        format: suggestion.format,
        objective: suggestion.objective,
        status: 'idea',
        tags: ['sugestão-ia', 'diagnóstico', suggestion.equipment].filter(Boolean),
        equipmentName: suggestion.equipment,
        aiGenerated: true
      });

      if (newItem) {
        toast.success("💡 Ideia adicionada ao planejador!", {
          description: `"${suggestion.title}" foi adicionada às suas ideias`
        });
      }
    } catch (error) {
      toast.error("❌ Erro ao adicionar ao planejador", {
        description: "Tente novamente em alguns instantes"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold aurora-heading flex items-center gap-2 text-slate-50">
            <Sparkles className="h-5 w-5 text-aurora-electric-purple" />
            Sugestões Inteligentes de Conteúdo
          </h3>
          <p className="text-sm aurora-body opacity-70 mt-1 text-slate-400">
            Baseadas no seu diagnóstico personalizado
          </p>
        </div>
        <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple bg-aurora-electric-purple/10">
          {suggestions.length} ideias prontas
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => (
          <ContentSuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            index={index}
            onAddToPlanner={handleAddToPlanner}
          />
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-xs aurora-body opacity-60">
          💡 Dica: Essas sugestões foram criadas com base no seu diagnóstico. Personalize conforme sua audiência!
        </p>
      </div>
    </div>
  );
};

export default ContentSuggestionCards;
