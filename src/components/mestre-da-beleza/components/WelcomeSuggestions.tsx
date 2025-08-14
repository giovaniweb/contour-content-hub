import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const WelcomeSuggestions: React.FC<WelcomeSuggestionsProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    "Crie um roteiro para Instagram sobre botox",
    "Me ensine protocolo de harmonização facial", 
    "Qual equipamento é melhor para flacidez?",
    "Mostre vídeos sobre preenchimento labial",
    "Quero estudar radiofrequência",
    "Preciso de artigos sobre criolipólise"
  ];

  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">💡 Experimente perguntar:</p>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {suggestions.slice(0, 6).map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="text-sm py-3 px-4 rounded-2xl bg-muted/50 border border-border hover:bg-muted transition-all duration-200 hover:border-primary/50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSuggestions;