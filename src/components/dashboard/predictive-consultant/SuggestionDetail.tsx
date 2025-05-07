
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

// Define local type for suggestion type
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

interface SuggestionDetailProps {
  suggestion: Suggestion | null;
  onActionClick: (suggestion: Suggestion) => void;
  getTypeLabel: (type: SuggestionType) => string;
}

const SuggestionDetail: React.FC<SuggestionDetailProps> = ({ 
  suggestion, 
  onActionClick, 
  getTypeLabel 
}) => {
  if (!suggestion) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center text-gray-500">
        <p>Selecione uma sugestão para ver mais detalhes</p>
      </div>
    );
  }

  const formattedDate = new Date(suggestion.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="flex justify-between items-start mb-2">
        <Badge variant="outline" className="bg-primary/10">
          {getTypeLabel(suggestion.type)}
        </Badge>
        {suggestion.isNew && (
          <Badge className="bg-red-100 text-red-800">
            Nova
          </Badge>
        )}
      </div>

      <h3 className="font-medium text-lg mb-2">{suggestion.title}</h3>
      
      <p className="text-gray-600 text-sm mb-4">
        {suggestion.description}
      </p>
      
      {suggestion.score !== undefined && (
        <div className="mb-4">
          <span className="text-xs text-gray-500">Relevância:</span>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-primary h-1.5 rounded-full" 
              style={{ width: `${suggestion.score}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-xs text-gray-500">{formattedDate}</span>
        
        {suggestion.action && (
          <Button 
            size="sm" 
            onClick={() => onActionClick(suggestion)}
            className="gap-1"
          >
            {suggestion.action}
            <ArrowRight className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuggestionDetail;
