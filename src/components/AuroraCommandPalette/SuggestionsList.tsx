
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { SuggestionsListProps } from './types';

const SuggestionsList: React.FC<SuggestionsListProps> = ({ 
  suggestions, 
  onSuggestionClick 
}) => {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <AnimatePresence>
        {suggestions.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggestionClick(item)}
          >
            <Badge 
              variant="outline" 
              className="cursor-pointer py-2 px-3 bg-white/10 backdrop-blur border-white/20 hover:bg-white/20"
            >
              {item}
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SuggestionsList;
