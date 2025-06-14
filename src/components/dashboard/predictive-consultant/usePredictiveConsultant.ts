
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  fetchUserScripts,
  fetchUserContentPlanner,
  fetchUserEquipments
} from './fetchUserActivity';
import { supabase } from "@/integrations/supabase/client";

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
    const fetchSuggestions = async () => {
      setLoading(true);

      // Buscar sessão do Supabase para pegar o userId atual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      if (!userId) {
        setSuggestions([]);
        setLoading(false);
        toast({
          title: "Faça login para ver sugestões personalizadas",
          variant: "destructive",
        });
        return;
      }

      // Buscar dados reais do usuário
      const [scripts, planner, equipamentos] = await Promise.all([
        fetchUserScripts(userId),
        fetchUserContentPlanner(userId),
        fetchUserEquipments(userId)
      ]);

      const realSuggestions: Suggestion[] = [];

      // Sugestão de roteiro baseada em roteiros não validados
      const latestScript = scripts[0];
      if (latestScript && latestScript.status !== "validado") {
        realSuggestions.push({
          id: `script-${latestScript.id}`,
          title: `Valide seu roteiro: ${latestScript.titulo}`,
          description: "Você gerou um roteiro recentemente e pode validá-lo para melhorar sua performance.",
          type: "script",
          path: "/script-validation",
          isNew: true,
          action: "Validar Roteiro",
          createdAt: latestScript.data_criacao,
          score: 90
        });
      }

      // Sugestão para criar conteúdo baseado em atividades recentes
      if (planner && planner.length > 0) {
        realSuggestions.push({
          id: `planner-${planner[0].id}`,
          title: `Continue sua ideia de conteúdo: ${planner[0].title}`,
          description: planner[0].description || "Ideia aguardando execução.",
          type: "content",
          path: "/content-planner",
          action: "Planejar",
          isNew: false,
          createdAt: planner[0].created_at,
          score: 80
        });
      }

      // Equipamentos utilizados
      if (equipamentos && equipamentos.length > 0) {
        equipamentos.slice(0, 1).forEach((equip: string, idx: number) => {
          realSuggestions.push({
            id: `equipment-${equip}`,
            title: `Destaque seu equipamento: ${equip}`,
            description: `Mostre nas redes sociais um diferencial do equipamento "${equip}".`,
            type: "equipment",
            path: "/marketing-consultant",
            action: "Criar Post",
            isNew: idx === 0,
            createdAt: new Date().toISOString(),
            score: 75
          });
        });
      }

      // Caso nenhum dado, fallback sugestão simples
      if (realSuggestions.length === 0) {
        realSuggestions.push({
          id: `onboarding`,
          title: "Comece agora!",
          description: "Gere seu primeiro roteiro, estratégia de conteúdo ou registre seus equipamentos.",
          type: "marketing",
          path: "/marketing-consultant",
          action: "Iniciar",
          isNew: true,
          createdAt: new Date().toISOString(),
          score: 70
        });
      }

      setSuggestions(realSuggestions);
      setLoading(false);
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
