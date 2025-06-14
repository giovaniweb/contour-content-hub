
import React, { useEffect, useState } from 'react';
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
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSuggestions = async () => {
      setLoading(true);
      try {
        const realSuggestions = await generateContentSuggestions({
          clinicType: state.clinicType,
          medicalSpecialty: state.medicalSpecialty,
          aestheticFocus: state.aestheticFocus,
          currentRevenue: state.currentRevenue
        });
        setSuggestions(realSuggestions || []);
      } catch (e) {
        console.error('Erro ao gerar sugestões reais:', e);
        setSuggestions([]);
        toast.error('Erro ao gerar sugestões reais de conteúdo');
      }
      setLoading(false);
    };
    getSuggestions();
  }, [state.clinicType, state.medicalSpecialty, state.aestheticFocus, state.currentRevenue]);

  const handleAddToPlanner = async (suggestion: ContentSuggestion) => {
    try {
      console.log('🚀 Adicionando sugestão ao planejador:', suggestion);
      
      const newItem = await addItem({
        title: suggestion.title,
        description: suggestion.description,
        format: suggestion.format,
        objective: suggestion.objective,
        status: 'idea',
        tags: ['sugestão-ia', 'diagnóstico', ...(suggestion.equipment ? [suggestion.equipment] : [])],
        equipmentName: suggestion.equipment,
        aiGenerated: true,
        distribution: 'Instagram'
      });

      if (newItem) {
        toast.success("💡 Sugestão adicionada ao planejador!", {
          description: `"${suggestion.title}" foi adicionada às suas ideias. Acesse o Planejador para organizar.`
        });
        
        console.log('✅ Item criado com sucesso:', newItem);
      } else {
        throw new Error('Falha ao criar item no planejador');
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar ao planejador:', error);
      toast.error("❌ Erro ao adicionar ao planejador", {
        description: "Não foi possível adicionar a sugestão. Tente novamente."
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-white">
        <Sparkles className="h-6 w-6 mx-auto animate-pulse mb-2 text-aurora-electric-purple" />
        <span className="block text-lg font-semibold mt-2">Gerando sugestões com dados reais...</span>
        <span className="block text-sm mt-2 opacity-70">Buscando os melhores equipamentos e oportunidades para sua clínica.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold aurora-heading flex items-center gap-2 text-slate-50">
            <Sparkles className="h-5 w-5 text-aurora-electric-purple" />
            Sugestões Inteligentes de Conteúdo
          </h3>
          <p className="text-sm aurora-body opacity-70 mt-1 text-slate-400">
            Baseadas no seu diagnóstico personalizado e equipamentos reais da sua clínica
          </p>
        </div>
        <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple bg-aurora-electric-purple/10">
          {suggestions.length} ideias reais
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
        <p className="text-xs aurora-body opacity-60 text-slate-400">
          💡 Essas sugestões foram criadas a partir de dados reais informados e ativos do banco de equipamentos.
        </p>
      </div>
    </div>
  );
};

export default ContentSuggestionCards;

