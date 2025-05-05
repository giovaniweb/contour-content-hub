
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Suggestion } from './types';

export function usePredictiveConsultant() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch suggestions
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockSuggestions: Suggestion[] = [
        {
          id: '1',
          title: 'Associação de equipamentos',
          message: 'Vejo que você tem usado o Hipro para papada. Já pensou em associar com o Unyque Pro para resultados de firmeza mais visíveis?',
          type: 'equipment',
          actionText: 'Ver roteiro para Instagram',
          actionPath: '/custom-gpt?preset=hipro_unyque',
          isNew: true
        },
        {
          id: '2',
          title: 'Crescimento notável!',
          message: 'Você está crescendo muito com o Hipro! E me permita dizer: depois que começou com a Fluida, seu marketing ficou afiado. Como consultor, indico considerar o Ultralift como próximo passo.',
          type: 'strategy',
          actionText: 'Conhecer o Ultralift',
          actionPath: '/admin/content?tab=equipment&id=ultralift',
          isNew: true
        },
        {
          id: '3',
          title: 'Retome suas postagens',
          message: 'Lembra que você me contou que queria ver sua clínica com mais movimento? Notei que você está há alguns dias sem postar. Posso te ajudar a voltar com uma campanha de volta à ativa com o que você já tem?',
          type: 'motivation',
          actionText: 'Criar campanha de reativação',
          actionPath: '/marketing-consultant',
          isNew: false
        }
      ];
      
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 1500);
  }, []);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    
    // Mark as read (in a real implementation, this would update the database)
    setSuggestions(prev => 
      prev.map(s => s.id === suggestion.id ? {...s, isNew: false} : s)
    );
  };

  const handleActionClick = (suggestion: Suggestion) => {
    toast({
      title: "Ação iniciada",
      description: `Redirecionando para ${suggestion.actionText}...`,
    });
    navigate(suggestion.actionPath);
  };

  return {
    suggestions,
    loading,
    selectedSuggestion,
    handleSuggestionClick,
    handleActionClick
  };
}
