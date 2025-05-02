
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface TrendingTopic {
  id: string;
  title: string;
  category: string;
}

const TrendingTopics: React.FC = () => {
  // Exemplo de tópicos em alta - em uma implementação real, estes viriam de uma API
  const trendingTopics: TrendingTopic[] = [
    { id: "1", title: "Harmonização facial com ácido hialurônico", category: "Estética" },
    { id: "2", title: "Tratamentos para redução de celulite", category: "Corporal" },
    { id: "3", title: "Limpeza de pele profunda", category: "Facial" },
    { id: "4", title: "Botox preventivo: quando começar?", category: "Anti-aging" },
    { id: "5", title: "Radiofrequência para flacidez", category: "Corporal" },
  ];

  return (
    <div className="space-y-3">
      {trendingTopics.map((topic) => (
        <div 
          key={topic.id}
          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
        >
          <div className="flex-1">
            <p className="font-medium text-gray-800">{topic.title}</p>
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
              {topic.category}
            </span>
          </div>
          <Button variant="outline" size="sm" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" /> Criar
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TrendingTopics;
