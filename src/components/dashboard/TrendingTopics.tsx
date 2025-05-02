
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Video as VideoIcon, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrendingTopic {
  id: string;
  title: string;
  category: string;
  type: "video" | "art";
  views?: number;
}

const TrendingTopics: React.FC = () => {
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
          <Button variant="outline" size="sm" className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles className="h-3 w-3 mr-1" /> Criar
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TrendingTopics;
