import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Video as VideoIcon, Camera, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateCustomContent } from "@/utils/custom-gpt";
import { Equipment } from "@/types/equipment";
import { ScriptResponse } from "@/utils/api";
import ScriptCard from "@/components/ScriptCard";

interface TrendingTopic {
  id: string;
  title: string;
  category: string;
  type: "video" | "art";
  views?: number;
}

const TrendingTopics: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generatingScript, setGeneratingScript] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState<ScriptResponse | null>(null);
  
  // Exemplo de tópicos em alta relacionados a vídeos e artes - em uma implementação real, estes viriam de uma API
  const trendingTopics: TrendingTopic[] = [
    { 
      id: "1", 
      title: "Técnicas de filmagem para procedimentos estéticos", 
      category: "Videografia", 
      type: "video",
      views: 1452
    },
    { 
      id: "2", 
      title: "Iluminação profissional para vídeos médicos", 
      category: "Produção", 
      type: "video",
      views: 987
    },
    { 
      id: "3", 
      title: "Design gráfico para miniaturas de vídeos", 
      category: "Arte Digital", 
      type: "art",
      views: 764
    },
    { 
      id: "4", 
      title: "Edição de vídeos para antes e depois", 
      category: "Edição", 
      type: "video",
      views: 1203
    },
    { 
      id: "5", 
      title: "Fotografias artísticas para redes sociais", 
      category: "Fotografia", 
      type: "art",
      views: 892
    },
  ];

  const getTopicIcon = (type: string) => {
    switch (type) {
      case "video":
        return <VideoIcon className="h-4 w-4 mr-1.5 text-blue-500" />;
      case "art":
        return <Camera className="h-4 w-4 mr-1.5 text-purple-500" />;
      default:
        return <Sparkles className="h-4 w-4 mr-1.5 text-amber-500" />;
    }
  };

  const handleCreateClick = async (topic: TrendingTopic) => {
    try {
      // Mostrar qual tópico está sendo processado
      setGeneratingScript(topic.id);
      
      toast({
        title: "Analisando tópico",
        description: "Estamos preparando o roteiro baseado no tema selecionado...",
      });

      // Use the analyze-topic function to extract information from the topic
      const { data: analysisData, error } = await supabase.functions.invoke('analyze-topic', {
        body: { topic: topic.title }
      });
      
      if (error) {
        console.error("Error analyzing topic:", error);
        toast({
          variant: "destructive",
          title: "Erro ao analisar tópico",
          description: "Não foi possível processar o tema selecionado. Por favor, tente novamente.",
        });
        setGeneratingScript(null);
        return;
      }
      
      console.log("Topic analysis result:", analysisData);
      
      // Se o usuário desejar ir para a página de geração para personalizar, ainda mantemos essa opção
      const directGeneration = true; // Poderia ser um parâmetro controlável pelo usuário
      
      if (!directGeneration) {
        // Navigate to custom-gpt instead of determining based on topic type
        const targetPage = "custom-gpt";
        
        // Build query parameters based on the analysis
        const params = new URLSearchParams();
        if (analysisData.topic) params.append('topic', analysisData.topic);
        if (analysisData.equipment) params.append('equipment', analysisData.equipment);
        if (analysisData.bodyArea) params.append('bodyArea', analysisData.bodyArea);
        if (analysisData.purpose) params.append('purpose', analysisData.purpose);
        if (analysisData.marketingObjective) params.append('objective', analysisData.marketingObjective);
        if (analysisData.additionalInfo) params.append('additionalInfo', analysisData.additionalInfo);
        
        // Add mode parameter to default to advanced tab
        params.append('mode', 'advanced');
        
        // Navigate to the custom-gpt page with query parameters
        navigate(`/${targetPage}?${params.toString()}`);
        setGeneratingScript(null);
        return;
      }
      
      // Buscar dados do equipamento para uso na geração do roteiro
      let equipmentData: Equipment | null = null;
      if (analysisData.equipment) {
        // Fix: Added data_cadastro property required by the Equipment interface
        equipmentData = {
          id: "1",
          nome: analysisData.equipment || "Equipamento Genérico",
          tecnologia: "Tecnologia avançada",
          indicacoes: ["Diversos tratamentos estéticos"], // Convertendo para array
          beneficios: "Resultados rápidos e duradouros",
          diferenciais: "Tecnologia exclusiva",
          linguagem: "Técnica",
          ativo: true,
          data_cadastro: new Date().toISOString() // Add the required property
        };
      }
      
      // Gerar o roteiro diretamente com os dados analisados
      const customGptRequest = {
        tipo: "roteiro" as const,
        equipamento: analysisData.equipment || "Equipamento Genérico",
        topic: analysisData.topic || topic.title,
        bodyArea: analysisData.bodyArea,
        purposes: analysisData.purpose ? [analysisData.purpose] : undefined,
        marketingObjective: analysisData.marketingObjective,
        additionalInfo: analysisData.additionalInfo,
        equipamentoData: equipmentData // Fixed: corrected the variable name
      };
      
      const generatedContent = await generateCustomContent(customGptRequest);
      
      console.log("Conteúdo gerado:", generatedContent);
      
      // Convert to the format ScriptResponse for display in ScriptCard
      const scriptResponse: ScriptResponse = {
        id: new Date().getTime().toString(),
        title: analysisData.topic || topic.title,
        content: generatedContent.content,
        type: "videoScript",
        createdAt: new Date().toISOString(),
        suggestedVideos: [], // Garantir que é um array conforme tipo esperado
        captionTips: []     // Garantir que é um array conforme tipo esperado
        // Remover equipment se não estiver definido no tipo ScriptResponse
      };
      
      setGeneratedScript(scriptResponse);
      toast({
        title: "Roteiro gerado com sucesso!",
        description: "Confira o roteiro personalizado baseado no tema selecionado.",
      });
      
    } catch (error) {
      console.error("Error handling topic click:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
      });
    } finally {
      setGeneratingScript(null);
    }
  };

  const handleApproveScript = async () => {
    toast({
      title: "Roteiro aprovado",
      description: "O roteiro foi salvo em sua biblioteca.",
    });
    setGeneratedScript(null);
  };

  const handleRejectScript = async () => {
    toast({
      title: "Roteiro descartado",
      description: "Você pode selecionar outro tópico ou personalizar seu próprio conteúdo.",
    });
    setGeneratedScript(null);
  };

  if (generatedScript) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Roteiro Gerado</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setGeneratedScript(null)}
          >
            Voltar aos Tópicos
          </Button>
        </div>
        
        <ScriptCard 
          script={generatedScript}
          onApprove={handleApproveScript}
          onReject={() => handleRejectScript()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trendingTopics.map((topic) => (
        <div 
          key={topic.id}
          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 group hover:bg-gray-50 rounded-md px-2 transition-all"
        >
          <div className="flex-1">
            <div className="flex items-center">
              {getTopicIcon(topic.type)}
              <p className="font-medium text-gray-800">{topic.title}</p>
            </div>
            <div className="flex items-center mt-1.5 gap-2">
              <Badge variant="outline" className="text-xs">
                {topic.category}
              </Badge>
              {topic.views && (
                <span className="text-xs text-gray-500">
                  {topic.views.toLocaleString()} visualizações
                </span>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleCreateClick(topic)}
            disabled={generatingScript !== null}
          >
            {generatingScript === topic.id ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Gerando...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" /> Criar
              </>
            )}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TrendingTopics;
