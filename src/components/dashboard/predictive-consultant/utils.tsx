
import React from 'react';
import { Sparkles, MessageSquare, Lightbulb, TrendingUp } from "lucide-react";

export const getIconForType = (type: string) => {
  switch (type) {
    case 'equipment':
      return <Sparkles className="h-4 w-4 text-yellow-500" />;
    case 'content':
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case 'strategy':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'motivation':
      return <Lightbulb className="h-4 w-4 text-purple-500" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
};

export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'equipment':
      return 'Equipamento';
    case 'content':
      return 'Conteúdo';
    case 'strategy':
      return 'Estratégia';
    case 'motivation':
      return 'Motivação';
    default:
      return type;
  }
};
