
import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface SearchInputProps {
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement>;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  typingText: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  onQueryChange,
  onSubmit,
  placeholder,
  inputRef,
  isFocused,
  onFocus,
  onBlur,
  typingText
}) => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "0 0 15px rgba(120, 120, 255, 0.3)" }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50"></div>
      
      <form 
        onSubmit={onSubmit}
        className="relative backdrop-blur border border-white/20 rounded-2xl px-4 py-4"
      >
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={onQueryChange}
            placeholder={!isFocused && !query ? typingText : placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            className="flex-grow bg-transparent text-gray-800 p-3 outline-none placeholder:text-gray-500 text-lg font-montserrat"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="relative bg-gradient-to-r from-blue-400 to-purple-400 text-white p-3 rounded-full transition-colors"
          >
            <Send className="h-5 w-5" />
            {/* Pulsing neon effect around button */}
            <motion.div
              className="absolute inset-0 rounded-full z-[-1]"
              animate={{ 
                boxShadow: ['0 0 0px rgba(120, 120, 255, 0.4)', '0 0 10px rgba(120, 120, 255, 0.8)', '0 0 0px rgba(120, 120, 255, 0.4)'],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.button>
        </div>

        {/* Focus ring animation */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-2xl z-[-1]"
            initial={{ opacity: 0.5 }}
            animate={{ 
              boxShadow: ['0 0 0px rgba(120, 120, 255, 0.2)', '0 0 10px rgba(120, 120, 255, 0.6)', '0 0 0px rgba(120, 120, 255, 0.2)'],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </form>
    </motion.div>
  );
};

export default SearchInput;
