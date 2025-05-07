
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface SuggestionListProps {
  suggestions: Suggestion[];
  selectedSuggestion: Suggestion | null;
  onSuggestionClick: (suggestion: Suggestion) => void;
  getIconForType: (type: SuggestionType) => JSX.Element;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  selectedSuggestion,
  onSuggestionClick,
  getIconForType
}) => {
  return (
    <ScrollArea className="h-full">
      <div className="divide-y">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`p-3 cursor-pointer transition-colors hover:bg-gray-50
              ${selectedSuggestion?.id === suggestion.id ? 'bg-primary/5 border-l-2 border-primary' : ''}
            `}
            onClick={() => onSuggestionClick(suggestion)}
          >
            <div className="flex items-center gap-2 mb-1">
              {getIconForType(suggestion.type)}
              <span className="font-medium text-sm truncate">
                {suggestion.title}
              </span>
              {suggestion.isNew && (
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">
              {suggestion.description}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SuggestionList;
