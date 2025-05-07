
import React from 'react';
import { FileText, TrendingUp, LineChart, Film, Database } from 'lucide-react';

// Define suggestion types directly here to avoid circular dependencies
type SuggestionType = 'script' | 'content' | 'marketing' | 'video' | 'equipment';

// Return the appropriate icon based on suggestion type
export const getIconForType = (type: SuggestionType) => {
  switch (type) {
    case 'script':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'content':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'marketing':
      return <LineChart className="h-4 w-4 text-purple-500" />;
    case 'video':
      return <Film className="h-4 w-4 text-amber-500" />;
    case 'equipment':
      return <Database className="h-4 w-4 text-indigo-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

// Convert type to user-friendly label
export const getTypeLabel = (type: SuggestionType) => {
  switch (type) {
    case 'script':
      return 'Roteiro';
    case 'content':
      return 'Conteúdo';
    case 'marketing':
      return 'Marketing';
    case 'video':
      return 'Vídeo';
    case 'equipment':
      return 'Equipamento';
    default:
      return 'Geral';
  }
};
