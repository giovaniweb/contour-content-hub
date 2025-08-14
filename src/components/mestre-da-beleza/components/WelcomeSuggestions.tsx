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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">💡 Experimente perguntar:</p>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
        {suggestions.slice(0, 6).map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSuggestionClick(suggestion)}
            className="text-xs py-2 px-4 rounded-full bg-muted/50 border border-border hover:bg-muted transition-all duration-200 hover:scale-105"
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default WelcomeSuggestions;