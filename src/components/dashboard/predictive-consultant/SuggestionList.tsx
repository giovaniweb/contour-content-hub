
import React from 'react';
import { Suggestion } from './types';

interface SuggestionListProps {
  suggestions: Suggestion[];
  selectedSuggestion: Suggestion | null;
  onSuggestionClick: (suggestion: Suggestion) => void;
  getIconForType: (type: string) => JSX.Element;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  selectedSuggestion,
  onSuggestionClick,
  getIconForType
}) => {
  return (
    <div className="h-full overflow-auto">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          onClick={() => onSuggestionClick(suggestion)}
          className={`p-3 border-b cursor-pointer flex items-center gap-3 hover:bg-muted/50 transition-colors ${
            selectedSuggestion?.id === suggestion.id ? 'bg-muted/50' : ''
          }`}
        >
          <div className={`p-2 rounded-full ${
            suggestion.type === 'equipment' ? 'bg-yellow-100' :
            suggestion.type === 'content' ? 'bg-blue-100' :
            suggestion.type === 'strategy' ? 'bg-green-100' :
            'bg-purple-100'
          }`}>
            {getIconForType(suggestion.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm truncate">{suggestion.title}</p>
              {suggestion.isNew && (
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {suggestion.message.substring(0, 50)}...
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionList;
