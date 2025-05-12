
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface SearchSuggestionsProps {
  suggestions: string[];
  isFocused: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  isFocused,
  onSuggestionClick
}) => {
  if (!isFocused) return null;
  
  return (
    <motion.div 
      className="mt-4 p-4 rounded-xl relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {/* Gradient border effect for container */}
      <div className="absolute inset-0 rounded-xl border border-transparent bg-gradient-to-r from-fluida-blue/30 to-fluida-pink/30 p-0.5">
        <div className="absolute inset-0 rounded-[calc(0.75rem-1px)] bg-white/95"></div>
      </div>
      
      <div className="relative flex flex-wrap gap-3 justify-center">
        <AnimatePresence>
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(155, 135, 245, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick(suggestion)}
              className="rounded-full border border-purple-200 shadow-sm hover:shadow-md transition-all bg-white/80"
            >
              <Badge 
                variant="outline" 
                className="cursor-pointer py-2 px-4 bg-transparent backdrop-blur border-0 hover:bg-purple-50/50 font-montserrat text-gray-700"
              >
                {suggestion}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchSuggestions;
