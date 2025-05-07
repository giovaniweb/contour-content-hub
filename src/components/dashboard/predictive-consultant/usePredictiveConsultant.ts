
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define suggestion types directly here to avoid circular dependencies
type SuggestionType = 'script' | 'content' | 'marketing' | 'video' | 'equipment';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: SuggestionType;
  path?: string;
  action?: string;
  isNew?: boolean;
  score?: number;
  createdAt: string;
}

export const usePredictiveConsultant = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulação de carregamento de sugestões
    const fetchSuggestions = () => {
      setTimeout(() => {
        const mockSuggestions: Suggestion[] = [
          {
            id: '1',
            title: 'Criar roteiro sobre Equipamento XYZ',
            description: 'Baseado nos seus roteiros recentes, este equipamento está alinhado com sua estratégia de conteúdo.',
            type: 'script',
            path: '/script-generator',
            action: 'Criar Roteiro',
            isNew: true,
            score: 87,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Valide seu último roteiro',
            description: 'Você criou um roteiro recentemente mas não o validou. Recomendamos validá-lo para garantir qualidade.',
            type: 'script',
            path: '/script-validation',
            action: 'Validar Roteiro',
            score: 92,
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Estratégia de Conteúdo para Q3',
            description: 'Com base no seu histórico, é hora de planejar o próximo trimestre.',
            type: 'content',
            path: '/content-strategy',
            action: 'Planejar Estratégia',
            score: 85,
            createdAt: new Date().toISOString()
          },
          {
            id: '4',
            title: 'Novo lançamento de produto',
            description: 'Planeje um lançamento para seu novo produto usando o consultor de marketing.',
            type: 'marketing',
            path: '/marketing-consultant',
            action: 'Iniciar Planejamento',
            isNew: true,
            score: 95,
            createdAt: new Date().toISOString()
          },
        ];
        
        setSuggestions(mockSuggestions);
        setLoading(false);
      }, 1500);
    };
    
    fetchSuggestions();
  }, []);
  
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
  };
  
  const handleActionClick = (suggestion: Suggestion) => {
    if (suggestion.path) {
      navigate(suggestion.path);
    } else {
      toast({
        title: "Ação indisponível",
        description: "Esta funcionalidade ainda não está disponível.",
      });
    }
  };
  
  return {
    suggestions,
    loading,
    selectedSuggestion,
    handleSuggestionClick,
    handleActionClick
  };
};
